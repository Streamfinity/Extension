import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translations, defaultLocale } from '@/i18n';
import { useAppStore } from '~/entries/contentScript/state';

vi.mock('webextension-polyfill', () => ({
    default: {
        runtime: {
            sendMessage: vi.fn(),
            onMessage: {
                addListener: vi.fn(),
                removeListener: vi.fn(),
            },
        },
        storage: {
            sync: {
                get: vi.fn(),
                set: vi.fn(),
                remove: vi.fn(),
            },
        },
    },
}));

i18n
    .use(initReactI18next)
    .init({
        resources: Object.entries(translations).reduce((acc, [key, value]) => {
            acc[key] = { translation: value };
            return acc;
        }, {}),
        lng: defaultLocale,
        fallbackLng: defaultLocale,
        interpolation: {
            escapeValue: false,
        },
    });

beforeEach(() => {
    useAppStore.setState(useAppStore.getInitialState(), true);
});

afterEach(() => {
    cleanup();
    vi.clearAllMocks();
});
