/**
 * This file serves as the main entry point for the content script in the extension.
 * It imports necessary dependencies, sets up the query client, and renders the main App component.
 * The content script is responsible for injecting and rendering content into the web page.
 */

import '../enableDevHmr';
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
