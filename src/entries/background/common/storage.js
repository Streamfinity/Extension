import browser from 'webextension-polyfill';

export const STORAGE_TOKEN = 'token';
export const STORAGE_USER = 'user';

export async function getUser() {
    return (await browser.storage.sync.get('user')).user;
}

export async function getToken() {
    return (await browser.storage.sync.get('token')).token;
}
