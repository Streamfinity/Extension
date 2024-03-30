import '~/enableDevHmr';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '@/locales/en.json';
import de from '@/locales/de.json';
import { renderContent } from './renderContent';
import App from './App';
import { createLogger } from '~/common/log';

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources: {
            en: {
                translation: en,
            },
            de: {
                translation: de,
            },
        },
        lng: 'de',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

const log = createLogger('Content-Script');
const queryClient = new QueryClient();

log.debug('content script main', { hot: import.meta.hot });

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
