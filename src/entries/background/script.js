import browser from 'webextension-polyfill';
import { createLogger } from '~/common/log';
import { handleMessage } from '~/entries/background/common/controllers';

/**
 * Logger for the background script.
 * @type {Logger}
 */
const log = createLogger('Background-Script');

log.debug('running in MV2');
log.debug('config', {
    API_URL: import.meta.env.VITE_API_URL,
    FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL,
});

browser.runtime.onMessage.addListener(handleMessage);
