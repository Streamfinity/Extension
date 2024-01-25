import browser from 'webextension-polyfill';
import { useEffect } from 'react';
import { EVENT_REFRESH_SETTINGS } from '~/messages';
import { storageGetSettingVisible } from '~/entries/background/common/storage';
import { useAppStore } from '~/entries/contentScript/primary/state';
import { createLogger } from '~/common/log';

const log = createLogger('Background-Events');

/**
 * Refreshes the settings and updates the visibility state.
 * @param {Object} options - The options object.
 * @param {Function} options.setIsVisible - The function to set the visibility state.
 * @returns {Promise<void>} - A promise that resolves when the settings are refreshed.
 */
async function refreshSettings({ setIsVisible }) {
    log.debug('refreshing settings...');

    setIsVisible(
        await storageGetSettingVisible(),
    );
}

/**
 * Custom hook for handling background events.
 *
 * @returns {Object} An empty object.
 */
export function useBackgroundEvents() {
    const { setIsVisible } = useAppStore();

    async function onBackgroundMessageCallback({ type, data }, sender, sendResponse) {
        log.debug('Message', type, data);

        switch (type) {
        case EVENT_REFRESH_SETTINGS:
            await refreshSettings({ setIsVisible });
            break;

        default:
        }
    }

    useEffect(() => {
        browser.runtime.onMessage.addListener(onBackgroundMessageCallback);

        refreshSettings({ setIsVisible });

        return () => {
            browser.runtime.onMessage.removeListener(onBackgroundMessageCallback);
        };
    }, []);

    return {};
}
