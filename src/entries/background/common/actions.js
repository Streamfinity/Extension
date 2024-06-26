import browser from 'webextension-polyfill';
import {
    storageGetToken, clearStorage, storageSetToken, storageSetSettingVisible, storageSetUser,
} from '~/entries/background/common/storage';
import { getExtensionStatus, createPlaybackProgress, getAuthenticatedUser } from '~/entries/background/common/api';
import { EVENT_REFRESH_AUTH, EVENT_REFRESH_SETTINGS, EVENT_NOTICE } from '~/messages';
import { why } from '~/common/pretty';
import { sendMessageToContentScript } from '~/entries/background/common/spaceship';
import { createLogger } from '~/common/log';
import { getApiUrl } from '~/config';

const log = createLogger('Background');

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} display_name
 */

/**
 * @typedef {Object} ExtensionStatus
 * @property {array} live_streams
 * @property {User} user
 */

/**
 * @param {('success','warning','error')} type
 * @param {string} message
 * @returns {Promise<void>}
 */
async function sendNotice(type, message) {
    await sendMessageToContentScript(EVENT_NOTICE, {
        type,
        message,
    });
}

export async function logout() {
    await clearStorage();

    await sendMessageToContentScript(EVENT_REFRESH_AUTH);

    return { success: true };
}

/**
 * @type {ExtensionStatus}
 */
let extensionStatus = {};

export async function getStatus() {
    const token = await storageGetToken();

    if (!token) {
        return {
            user: null,
        };
    }

    const { status, data } = await getExtensionStatus();

    if (status === 401) {
        await sendNotice('error', 'Session is invalid, logging out...');
        return logout();
    }

    if (status !== 200) {
        await sendNotice('error', `Got an error fetching user information: ${status}`);
    }

    extensionStatus = data?.data || {};

    if (extensionStatus.user) {
        await storageSetUser(extensionStatus.user);
    }

    // WARNING: browser.action is not available in Firefox for some reason
    if (browser.action) {
        if (extensionStatus?.live_streams?.length > 0) {
            await browser.action.setBadgeText({ text: `${extensionStatus.live_streams.length}` });
            await browser.action.setBadgeTextColor({ color: '#fff' });
            await browser.action.setBadgeBackgroundColor({ color: '#f00' });
        } else {
            await browser.action.setBadgeText({ text: null });
        }
    }

    return {
        data: data?.data,
    };
}

export async function sendPlayerProgress(data) {
    if (!extensionStatus.user) {
        log.debug('no status data, dont send player progress');

        return {
            success: false,
            message: 'no status data, dont send player progress',
        };
    }

    if (extensionStatus.live_streams.length === 0) {
        log.debug('on stream live');

        return {
            success: false,
            message: 'on stream live',
        };
    }

    await createPlaybackProgress({
        data,
        liveStreamId: extensionStatus.live_streams[0].id,
    });

    return {
        success: true,
    };
}

export async function loginFetchUser(accessToken) {
    try {
        const { data } = await getAuthenticatedUser({
            token: accessToken,
        });

        log.debug('login validate', 'ok');
        log.debug('storing token...', accessToken);

        const user = data.data;

        await storageSetToken(accessToken);
        await storageSetUser(user);

        return { user };
    } catch (err) {
        log.error('error checking data', err);
    }

    return { user: null };
}

export async function login() {
    const redirectUri = browser.identity.getRedirectURL();

    const host = getApiUrl();
    const url = `${host}/oauth/authorize?${new URLSearchParams({
        client_id: import.meta.env.VITE_OAUTH_CLIENT_ID,
        response_type: 'token',
        redirect_uri: redirectUri,
        scope: '',
    })}`;

    log.debug('login', 'redirect', redirectUri);
    log.debug('login', url);

    try {
        // https://cfiiggfhnccbchheekifachmajflgcgn.chromiumapp.org/
        //     #access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ
        //     &token_type=Bearer
        //     &expires_in=31622400
        const responseUrl = await browser.identity.launchWebAuthFlow({
            url,
            interactive: true,
        });

        const parsedUrl = new URL(responseUrl);
        const paramsString = parsedUrl.hash.substring(1);
        const params = new URLSearchParams(paramsString);

        const accessToken = params.get('access_token');

        log.debug('login', 'received success response');

        const response = await loginFetchUser(accessToken);

        await sendMessageToContentScript(EVENT_REFRESH_AUTH, {});

        return response;
    } catch (err) {
        log.warn('login', 'error', url, redirectUri, why(err));

        await sendNotice('error', `Login failed (${why(err)})`);

        return {
            success: false,
            error: why(err),
        };
    }
}

export async function updateSettingUpdateVisible(data) {
    await storageSetSettingVisible(data.visible);

    await sendMessageToContentScript(EVENT_REFRESH_SETTINGS);

    return {};
}

export async function openPopup() {
    // WARNING: browser.action is not available in Firefox for some reason
    if (!browser.action || !('openPopup' in browser.action)) {
        log.warn('openPopup', 'not available in browser.action');
        return {};
    }

    await browser.action?.openPopup();

    return {};
}

export async function updateScheme({ dark }) {
    if (!browser.action) {
        log.warn('updateScheme', 'no browser action available');
        return {};
    }

    const sizes = ['16', '32', '48', '128'];
    const icons = {};

    sizes.forEach((size) => {
        icons[size] = `icons/transparent/${dark ? 'light' : 'dark'}-${size}.png`;
    });

    log.debug('updateScheme', dark);

    await browser.action.setIcon({
        path: icons,
    });

    return {};
}
