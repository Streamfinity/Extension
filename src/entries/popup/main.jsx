import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './app';
import { createLogger } from '~/common/log';

const log = createLogger('Content-Script');
const queryClient = new QueryClient();

log.debug('popup main');

createRoot(document.getElementById('app'))
    .render(
        <React.StrictMode>
            <QueryClientProvider client={queryClient}>
                <App />
            </QueryClientProvider>
        </React.StrictMode>,
    );
