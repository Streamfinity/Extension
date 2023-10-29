import browser from 'webextension-polyfill';
import { useState, useMemo } from 'react';
import { logout, getStatus } from '~/common/bridge';
import { buildFrontendUrl } from '~/common/utility';
import { useContentStore } from '~/entries/contentScript/primary/state';
import { createLogger } from '~/common/log';

const log = createLogger('useAuth');

export async function openLoginPage() {
    await browser.tabs.create({
        url: buildFrontendUrl('/dashboard/settings/extension?auto=1'),
    });
}

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

    async function initLogout() {
        setLoadingLogout(true);

        await logout();

        setLoadingLogout(false);
    }

    async function login() {
        setLoadingLogin(true);
        await openLoginPage();
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
        logout: initLogout,
    };
}
