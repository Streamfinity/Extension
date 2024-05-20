import { createLogger } from '~/common/log';
import { onContentScriptMessage } from '~/entries/background/common/controllers';
import { registerListener } from '~/entries/background/common/spaceship';
import { getApiUrl } from '~/config';

const log = createLogger('ServiceWorker');

log.debug('running in MV3');
log.debug('config', {
    API_URL: getApiUrl(),
    FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL,
});

registerListener(onContentScriptMessage);
