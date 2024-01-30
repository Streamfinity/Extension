import browser from 'webextension-polyfill';
import { useEffect } from 'react';
import { EVENT_REFRESH_SETTINGS } from '~/messages';
import { storageGetSettingVisible } from '~/entries/background/common/storage';
import { useAppStore } from '~/entries/contentScript/state';
import { createLogger } from '~/common/log';

const log = createLogger('Background-Events');

async function refreshSettings({ setIsVisible }) {
    log.debug('refreshing settings...');

    setIsVisible(
        await storageGetSettingVisible(),
    );
}

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
