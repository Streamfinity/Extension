import browser from 'webextension-polyfill';
import { api, searchSuggestionAccounts, submitSuggestion } from '~/entries/background/common/api';
import {
    storageGetUser, storageGetToken, STORAGE_USER, STORAGE_TOKEN,
} from '~/entries/background/common/storage';
import {
    GET_STATUS, HANDSHAKE_VALIDATE, DEBUG_DUMP_STORAGE, PLAYER_PROGRESS, LOGOUT, SUGGESTIONS_SEARCH_ACCOUNT, SUGGESTIONS_SUBMIT,
} from '~/messages';
import { createLogger } from '~/common/log';

const log = createLogger('Background');

const store = {
    status: null,
};

async function getResponse(type, data) {
    switch (type) {
    case GET_STATUS:
        return getStatus(data);
    case HANDSHAKE_VALIDATE:
        return validateHandshakeData(data);
    case DEBUG_DUMP_STORAGE:
        return dumpStorage();
    case PLAYER_PROGRESS:
        return sendPlayerProgress(data);
    case LOGOUT:
        return logout(data);
    case SUGGESTIONS_SEARCH_ACCOUNT:
        return searchSuggestionAccounts(data);
    case SUGGESTIONS_SUBMIT:
        return submitSuggestion(data);
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

export async function validateHandshakeData(data) {
    try {
        const { data: response } = await api('users/@me', {
            token: data.token,
        });

        if (response.data.id === data.user.id) {
            log.debug('handshake', 'ok');
            log.debug('handshake', 'response', response.data);
            log.debug('handshake', 'provided', data);

            const storeToken = data.token;
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
        }
    } catch (err) {
        log.error('error checking handshake data', err);
    }

    return { success: false };
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
