/**
 * The main entry point for the content script.
 * Renders the React app and provides the QueryClient for data fetching.
 *
 * @module ContentScriptMain
 * @returns {void}
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { renderContent } from '../renderContent';
import App from './app';
import { createLogger } from '~/common/log';

const log = createLogger('Content-Script');
const queryClient = new QueryClient();

log.debug('content script main');

// eslint-disable-next-line
renderContent(import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS, (appRoot) => {
    createRoot(appRoot)
        .render(
            <React.StrictMode>
                <QueryClientProvider client={queryClient}>
                    <App />
                </QueryClientProvider>
            </React.StrictMode>,
        );
});
