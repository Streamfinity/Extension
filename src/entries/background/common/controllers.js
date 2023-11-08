import browser from 'webextension-polyfill';
import {
    searchSuggestionAccounts,
    submitSuggestion,
    getWatchedReactions,
    submitReaction,
    getReactionPolicy,
    getContentRatings,
    createPlaybackProgress,
    getExtensionStatus, getAuthenticatedUser,
} from '~/entries/background/common/api';
import {
    storageGetToken, clearStorage, storageGetAll, storageSetToken,
} from '~/entries/background/common/storage';
import {
    GET_STATUS,
    PLAYER_PROGRESS,
    LOGOUT,
    SUGGESTIONS_SEARCH_ACCOUNT,
    SUGGESTIONS_SUBMIT,
    WATCHED_REACTIONS_GET,
    REACTION_SUBMIT,
    REACTION_POLICY_GET,
    LOGIN, CONTENT_RATINGS_GET,
} from '~/messages';
import { createLogger } from '~/common/log';
import { why } from '~/common/pretty';

const log = createLogger('Background');

/**
 * @type {{user}}
 */
let extensionStatus = {};

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

    return {
        data: data?.data,
    };
}

async function logout() {
    await clearStorage();

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

// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------

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
