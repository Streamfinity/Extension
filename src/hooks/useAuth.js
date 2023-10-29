import { useState, useMemo } from 'react';
import { logout as bridgeLogut, getStatus, login as bridgeLogin } from '~/common/bridge';
import { useContentStore } from '~/entries/contentScript/primary/state';
import { createLogger } from '~/common/log';

const log = createLogger('useAuth');

export default function useAuth() {
    const {
        user, setUser,
        status, setStatus,
        loading, setLoading,
    } = useContentStore();

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

    async function logout() {
        setLoadingLogout(true);

        await bridgeLogut();
        await refreshUserData();

        setLoadingLogout(false);
    }

    async function login() {
        setLoadingLogin(true);

        await bridgeLogin();
        await refreshUserData();

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
        login,
        // Logout
        loadingLogout,
        logout,
    };
}
