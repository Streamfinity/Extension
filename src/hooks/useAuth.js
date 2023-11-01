import { useState, useMemo } from 'react';
import { logout, getStatus, login } from '~/common/bridge';
import { useContentStore, useAppStore } from '~/entries/contentScript/primary/state';
import { createLogger } from '~/common/log';

const log = createLogger('useAuth');

export default function useAuth() {
    const {
        user, setUser,
        status, setStatus,
        loading, setLoading,
    } = useContentStore();

    const { setAppError } = useAppStore();

    const [loadingLogin, setLoadingLogin] = useState(false);
    const [loadingLogout, setLoadingLogout] = useState(false);

    const hasData = useMemo(() => !loading && user, [loading, user]);
    const isLive = useMemo(() => status?.live_streams?.length > 0, [status]);

    async function refreshUserData() {
        const { status: statusResponse, user: userResponse } = await getStatus();

        log.debug('refreshing', { status, user });

        setStatus(statusResponse);
        setUser(userResponse);
        setLoading(false);
    }

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
        status,
        hasData,
        isLive,
        refreshUserData,
        // Login
        loadingLogin,
        login: performLogin,
        // Logout
        logout: loadingLogout,
        performLogout,
    };
}
