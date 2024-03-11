import browser from 'webextension-polyfill';
import { useEffect } from 'react';
import { EVENT_REFRESH_SETTINGS, EVENT_REFRESH_AUTH } from '~/messages';
import { storageGetSettingVisible } from '~/entries/background/common/storage';
import { useAppStore } from '~/entries/contentScript/state';
import { createLogger } from '~/common/log';
import { useStatus } from '~/common/bridge';
import useAuth from '~/hooks/useAuth';
import { registerListener, unregisterListener } from '~/entries/background/common/spaceship';

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
    const { refreshStatusData } = useAuth();

    async function onBackgroundMessage(type, data) {
        log.debug('RECV ->', type, data);

        switch (type) {
        case EVENT_REFRESH_AUTH:
            await refreshStatusData();
            await refetchStatus();
            break;

        case EVENT_REFRESH_SETTINGS:
            await refreshSettings({ setIsVisible });
            break;

        default:
        }
    }

    useEffect(() => {
        registerListener(onBackgroundMessage);
        log.debug('registered listener');

        refreshSettings({ setIsVisible });

        return () => {
            unregisterListener(onBackgroundMessage);
            log.debug('removed listener');
        };
    }, []);

    return {};
}
