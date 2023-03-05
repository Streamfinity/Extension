import browser from 'webextension-polyfill';
import { createLogger } from '~/common/log';
import { handleMessage } from '~/entries/background/common/controllers';

const log = createLogger('Background-Script');

log.debug('Background', 'running in MV2');

browser.runtime.onMessage.addListener(handleMessage);
