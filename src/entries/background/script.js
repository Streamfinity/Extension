/**
 * Initializes the background script by creating a logger, getting API and frontend URLs,
 * and registering a listener for content script messages.
 */
import { createLogger } from '~/common/log';
import { onContentScriptMessage } from '~/entries/background/common/controllers';
import { registerListener } from '~/entries/background/common/spaceship';
import { getApiUrl } from '~/config';

const log = createLogger('Background-Script');

log.debug('running in MV2');
log.debug('config', {
    API_URL: getApiUrl(),
    FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL,
});

registerListener(onContentScriptMessage);
