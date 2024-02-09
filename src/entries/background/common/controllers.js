import browser from 'webextension-polyfill';
import {
    searchSuggestionAccounts,
    submitSuggestion,
    getWatchedReactions,
    submitReaction,
    getReactionPolicy,
    getContentRatings,
    createPlaybackProgress,
    getExtensionStatus, getAuthenticatedUser, getReactionsForVideo,
} from '~/entries/background/common/api';
import {
    storageGetToken, clearStorage, storageGetAll, storageSetToken, storageSetSettingVisible,
} from '~/entries/background/common/storage';
import {
    GET_STATUS,
    PLAYER_PROGRESS,
    LOGOUT,
    SUGGESTIONS_SEARCH_ACCOUNT, SUGGESTIONS_SUBMIT,
    WATCHED_REACTIONS_GET,
    REACTION_SUBMIT, REACTION_POLICY_GET,
    LOGIN, CONTENT_RATINGS_GET, REACTIONS_GET_FOR_VIDEO,
    SETTING_UPDATE_VISIBLE, EVENT_REFRESH_SETTINGS, OPEN_POPUP, SET_BROWSER_THEME, EVENT_REFRESH_AUTH,
} from '~/messages';
import { createLogger } from '~/common/log';
import { why } from '~/common/pretty';

const log = createLogger('Background');

/**
 * @type {{user}}
 */
let extensionStatus = {};

async function sendMessageToContentScript(type, data = {}) {
    const tabs = await browser.tabs.query({ active: true });

    const promises = [async () => {
        try {
            await browser.runtime.sendMessage({
                type,
                data,
            });

            log.debug('SEND <-', type, 'browser.runtime ✅ SENT');
        } catch (err) {
            log.error('SEND <-', type, err);
        }
    }];

    tabs.forEach((tab) => {
        promises.push(async () => {
            try {
                await browser.tabs.sendMessage(tab.id, {
                    type,
                    data,
                });

                log.debug('SEND <-', type, tab, ' ✅ SENT');
            } catch (err) {
                log.error('SEND <-', type, tab, err);
            }
        });
    });

    log.debug('SEND <-', type, `(${tabs.length} tabs)`, tabs);

    try {
        await Promise.all(promises);
    } catch (err) {
        log.error('SEND <-', 'error executing promises');
    }
}

// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------

async function getStatus() {
    const token = await storageGetToken();

    if (!token) {
        return { user: null };
    }

    const { data } = await getExtensionStatus();

    extensionStatus = data?.data || {};

    if (extensionStatus?.accounts?.length > 0) {
        await browser.action.setBadgeText({ text: `${extensionStatus.accounts.length}` });
        await browser.action.setBadgeTextColor({ color: '#fff' });
        await browser.action.setBadgeBackgroundColor({ color: '#f00' });
    } else {
        await browser.action.setBadgeText({ text: null });
    }

    return {
        data: data?.data,
    };
}

async function logout() {
    await clearStorage();

    await sendMessageToContentScript(EVENT_REFRESH_AUTH);

    return { success: true };
}

async function sendPlayerProgress(data) {
    if (!extensionStatus.user) {
        log.debug('no status adata, dont send player progress');
        return;
    }

    if (extensionStatus.live_streams.length === 0) {
        log.debug('on stream live');
        return;
    }

    await createPlaybackProgress({
        data,
        liveStreamId: extensionStatus.live_streams[0].id,
    });
}

async function loginFetchUser(accessToken) {
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

async function login() {
    const redirectUri = browser.identity.getRedirectURL();

    const url = `${import.meta.env.VITE_API_URL}/oauth/authorize?${new URLSearchParams({
        client_id: import.meta.env.VITE_OAUTH_CLIENT_ID,
        response_type: 'token',
        redirect_uri: redirectUri,
        scope: '',
    })}`;

    log.debug('login', 'reidrect', redirectUri);
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

async function updateSettingUpdateVisible(data) {
    await storageSetSettingVisible(data.visible);

    await sendMessageToContentScript(EVENT_REFRESH_SETTINGS);

    return {};
}

async function openPopup() {
    if (!browser.action || !('openPopup' in browser.action)) {
        log.warn('openPopup', 'not available in browser.action');
        return {};
    }

    await browser.action?.openPopup();

    return {};
}

async function updateScheme({ dark }) {
    if (!browser.action) {
        log.warn('updateScheme', 'no browser action available');
        return;
    }

    const sizes = ['16', '32', '48', '128'];
    const icons = {};

    sizes.forEach((size) => {
        icons[size] = `icons/transparent/${dark ? 'light' : 'dark'}-${size}.png`;
    });

    log.debug('updateScheme', dark, icons);

    await browser.action.setIcon({
        path: icons,
    });
}

// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------

async function getResponse(type, data) {
    switch (type) {
    case OPEN_POPUP:
        return openPopup();
    case SET_BROWSER_THEME:
        return updateScheme(data);

    case LOGOUT:
        return logout(data);
    case LOGIN:
        return login(data);
    case GET_STATUS:
        return getStatus(data);
    case PLAYER_PROGRESS:
        return sendPlayerProgress(data);
    case SUGGESTIONS_SEARCH_ACCOUNT:
        return searchSuggestionAccounts(data);
    case SUGGESTIONS_SUBMIT:
        return submitSuggestion(data);
    case WATCHED_REACTIONS_GET:
        return getWatchedReactions(data);
    case REACTION_SUBMIT:
        return submitReaction(data);
    case REACTION_POLICY_GET:
        return getReactionPolicy(data);
    case CONTENT_RATINGS_GET:
        return getContentRatings(data);
    case REACTIONS_GET_FOR_VIDEO:
        return getReactionsForVideo(data);

    case SETTING_UPDATE_VISIBLE:
        return updateSettingUpdateVisible(data);

    default:
        return null;
    }
}

export async function handleMessage(msg) {
    if (typeof msg !== 'object') {
        log.warn('message is not an object', { msg });
        return Promise.resolve();
    }

    const { type, data } = msg;
    log.debug('RECV ->', type, data);

    const response = getResponse(type, data);

    if (response === null) {
        return Promise.resolve();
    }

    return response;
}

// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------

(async () => {
    log.debug('storage', await storageGetAll());
    log.debug('----------------------------------------------');
})();
