import browser from 'webextension-polyfill';
import { createLogger } from '~/common/log';

const log = createLogger('Spaceship 👽');

/**
 * Registers a listener for incoming messages from the browser runtime.
 * 
 * @param {function} listener - The callback function to be executed when a message is received.
 * @returns {void}
 */
export function registerListener(listener) {
    browser.runtime.onMessage.addListener((req, sender) => {
        const { type, data } = req;

        log.debug('RECV ⬅️', type, `(tab ${sender?.tab?.index})`, data);

        return listener(type, data);
    });
}

/**
 * Unregisters a listener for incoming messages from the browser runtime.
 * 
 * @param {function} listener - The callback function to be unregistered.
 * @returns {void}
 */
export function unregisterListener(listener) {
    browser.runtime.onMessage.removeListener(listener);
}

/**
 * Sends a message to a specific tab with the provided tabId, type, and data.
 *
 * @param {number} tabId - The ID of the tab to send the message to.
 * @param {string} type - The type of the message being sent.
 * @param {Object} data - The data to be sent along with the message.
 * @returns {Promise} A Promise that resolves when the message is sent successfully.
 */
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
