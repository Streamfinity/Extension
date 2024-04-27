import browser from 'webextension-polyfill';
import {
    storageGetToken, clearStorage, storageSetToken, storageSetSettingVisible,
} from '~/entries/background/common/storage';
import { getExtensionStatus, createPlaybackProgress, getAuthenticatedUser } from '~/entries/background/common/api';
import { EVENT_REFRESH_AUTH, EVENT_REFRESH_SETTINGS } from '~/messages';
import { why } from '~/common/pretty';
import { sendMessageToContentScript } from '~/entries/background/common/spaceship';
import { createLogger } from '~/common/log';

const log = createLogger('Background');

/**
 * @type {{user}}
 */
let extensionStatus = {};

export async function getStatus() {
    const token = await storageGetToken();

    if (!token) {
        return { user: null };
    }

    const { data } = await getExtensionStatus();

    extensionStatus = data?.data || {};

    // WARNING: browser.action is not available in Firefox for some reason
    if (browser.action) {
        if (extensionStatus?.liveStreams?.length > 0) {
            await browser.action.setBadgeText({ text: `${extensionStatus.liveStreams.length}` });
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

export async function logout() {
    await clearStorage();

    await sendMessageToContentScript(EVENT_REFRESH_AUTH);

    return { success: true };
}

export async function sendPlayerProgress(data) {
    if (!extensionStatus.user) {
        log.debug('no status adata, dont send player progress');
        return { success: false };
    }

    if (extensionStatus.live_streams.length === 0) {
        log.debug('on stream live');
        return { success: false };
    }

    await createPlaybackProgress({
        data,
        liveStreamId: extensionStatus.live_streams[0].id,
    });

    return { success: true };
}

export async function loginFetchUser(accessToken) {
    try {
        const { data } = await getAuthenticatedUser({
            token: accessToken,
        });

        log.debug('login validate', 'ok');
        log.debug('storing token...', accessToken);

        await storageSetToken(accessToken);

        return { user: data.data };
    } catch (err) {
        log.error('error checking data', err);
    }

    return { user: null };
}

export async function login() {
    const redirectUri = browser.identity.getRedirectURL();

    const url = `${import.meta.env.VITE_API_URL}/oauth/authorize?${new URLSearchParams({
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
        log.warn('login', 'error', err);

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
