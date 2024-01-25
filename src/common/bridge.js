// Bridge sends messages from ContentScripts to BackgroundScripts/ServiceWorkers

import browser from 'webextension-polyfill';
import { useQuery } from '@tanstack/react-query';
import {
    SUGGESTIONS_SEARCH_ACCOUNT,
    SUGGESTIONS_SUBMIT,
    WATCHED_REACTIONS_GET,
    PLAYER_PROGRESS,
    GET_STATUS,
    REACTION_SUBMIT,
    REACTION_POLICY_GET,
    LOGOUT,
    LOGIN,
    CONTENT_RATINGS_GET,
    REACTIONS_GET_FOR_VIDEO, SETTING_UPDATE_VISIBLE,
} from '~/messages';
import { createLogger } from '~/common/log';

const log = createLogger('Bridge');

/**
 * Logs in the user.
 * @returns {Promise} A promise that resolves when the login is successful.
 */
export async function login() {
    return browser.runtime.sendMessage({ type: LOGIN });
}

/**
 * Logs out the user.
 * @returns {Promise<any>} A promise that resolves when the logout request is sent.
 */
export async function logout() {
    return browser.runtime.sendMessage({ type: LOGOUT });
}

/**
 * Sends the player progress data to the background script.
 * @param {Object} data - The player progress data.
 * @returns {Promise<void>} - A promise that resolves when the message is sent.
 */
export async function sendPlayerProgress(data) {
    await browser.runtime.sendMessage({
        type: PLAYER_PROGRESS,
        data,
    });
}

/**
 * Searches for suggestion accounts based on the provided data.
 * @param {Object} data - The data used for searching suggestion accounts.
 * @returns {Promise<Array>} - A promise that resolves to an array of suggestion accounts.
 */
export async function searchSuggestionAccounts(data) {
    const { data: accounts } = await browser.runtime.sendMessage({ type: SUGGESTIONS_SEARCH_ACCOUNT, data });

    log.debug('searchSuggestionAccounts', accounts);

    return accounts;
}

/**
 * Submits a suggestion.
 * @param {Object} data - The suggestion data.
 * @returns {Promise<Object>} - The submitted suggestion.
 */
export async function submitSuggestion(data) {
    const { data: suggestion } = await browser.runtime.sendMessage({ type: SUGGESTIONS_SUBMIT, data });

    return suggestion;
}

/**
 * Retrieves watched reactions based on the provided data.
 * @param {any} data - The data used to retrieve watched reactions.
 * @returns {Promise<any>} - A promise that resolves with the retrieved watched reactions.
 */
export async function getWatchedReactions(data) {
    const { data: suggestion } = await browser.runtime.sendMessage({ type: WATCHED_REACTIONS_GET, data });

    return suggestion;
}

/**
 * Retrieves the status from the background script.
 * @returns {Promise<any>} A promise that resolves with the status data, or null if no data is available.
 */
export async function getStatus() {
    const { data } = await browser.runtime.sendMessage({ type: GET_STATUS });

    return data || null;
}

/**
 * Submits a reaction.
 * @param {Object} data - The data to be submitted.
 * @returns {Promise<Object>} - The response from the server.
 * @throws {Error} - If there is an error message in the response.
 */
export async function submitReaction(data) {
    const response = await browser.runtime.sendMessage({ type: REACTION_SUBMIT, data });

    if (response.message) {
        throw new Error(response.message);
    }

    return response;
}

/**
 * Retrieves the reaction policy for a video.
 * @param {Object} options - The options for retrieving the reaction policy.
 * @param {string} options.videoUrl - The URL of the video.
 * @param {string} options.channelUrl - The URL of the channel.
 * @returns {Promise<Object>} - A promise that resolves to an object containing the reaction policy data.
 */
export async function getReactionPolicyForVideo({ videoUrl, channelUrl }) {
    const data = await browser.runtime.sendMessage({ type: REACTION_POLICY_GET, data: { videoUrl, channelUrl } });

    return { data: data?.data };
}

/**
 * Updates the visibility settings.
 * @param {Object} options - The options for updating visibility.
 * @param {boolean} options.visible - The new visibility value.
 * @returns {Promise} A promise that resolves when the visibility settings are updated.
 */
export async function settingsUpdateVisible({ visible }) {
    return browser.runtime.sendMessage({
        type: SETTING_UPDATE_VISIBLE,
        data: { visible },
    });
}

// ------------------------------------------------------------------------------------------------------------------------
// Hooks
// ------------------------------------------------------------------------------------------------------------------------

/**
 * Custom hook to fetch and manage status data.
 * @returns {Object} The status data.
 */
export function useStatus() {
    return useQuery({
        queryKey: ['status'],
        queryFn: () => getStatus(),
        keepPreviousData: true,
        retry: false,
        refetchInterval: 10000,
    });
}

/**
 * Retrieves the reaction policy for a video based on its URL and channel URL.
 * @param {Object} options - The options for retrieving the reaction policy.
 * @param {string} options.videoUrl - The URL of the video.
 * @param {string} options.channelUrl - The URL of the channel.
 * @returns {Object} - The query object containing the reaction policy data.
 */
export function useReactionPolicyForVideo({ videoUrl, channelUrl }) {
    const query = useQuery({
        queryKey: ['reaction-policies', videoUrl],
        queryFn: () => browser.runtime.sendMessage({
            type: REACTION_POLICY_GET,
            data: { videoUrl, channelUrl },
        }),
        enabled: !!videoUrl || !!channelUrl,
    });

    return {
        ...query,
        data: query.data?.data,
    };
}

/**
 * Custom hook to fetch content ratings for a given video URL.
 * @param {Object} options - The options for fetching content ratings.
 * @param {string} options.videoUrl - The URL of the video.
 * @returns {Object} - The query object with content ratings data.
 */
export function useContentRatings({ videoUrl }) {
    const query = useQuery({
        queryKey: ['content-ratings', videoUrl],
        queryFn: () => browser.runtime.sendMessage({
            type: CONTENT_RATINGS_GET, data: { videoUrl },
        }),
        enabled: !!videoUrl,
    });

    return {
        ...query,
        data: query.data?.data,
    };
}

/**
 * Custom hook to fetch reactions for a video.
 * @param {Object} options - The options for fetching reactions.
 * @param {string} options.videoUrl - The URL of the video.
 * @returns {Object} - The query object with reaction data.
 */
export function useReactions({ videoUrl }) {
    const query = useQuery({
        queryKey: ['reactions-for-video', videoUrl],
        queryFn: () => browser.runtime.sendMessage({
            type: REACTIONS_GET_FOR_VIDEO, data: { videoUrl },
        }),
        enabled: !!videoUrl,
    });

    return {
        ...query,
        data: query.data?.data,
    };
}
