import { useEffect } from 'react';
import { EVENT_REFRESH_SETTINGS, EVENT_REFRESH_AUTH, EVENT_NOTICE } from '~/messages';
import { storageGetSettingVisible } from '~/entries/background/common/storage';
import { useAppStore } from '~/entries/contentScript/state';
import { createLogger } from '~/common/log';
import useAuth from '~/hooks/useAuth';
import { registerListener, unregisterListener } from '~/entries/background/common/spaceship';
import { toastSuccess, toastError, toastWarn } from '~/common/utility';

const log = createLogger('Background-Events');

async function refreshSettings({ setIsVisible }) {
    log.debug('refreshing settings...');

    setIsVisible(
        await storageGetSettingVisible(),
    );
}

/**
 * @param {('success','warning','error')} type
 * @param {string} message
 */
function sendNotice(type, message) {
    // eslint-disable-next-line default-case
    switch (type) {
    case 'success':
        toastSuccess(message);
        break;
    case 'error':
        toastError(message);
        break;
    case 'warning':
        toastWarn(message);
        break;
    }
}

export function useBackgroundEvents() {
    const setIsVisible = useAppStore((state) => state.setIsVisible);
    const { refreshStatusData } = useAuth();

    async function onBackgroundMessage(req) {
        const { type, data } = req;

        switch (type) {
        case EVENT_REFRESH_AUTH:
            await refreshStatusData();
            break;

        case EVENT_REFRESH_SETTINGS:
            await refreshSettings({ setIsVisible });
            break;

        case EVENT_NOTICE:
            sendNotice(data.type, data.message);
            break;

        default:
            log.error('unhandled message', req);
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
