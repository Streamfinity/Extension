import browser from 'webextension-polyfill';
import { createLogger } from '~/common/log';

const log = createLogger('Spaceship 👽');

export function registerListener(listener) {
    browser.runtime.onMessage.addListener((req, sender) => {
        const { type, data } = req;

        log.debug('RECV ⬅️', type, `(tab ${sender?.tab?.index})`, data);

        return listener(type, data);
    });
}

export function unregisterListener(listener) {
    browser.runtime.onMessage.removeListener(listener);
}

export async function sendMessageToTab(tabId, type, data) {
    log.debug('SEND ➡️', type, data);

    return browser.tabs.sendMessage(tabId, {
        type,
        data,
    });
}

export async function sendMessageToBackground(type, data) {
    let response;

    try {
        response = await browser.runtime.sendMessage({
            type,
            data,
        });

        if (!response) {
            throw new Error(`No response from background (typeof: ${typeof response})`);
        }

        if ('error' in response) {
            throw new Error(response.error);
        }
    } catch (err) {
        log.error('SEND ➡️', type, { req: data, err });

        throw err;
    }

    log.debug('SEND ➡️', type, { req: data, res: response });

    return response;
}

export async function sendMessageToContentScript(type, data = {}) {
    const tabs = await browser.tabs.query({ active: true });

    const promises = tabs.map(async (tab) => {
        try {
            await sendMessageToTab(tab.id, {
                type,
                data,
            });

            log.debug('SEND ➡️', `[tab-${tab.id}]`, type, ' ✅ SENT');
        } catch (err) {
            log.error('SEND ➡️', `[tab-${tab.id}]`, type, err);
        }
    });

    log.debug('SEND ➡️', 'sending message', type, 'to', tabs.length, 'tabs:', tabs);

    try {
        await Promise.allSettled(promises);
    } catch (err) {
        log.error('SEND ➡️', 'error executing promises', err);
    }
}
