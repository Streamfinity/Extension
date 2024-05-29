import { useEffect } from 'react';
import { EVENT_REFRESH_SETTINGS, EVENT_REFRESH_AUTH, EVENT_NOTICE } from '~/messages';
import { storageGetSettingVisible } from '~/entries/background/common/storage';
import { useAppStore } from '~/entries/contentScript/state';
import { createLogger } from '~/common/log';
import useAuth from '~/hooks/useAuth';
import { registerListener, unregisterListener } from '~/entries/background/common/spaceship';
import { toastSuccess, toastError, toastWarn } from '~/common/utility';

const log = createLogger('Background-Events');

/**
 * Asynchronously refreshes settings by updating the visibility state using the provided setIsVisible function.
 * This function logs a debug message before updating the visibility state.
 * 
 * @param {Object} options - An object containing the setIsVisible function.
 * @param {Function} options.setIsVisible - The function used to set the visibility state.
 * 
 * @returns {Promise<void>} - A promise that resolves once the visibility state is updated.
 */
async function refreshSettings({ setIsVisible }) {
    log.debug('refreshing settings...');

    setIsVisible(
        await storageGetSettingVisible(),
    );
}

/**
 * Sends a notice message based on the provided type.
 *
 * @param {string} type - The type of notice message ('success', 'error', 'warning').
 * @param {string} message - The message content to be displayed in the notice.
 * @returns {void}
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

/**
 * Custom hook that handles background events and performs necessary actions based on the event type.
 * Registers a listener for background messages and triggers corresponding functions for different event types.
 * Also initializes the background events by calling the refreshSettings function and sets the initial state.
 * 
 * @returns {Object} An empty object as this hook does not return any values.
 */
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
