import { createLogger } from '~/common/log';
import { onContentScriptMessage } from '~/entries/background/common/controllers';
import { registerListener } from '~/entries/background/common/spaceship';

const log = createLogger('ServiceWorker');

log.debug('running in MV3');
log.debug('config', {
    API_URL: import.meta.env.VITE_API_URL,
    FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL,
});

registerListener(onContentScriptMessage);
