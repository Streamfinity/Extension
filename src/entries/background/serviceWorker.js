import './main';
import browser from 'webextension-polyfill';
import { createLogger } from '~/common/log';
import { GET_STATUS } from '~/messages';

const log = createLogger('SW');

log.debug('started');

browser.runtime.onInstalled.addListener(async () => {
    log.debug('onInstalled');
    // log.debug(await browser.storage.sync.set({ foo: 'bar' }));
});

async function getStatus() {
    return {
        auth: false,
    };
}

async function getResponse(type, data) {
    switch (type) {
    case GET_STATUS:
        return getStatus(data);
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
