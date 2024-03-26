import { useEffect } from 'react';
import { EVENT_REFRESH_SETTINGS, EVENT_REFRESH_AUTH } from '~/messages';
import { storageGetSettingVisible } from '~/entries/background/common/storage';
import { useAppStore } from '~/entries/contentScript/state';
import { createLogger } from '~/common/log';
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
    const setIsVisible = useAppStore((state) => state.setIsVisible);
    const { refreshStatusData } = useAuth();

    async function onBackgroundMessage({ type, data }) {
        switch (type) {
        case EVENT_REFRESH_AUTH:
            await refreshStatusData();
            break;

        case EVENT_REFRESH_SETTINGS:
            await refreshSettings({ setIsVisible });
            break;

        default:
            log.error('unhandled message', type, data);
        }
    }

    useEffect(() => {
        registerListener(onBackgroundMessage);

        refreshSettings({ setIsVisible });

        return () => {
            unregisterListener(onBackgroundMessage);
        };
    }, []);

    return {};
}
