import '../enableDevHmr';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { renderContent, listenPlayerEvents } from '../renderContent';
import App from './App';
import { createLogger } from '~/common/log';

const log = createLogger('Content-Script');

log.debug('content script main');

// eslint-disable-next-line
renderContent(import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS, (appRoot) => {
    createRoot(appRoot)
        .render(
            <React.StrictMode>
                <App />
            </React.StrictMode>,
        );
});

listenPlayerEvents();
