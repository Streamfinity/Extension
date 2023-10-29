import browser from 'webextension-polyfill';
import { useState } from 'react';
import { logout } from '~/common/bridge';
import { buildFrontendUrl } from '~/common/utility';

export async function openLoginPage() {
    await browser.tabs.create({
        url: buildFrontendUrl('/dashboard/settings/extension?auto=1'),
    });
}

export default function useAuth() {
    const [loadingLogin, setLoadingLogin] = useState(false);
    const [loadingLogout, setLoadingLogout] = useState(false);

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
        // Login
        loadingLogin,
        login,
        // Logout
        loadingLogout,
        logout: initLogout,
    };
}
