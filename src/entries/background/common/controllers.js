import browser from 'webextension-polyfill';
import api from '~/entries/background/common/api';
import {
    getUser, getToken, STORAGE_USER, STORAGE_TOKEN,
} from '~/entries/background/common/storage';
import {
    GET_STATUS, HANDSHAKE_VALIDATE, DEBUG_DUMP_STORAGE, PLAYER_PROGRESS, LOGOUT,
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
        token: await getToken(),
    });

    store.status = data?.data;

    return {
        success: status === 200,
        status: data?.data,
        user: await getUser(),
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

            await browser.storage.sync.set({ [STORAGE_TOKEN]: data.token });
            await browser.storage.sync.set({ [STORAGE_USER]: response.data });

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
        token: await getToken(),
        method: 'post',
        json: { items },
    });
}
