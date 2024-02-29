import browser from 'webextension-polyfill';
import { useEffect } from 'react';
import { EVENT_REFRESH_SETTINGS, EVENT_REFRESH_AUTH } from '~/messages';
import { storageGetSettingVisible } from '~/entries/background/common/storage';
import { useAppStore } from '~/entries/contentScript/state';
import { createLogger } from '~/common/log';
import { useStatus } from '~/common/bridge';
import useAuth from '~/hooks/useAuth';

const log = createLogger('Background-Events');

async function refreshSettings({ setIsVisible }) {
    log.debug('refreshing settings...');

    setIsVisible(
        await storageGetSettingVisible(),
    );
}

export function useBackgroundEvents() {
    const { setIsVisible } = useAppStore();
    const { refetch: refetchStatus } = useStatus();
    const { refreshUserData } = useAuth();

    async function onBackgroundMessageCallback({ type, data }) {
        log.debug('RECV ->', type, data);

        switch (type) {
        case EVENT_REFRESH_AUTH:
            await refreshUserData();
            await refetchStatus();
            break;

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
