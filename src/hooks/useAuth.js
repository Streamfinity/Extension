import { useState, useMemo } from 'react';
import { logout, login, useStatus } from '~/common/bridge';
import { useAppStore, MESSAGE_ERROR } from '~/entries/contentScript/state';
import { createLogger } from '~/common/log';

const log = createLogger('useAuth');

export const STATE_DEFAULT = 'default';
export const STATE_LIVE = 'live';
export const STATE_OWN_VIDEO = 'own-video';

export default function useAuth() {
    const { setAppMessage } = useAppStore();

    const { data: statusData, refetch: refreshUserData, isLoading: loadingAuth } = useStatus();

    const [user, accounts, liveStreams] = useMemo(
        () => [statusData?.user, statusData?.accounts, statusData?.live_streams],
        [statusData],
    );

    const [loadingLogin, setLoadingLogin] = useState(false);
    const [loadingLogout, setLoadingLogout] = useState(false);

    const liveStream = useMemo(() => liveStreams?.find(() => true), [liveStreams]);
    const isLive = useMemo(() => !!liveStream, [liveStream]);

    const state = useMemo(() => {
        // ++++++++++++ DEBUG
        return STATE_DEFAULT;
        // ++++++++++++ DEBUG
        if (isLive) {
            return STATE_LIVE;
        }

        return STATE_DEFAULT;
    }, [isLive]);

    async function performLogout() {
        setLoadingLogout(true);

        await logout();
        await refreshUserData();

        setLoadingLogout(false);
    }

    async function performLogin() {
        setLoadingLogin(true);

        try {
            const response = await login();

            log.debug('login response', response);

            if (response?.error) {
                setAppMessage({ type: MESSAGE_ERROR, message: response.error });
                return;
            }

            await refreshUserData();
        } catch (err) {
            setAppMessage({ type: MESSAGE_ERROR, message: err });
        }

        setLoadingLogin(false);
    }

    return {
        // User state
        user,
        accounts,
        liveStreams,
        liveStream,
        isLive,
        loadingAuth,
        // Status
        state,
        // Query
        refreshUserData,
        // Login
        loadingLogin,
        login: performLogin,
        // Logout
        loadingLogout,
        logout: performLogout,
    };
}
