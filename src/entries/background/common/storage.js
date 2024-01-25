import browser from 'webextension-polyfill';

export const STORAGE_AUTH_INFO = 'authInfo';

export const STORAGE_TOKEN = 'token';
export const STORAGE_TOKEN_EXPIRES = 'tokenExpiresIn';
export const STORAGE_USER = 'user';
export const STORAGE_SETTING_SCRIPT_VISIBLE = 'invis';

// Setter

/**
 * Sets the token in the browser storage.
 * @param {string} token - The token to be stored.
 * @returns {Promise<void>} - A promise that resolves when the token is successfully stored.
 */
export async function storageSetToken(token) {
    await browser.storage.sync.set({ [STORAGE_TOKEN]: token });
}

/**
 * Sets the visibility of a setting in the storage.
 * @param {boolean} visible - The visibility of the setting.
 * @returns {Promise<void>} - A promise that resolves when the setting is successfully stored.
 */
export async function storageSetSettingVisible(visible) {
    await browser.storage.sync.set({ [STORAGE_SETTING_SCRIPT_VISIBLE]: visible });
}

// Getter

/**
 * Retrieves the value of the "STORAGE_SETTING_SCRIPT_VISIBLE" setting from the browser's sync storage.
 * @returns {Promise<boolean>} A promise that resolves to the value of the "STORAGE_SETTING_SCRIPT_VISIBLE" setting.
 */
export async function storageGetSettingVisible() {
    return (await browser.storage.sync.get(STORAGE_SETTING_SCRIPT_VISIBLE))[STORAGE_SETTING_SCRIPT_VISIBLE] !== false;
}

/**
 * Retrieves the user from the browser's sync storage.
 * @returns {Promise<any>} A promise that resolves to the user object.
 */
export async function storageGetUser() {
    return (await browser.storage.sync.get(STORAGE_USER))[STORAGE_USER];
}

/**
 * Retrieves the token from the browser's sync storage.
 * @returns {Promise<string>} The token value.
 */
export async function storageGetToken() {
    return (await browser.storage.sync.get(STORAGE_TOKEN))[STORAGE_TOKEN];
}

/**
 * Retrieves all items from the browser's sync storage.
 * @returns {Promise<Object>} A promise that resolves with an object containing all items in the sync storage.
 */
export function storageGetAll() {
    return browser.storage.sync.get();
}

/**
 * Clears the storage by removing specific keys from the sync storage.
 * @returns {Promise<void>} A promise that resolves when the storage is cleared.
 */
export async function clearStorage() {
    return browser.storage.sync.remove([
        STORAGE_TOKEN,
        STORAGE_USER,
    ]);
}
