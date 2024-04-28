import browser from 'webextension-polyfill';

export const STORAGE_AUTH_INFO = 'authInfo';

export const STORAGE_TOKEN = 'token';
export const STORAGE_TOKEN_EXPIRES = 'tokenExpiresIn';
export const STORAGE_USER = 'user';
export const STORAGE_SETTING_SCRIPT_VISIBLE = 'invis';

// Setter

export async function storageSetUser(user) {
    const minimalUser = {
        display_name: user.display_name,
        id: user.id,
        extension_log: user.extension_log,
    };

    await browser.storage.sync.set({ [STORAGE_USER]: minimalUser });
}

export async function storageSetToken(token) {
    await browser.storage.sync.set({ [STORAGE_TOKEN]: token });
}

export async function storageSetSettingVisible(visible) {
    await browser.storage.sync.set({ [STORAGE_SETTING_SCRIPT_VISIBLE]: visible });
}

// Getter

export async function storageGetSettingVisible() {
    const value = (await browser.storage.sync.get(STORAGE_SETTING_SCRIPT_VISIBLE))[STORAGE_SETTING_SCRIPT_VISIBLE];

    if (value === undefined) {
        // TODO remove, only for review so extension is visible
        if ((navigator.userAgent.indexOf('Edg') !== -1)) {
            return true;
        }

        return false;
    }

    return value !== false;
}

export async function storageGetUser() {
    return (await browser.storage.sync.get(STORAGE_USER))[STORAGE_USER];
}

export async function storageGetToken() {
    return (await browser.storage.sync.get(STORAGE_TOKEN))[STORAGE_TOKEN];
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
