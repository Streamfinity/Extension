import browser from 'webextension-polyfill';

export function buildUrl(path) {
    return `${import.meta.env.VITE_FRONTEND_URL}${path}`;
}

export const loginUrl = buildUrl('/dashboard/settings/extension');

export async function openLoginPage() {
    await browser.tabs.create({
        url: loginUrl,
    });
}
