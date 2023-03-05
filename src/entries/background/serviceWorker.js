import browser from 'webextension-polyfill';
import { createLogger } from '~/common/log';
import { handleMessage } from '~/entries/background/common/controllers';

const log = createLogger('SW');

log.debug('ServiceWorker', 'running in MV3', { api: import.meta.env.VITE_API_URL });

browser.runtime.onMessage.addListener(handleMessage);
