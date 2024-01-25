import { useState, useMemo } from 'react';
import { logout, login, useStatus } from '~/common/bridge';
import { useAppStore } from '~/entries/contentScript/primary/state';
import { createLogger } from '~/common/log';

const log = createLogger('useAuth');

/**
 * Custom hook for handling authentication.
 *
 * @returns {{
 *   user: any,
 *   accounts: any,
 *   liveStreams: any,
 *   liveStream: any,
 *   isLive: boolean,
 *   loadingAuth: boolean,
 *   refreshUserData: () => Promise<void>,
 *   loadingLogin: boolean,
 *   login: () => Promise<void>,
 *   loadingLogout: boolean,
 *   logout: () => Promise<void>
 * }}
 */
export default function useAuth() {
    const { setAppError } = useAppStore();

    const { data: statusData, refetch: refreshUserData, isLoading: loadingAuth } = useStatus();

    const [user, accounts, liveStreams] = useMemo(
        () => [statusData?.user, statusData?.accounts, statusData?.live_streams],
        [statusData],
    );

    const [loadingLogin, setLoadingLogin] = useState(false);
    const [loadingLogout, setLoadingLogout] = useState(false);

    const liveStream = useMemo(() => liveStreams?.find(() => true), [liveStreams]);
    const isLive = useMemo(() => !!liveStream, [liveStream]);

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
                setAppError(response.error);
                return;
            }

            await refreshUserData();
        } catch (err) {
            setAppError(err);
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
