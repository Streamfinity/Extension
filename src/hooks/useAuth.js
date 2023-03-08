import browser from 'webextension-polyfill';

export const loginUrl = `${import.meta.env.VITE_FRONTEND_URL}/dashboard/settings/extension`;

export async function openLoginPage() {
    await browser.tabs.create({
        url: loginUrl,
    });
}
