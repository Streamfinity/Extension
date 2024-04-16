import '~/enableDevHmr';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { translations, defaultLocale } from '@/i18n';
import { renderContent } from './renderContent';
import App from './App';
import { createLogger } from '~/common/log';

i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
        resources: Object.entries(translations).reduce((acc, [key, value]) => {
            acc[key] = { translation: value };
            return acc;
        }, {}),
        fallbackLng: defaultLocale,
        interpolation: {
            escapeValue: false,
        },
    });

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
