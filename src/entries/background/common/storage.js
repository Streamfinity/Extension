import browser from 'webextension-polyfill';

export const STORAGE_AUTH_INFO = 'authInfo';

export const STORAGE_TOKEN = 'token';
export const STORAGE_TOKEN_EXPIRES = 'tokenExpiresIn';
export const STORAGE_USER = 'user';
export const STORAGE_COMPACT = 'compact';
export const STORAGE_SETTING_SCRIPT_VISIBLE = 'invis';

/**
 * Sets the user data in browser storage after minimalizing the user object.
 * 
 * @param {Object} user - The user object containing user data.
 * @param {string} user.display_name - The display name of the user.
 * @param {string} user.id - The unique identifier of the user.
 * @param {string} user.extension_log - The extension log of the user.
 * @param {string} user.locale_frontend - The locale of the user for frontend.
 * @returns {Promise} A Promise that resolves once the user data is stored in browser storage.
 */
export async function storageSetUser(user) {
    const minimalUser = {
        display_name: user.display_name,
        id: user.id,
        extension_log: user.extension_log,
        locale: user.locale_frontend,
    };

    await browser.storage.sync.set({ [STORAGE_USER]: minimalUser });
}

/**
 * Set the token in browser storage.
 *
 * @param {string} token - The token to be stored.
 * @returns {Promise} A Promise that resolves once the token is successfully stored.
 */
export async function storageSetToken(token) {
    await browser.storage.sync.set({ [STORAGE_TOKEN]: token });
}

/**
 * Set the value of the 'compact' key in the browser's synchronized storage.
 * 
 * @param {any} compact - The value to be set for the 'compact' key.
 * @returns {Promise} A Promise that resolves when the value is successfully set in the storage.
 */
export async function storageSetCompact(compact) {
    await browser.storage.sync.set({ [STORAGE_COMPACT]: compact });
}

/**
 * Set the visibility setting for a script in browser storage.
 *
 * @param {boolean} visible - The visibility status to be set for the script.
 * @returns {Promise} A Promise that resolves once the visibility setting is stored in browser storage.
 */
export async function storageSetSettingVisible(visible) {
    await browser.storage.sync.set({ [STORAGE_SETTING_SCRIPT_VISIBLE]: visible });
}

/**
 * Retrieves the visibility setting from browser storage.
 * 
 * @returns {Promise<boolean>} A promise that resolves to a boolean value indicating the visibility setting.
 */
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

/**
 * Retrieves the value of the 'compact' key from browser's sync storage.
 * 
 * @returns {Promise<any>} A promise that resolves with the value associated with the 'compact' key in the sync storage.
 */
export async function storageGetCompact() {
    return (await browser.storage.sync.get(STORAGE_COMPACT))[STORAGE_COMPACT];
}

/**
 * Asynchronous function to retrieve the user data from browser storage.
 * 
 * @returns {Promise<any>} A promise that resolves with the user data stored in the browser storage.
 */
export async function storageGetUser() {
    return (await browser.storage.sync.get(STORAGE_USER))[STORAGE_USER];
}

/**
 * Retrieves the token from browser storage.
 *
 * @returns {Promise<string>} A promise that resolves with the token value stored in browser storage.
 */
export async function storageGetToken() {
    return (await browser.storage.sync.get(STORAGE_TOKEN))[STORAGE_TOKEN];
}

/**
 * Retrieves all data stored in the browser's synchronized storage.
 * 
 * @returns {Promise<Object>} A promise that resolves with an object containing all data stored in the synchronized storage.
 */
export function storageGetAll() {
    return browser.storage.sync.get();
}

/**
 * Clears the specified keys from the browser's synchronized storage.
 * 
 * @returns {Promise} A Promise that resolves once the specified keys are removed from storage.
 */
export async function clearStorage() {
    return browser.storage.sync.remove([
        STORAGE_TOKEN,
        STORAGE_USER,
    ]);
}
