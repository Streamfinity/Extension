import browser from 'webextension-polyfill';

export const STORAGE_AUTH_INFO = 'authInfo';

export const STORAGE_TOKEN = 'token';
export const STORAGE_TOKEN_EXPIRES = 'tokenExpiresIn';
export const STORAGE_USER = 'user';

const authDefaults = {
    loggedIn: false,
    token: null,
    tokenExpires: null,
    userId: null,
};

export async function storageSetToken(token) {
    await browser.storage.sync.set({ [STORAGE_TOKEN]: token });
}

export async function storageGetUser() {
    return (await browser.storage.sync.get(STORAGE_USER)).user;
}

export async function storageGetToken() {
    return (await browser.storage.sync.get(STORAGE_TOKEN)).token;
}

export function storageGetAll() {
    return browser.storage.sync.get();
}

export async function clearStorage() {
    return browser.storage.sync.remove([
        STORAGE_TOKEN,
        STORAGE_USER,
    ]);
}
