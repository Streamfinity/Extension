import '../enableDevHmr';
import React from 'react';
import ReactDOM from 'react-dom';
import { renderContent, listenPlayerEvents } from '../renderContent';
import App from './App';
import { createLogger } from '~/common/log';

const log = createLogger('Content-Script');

log.debug('content script main');

// eslint-disable-next-line
renderContent(import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS, (appRoot) => {
    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        appRoot,
    );
});

listenPlayerEvents();
