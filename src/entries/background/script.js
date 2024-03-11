import { createLogger } from '~/common/log';
import { onContentScriptMessage } from '~/entries/background/common/controllers';
import { registerListener } from '~/entries/background/common/spaceship';

const log = createLogger('Background-Script');

log.debug('running in MV2');
log.debug('config', {
    API_URL: import.meta.env.VITE_API_URL,
    FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL,
});

registerListener(onContentScriptMessage);
