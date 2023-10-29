import browser from 'webextension-polyfill';
import {
    api, searchSuggestionAccounts, submitSuggestion, getWatchedReactions, submitReaction, getReactionPolicy, getContentRatings,
} from '~/entries/background/common/api';
import {
    storageGetUser, storageGetToken, STORAGE_USER, STORAGE_TOKEN,
} from '~/entries/background/common/storage';
import {
    GET_STATUS,
    DEBUG_DUMP_STORAGE,
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

const log = createLogger('Background');

const store = {
    status: null,
};

// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------

export async function logout() {
    await browser.storage.sync.remove([STORAGE_TOKEN, STORAGE_USER]);

    return { success: true };
}

export async function getStatus() {
    const { status, data } = await api('extension/status', {
        token: await storageGetToken(),
    });

    store.status = data?.data;

    return {
        success: status === 200,
        status: data?.data,
        user: await storageGetUser(),
    };
}

export async function dumpStorage() {
    return browser.storage.sync.get();
}

export async function sendPlayerProgress(data) {
    if (!store.status) {
        log.debug('no status adata, dont send player progress');
        return;
    }

    if (store.status.live_streams.length === 0) {
        log.debug('on stream live');
        return;
    }

    const items = [{
        timestamp: Math.round(data.timestamp),
        created_at: data.date,
        original_url: data.url,
        stream_id: store.status.live_streams[0].id,
    }];

    await api('extension/playback', {
        token: await storageGetToken(),
        method: 'post',
        json: { items },
    });
}

async function loginFetchUser(accessToken) {
    try {
        const { data: response } = await api('users/@me', {
            token: accessToken,
        });

        log.debug('login validate', 'ok');

        const storeToken = accessToken;
        const storeUser = response.data;

        delete storeUser.avatar;
        delete storeUser.fetch_preferences;
        delete storeUser.subscriptions;

        storeUser.accounts = storeUser.accounts.map((acc) => ({
            id: acc.id,
            name: acc.name,
            display_name: acc.display_name,
            enable_monitoring: acc.enable_monitoring,
        }));

        log.debug('storing token...', storeToken);
        await browser.storage.sync.set({ [STORAGE_TOKEN]: storeToken });

        log.debug('storing user...', storeUser);
        await browser.storage.sync.set({ [STORAGE_USER]: storeUser });

        return { success: true, user: response.data };
    } catch (err) {
        log.error('error checking data', err);
    }

    return { success: false };
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

    console.log(
        await loginFetchUser(accessToken),
    );
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
    case DEBUG_DUMP_STORAGE:
        return dumpStorage();
    case PLAYER_PROGRESS:
        return sendPlayerProgress(data);
    case SUGGESTIONS_SEARCH_ACCOUNT:
        return searchSuggestionAccounts(data);
    case SUGGESTIONS_SUBMIT:
        return submitSuggestion(data);
    case WATCHED_REACTIONS_GET:
        return getWatchedReactions();
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

export async function handleMessage(msg, sender, sendResponse) {
    if (typeof msg !== 'object') {
        log.warn('message is not an object', { msg });
        return Promise.resolve();
    }

    const { type, data } = msg;
    log.debug('onMessage', type, data);

    const response = getResponse(type, data);

    if (response === null) {
        return Promise.resolve();
    }

    return response;
}
