/**
 * Initializes i18n configuration, creates a logger, sets up a QueryClient, and renders the main App component.
 */
import '~/enableDevHmr';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { translations, defaultLocale } from '@/i18n';
import { createLogger } from '~/common/log';
import App from './App';

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

log.debug('popup main');

createRoot(document.getElementById('app'))
    .render(
        <React.StrictMode>
            <QueryClientProvider client={queryClient}>
                <App />
            </QueryClientProvider>
        </React.StrictMode>,
    );
