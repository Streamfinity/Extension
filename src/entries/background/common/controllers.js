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
    SETTING_UPDATE_VISIBLE, EVENT_REFRESH_SETTINGS,
} from '~/messages';
import { createLogger } from '~/common/log';
import { why } from '~/common/pretty';

const log = createLogger('Background');

/**
 * @type {{user}}
 */
let extensionStatus = {};

/**
 * Sends a message to the content script.
 * @param {string} type - The type of the message.
 * @param {Object} [data={}] - The data to be sent along with the message.
 * @returns {Promise<void>} - A promise that resolves when the message is sent.
 */
async function sendMessageToContentScript(type, data = {}) {
    const [tab] = await browser.tabs.query({ active: true, lastFocusedWindow: true });

    await browser.tabs.sendMessage(tab.id, {
        type: EVENT_REFRESH_SETTINGS,
        data,
    });
}

// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------

/**
 * Retrieves the status of the extension.
 * @returns {Promise<{ data: any }>} The status of the extension.
 */
async function getStatus() {
    const token = await storageGetToken();

    if (!token) {
        return { user: null };
    }

    const { data } = await getExtensionStatus();

    extensionStatus = data?.data || {};

    return {
        data: data?.data,
    };
}

/**
 * Logs out the user.
 * @returns {Promise<{ success: boolean }>} A promise that resolves to an object indicating the success of the logout operation.
 */
async function logout() {
    await clearStorage();

    return { success: true };
}

/**
 * Sends the player progress data to the server.
 *
 * @param {Object} data - The player progress data.
 * @returns {Promise<void>} - A promise that resolves when the player progress is sent.
 */
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

/**
 * Fetches the authenticated user data and stores the access token.
 * @param {string} accessToken - The access token for authentication.
 * @returns {Promise<{ user: object }>} - The user data object.
 */
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

/**
 * Performs the login process.
 * @returns {Promise<Object>} A promise that resolves to an object containing the login result.
 */
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

        const expiresIn = params.get('expires_in');
        const accessToken = params.get('access_token');

        log.debug('login', 'received success response');

        return loginFetchUser(accessToken);
    } catch (err) {
        log.warn('login', 'error', err);

        return {
            success: false,
            error: why(err),
        };
    }
}

/**
 * Updates the visibility of a setting and sends a message to the content script to refresh the settings.
 * @param {Object} data - The data containing the visibility of the setting.
 * @returns {Object} - An empty object.
 */
async function updateSettingUpdateVisible(data) {
    await storageSetSettingVisible(data.visible);

    await sendMessageToContentScript(EVENT_REFRESH_SETTINGS);

    return {};
}

// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------

/**
 * Retrieves the response based on the given type and data.
 * @param {string} type - The type of response to retrieve.
 * @param {any} data - The data associated with the response.
 * @returns {Promise<any>} - The response based on the given type and data.
 */
async function getResponse(type, data) {
    switch (type) {
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

/**
 * Handles the incoming message.
 * @param {Object} msg - The incoming message.
 * @returns {Promise} - A promise that resolves with the response.
 */
export async function handleMessage(msg) {
    if (typeof msg !== 'object') {
        log.warn('message is not an object', { msg });
        return Promise.resolve();
    }

    const { type, data } = msg;
    log.debug('message ->', type, data);

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
