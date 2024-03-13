import browser from 'webextension-polyfill';
import { createLogger } from '~/common/log';

const log = createLogger('Spaceship');

export function registerListener(listener) {
    browser.runtime.onMessage.addListener((req) => {
        if (typeof req !== 'object') {
            log.warn('message is not an object', req);
            return Promise.resolve();
        }

        const { type, data } = req;

        log.debug('RECV ⬅️', type, data);

        listener(type, data);
    });
}

export function unregisterListener(listener) {
    browser.runtime.onMessage.removeListener(listener);
}

export async function sendMessageToTab(tabId, type, data) {
    log.debug('SEND ➡️ (BG -> CS)', type, data);

    return browser.tabs.sendMessage(tabId, {
        type,
        data,
    });
}

export async function sendMessageToBackground(type, data) {
    log.debug('SEND ➡️ (CS -> BG)', type, data);

    return browser.runtime.sendMessage({
        type,
        data,
    });
}

export async function sendMessageToContentScript(type, data = {}) {
    const tabs = await browser.tabs.query({ active: true });

    const promises = tabs.map(async (tab) => {
        try {
            log.debug('SEND ➡️', `[${tab.id}]`, type, 'sending ...');

            await sendMessageToTab(tab.id, {
                type,
                data,
            });

            log.debug('SEND ➡️', `[${tab.id}]`, type, ' ✅ SENT');
        } catch (err) {
            log.error('SEND ➡️', `[${tab.id}]`, type, err);
        }
    });

    log.debug('SEND ➡️', 'sending message', type, 'to', tabs.length, 'tabs:', tabs);

    try {
        await Promise.all(promises);

        log.debug('SEND ➡️', '✅ SENT ALL MESSAGES');
    } catch (err) {
        log.error('SEND ➡️', 'error executing promises', err);
    }
}
