import './main';
import browser from 'webextension-polyfill';
import { createLogger } from '~/common/log';
import { GET_STATUS, HANDSHAKE_VALIDATE, DEBUG_DUMP_STORAGE } from '~/messages';

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
        },
        ...options || {},
    });

    return {
        ...response,
        data: await response.json(),
    };
}

browser.runtime.onInstalled.addListener(async () => {
    log.debug('onInstalled');
    // log.debug(await browser.storage.sync.set({ foo: 'bar' }));
});

async function getStatus() {
    return {
        auth: false,
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
    const items = [];
    return browser.storage.sync.get();
}

async function getResponse(type, data) {
    switch (type) {
    case GET_STATUS:
        return getStatus(data);
    case HANDSHAKE_VALIDATE:
        return validateHandshakeData(data);
    case DEBUG_DUMP_STORAGE:
        return dumpStorage();
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
    log.debug('onMessage', { type, data });

    const response = getResponse(type, data);

    if (response === null) {
        return Promise.resolve();
    }

    return response;
});
