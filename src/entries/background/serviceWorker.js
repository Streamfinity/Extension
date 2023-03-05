import './main';
import browser from 'webextension-polyfill';
import { createLogger } from '~/common/log';
import {
    GET_STATUS, HANDSHAKE_VALIDATE, DEBUG_DUMP_STORAGE, PLAYER_PROGRESS,
} from '~/messages';

const STORAGE_TOKEN = 'token';
const STORAGE_USER = 'user';

const log = createLogger('SW');

log.debug('started', { api: import.meta.env.VITE_API_URL });

async function api(url, options) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/${url}`, {
        headers: {
            Accept: 'application/json',
            ...options?.headers || {},
            ...options?.token ? {
                Authorization: `Bearer ${options.token}`,
            } : {},
            ...options?.json ? {
                'Content-Type': 'application/json',
            } : {},
        },
        ...options || {},
        ...options?.json ? {
            body: JSON.stringify(options.json),
        } : {},
    });

    return {
        status: response.status,
        data: await response.json(),
    };
}

browser.runtime.onInstalled.addListener(async () => {
    log.debug('onInstalled');
    // log.debug(await browser.storage.sync.set({ foo: 'bar' }));
});

async function getUser() {
    return (await browser.storage.sync.get('user')).user;
}

async function getToken() {
    return (await browser.storage.sync.get('token')).token;
}

async function getStatus() {
    const { status, data } = await api('extension/status', {
        token: await getToken(),
    });

    return {
        success: status === 200,
        status: data?.data,
        user: await getUser(),
    };
}

async function validateHandshakeData(data) {
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

async function dumpStorage() {
    return browser.storage.sync.get();
}

async function sendPlayerProgress(data) {
    const items = [{
        timestamp: Math.round(data.timestamp),
        created_at: data.date,
        original_url: data.url,
        stream_id: '989d746c-967b-41cc-9d2f-dae56bb72499', // TODO
    }];

    await api('extension/playback', {
        token: await getToken(),
        method: 'post',
        json: { items },
    });
}

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
    default:
        return null;
    }
}

browser.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
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
});
