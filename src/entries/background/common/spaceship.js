import browser from 'webextension-polyfill';
import { handleMessage } from '~/entries/background/common/controllers';

export function registerListener(listener) {
    browser.runtime.onMessage.addListener(listener);
}

export async function sendMessageToContentScript(type, data = {}) {
    const tabs = await browser.tabs.query({ active: true });

    const promises = tabs.map(async (tab) => {
        try {
            log.debug('SEND <-', `[${tab.id}]`, type, 'sending ...');

            await browser.tabs.sendMessage(tab.id, {
                type,
                data,
            });

            log.debug('SEND <-', `[${tab.id}]`, type, ' ✅ SENT');
        } catch (err) {
            log.error('SEND <-', `[${tab.id}]`, type, err);
        }
    });

    log.debug('SEND <-', 'sending message', type, 'to', tabs.length, 'tabs:', tabs);

    try {
        await Promise.all(promises);

        log.debug('SEND <-', '✅ SENT ALL MESSAGES');
    } catch (err) {
        log.error('SEND <-', 'error executing promises', err);
    }
}
