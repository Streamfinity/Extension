// Bridge sends messages from ContentScripts to BackgroundScripts/ServiceWorkers

import { useQuery } from '@tanstack/react-query';
import * as messages from '~/messages';
import { sendMessageToBackground } from '~/entries/background/common/spaceship';

// ------------------------------------------------------------------------------------------------------------------------
// Authentication
// ------------------------------------------------------------------------------------------------------------------------

/**
 * Function: login
 * Description: Sends a message to the background script to initiate the login process.
 * 
 * @returns {Promise} A promise that resolves with the response from the background script.
 */
export async function login() {
    return sendMessageToBackground(messages.LOGIN);
}

/**
 * Function: logout
 * Description: Sends a message to the background script to initiate the logout process.
 * 
 * @returns {Promise} A promise that resolves with the response from the background script.
 */
export async function logout() {
    return sendMessageToBackground(messages.LOGOUT);
}

// ------------------------------------------------------------------------------------------------------------------------
// User
// ------------------------------------------------------------------------------------------------------------------------

/**
 * Function: toggleIncognitoMode
 * Description: Toggles the incognito mode by sending a message to the background script.
 * 
 * @param {Object} params - An object containing the length parameter.
 * @param {number} params.length - The length parameter for the incognito mode.
 * 
 * @returns {Promise} - A promise that resolves with the response from the background script.
 */
export async function toggleIncognitoMode({ length }) {
    return sendMessageToBackground(messages.TOGGLE_INCOGNITO_MODE, {
        length,
    });
}

// ------------------------------------------------------------------------------------------------------------------------
// Player
// ------------------------------------------------------------------------------------------------------------------------

/**
 * Sends player progress data to the background.
 *
 * @param {Object} data - The player progress data to send.
 * @returns {Promise} A promise that resolves when the data is successfully sent.
 */
export async function sendPlayerProgress(data) {
    await sendMessageToBackground(
        messages.PLAYER_PROGRESS,
        data,
    );
}

// ------------------------------------------------------------------------------------------------------------------------
// Status
// ------------------------------------------------------------------------------------------------------------------------

/**
 * Function: getStatus
 * Description: Retrieves the status by sending a message to the background script.
 * 
 * @returns {Promise<any>} The status data retrieved from the background script, or null if no data is returned.
 */
async function getStatus() {
    const { data } = await sendMessageToBackground(messages.GET_STATUS);

    return data || null;
}

// ------------------------------------------------------------------------------------------------------------------------
// Suggestions
// ------------------------------------------------------------------------------------------------------------------------

/**
 * Function: searchSuggestionAccounts
 * 
 * Description: This function sends a message to the background with a type of SUGGESTIONS_SEARCH_ACCOUNT
 *              and retrieves a list of suggested accounts based on the provided data.
 * 
 * @param {Object} data - The data to be sent along with the message for searching suggestion accounts.
 * 
 * @returns {Array} - An array of suggested accounts based on the provided data.
 */
export async function searchSuggestionAccounts(data) {
    const { data: accounts } = await sendMessageToBackground(messages.SUGGESTIONS_SEARCH_ACCOUNT, data);

    return accounts;
}

/**
 * Submits a suggestion to the background process.
 * 
 * @param {Object} data - The data of the suggestion to submit.
 * @returns {Object} The submitted suggestion response.
 */
export async function submitSuggestion(data) {
    const response = await sendMessageToBackground(messages.SUGGESTIONS_SUBMIT, data);

    return response.suggestion;
}

/**
 * Function: getWatchedReactions
 * Description: Retrieves watched reactions data from the background using sendMessageToBackground function.
 * 
 * @param {Object} data - The data object to be sent to the background for retrieving watched reactions.
 * @returns {Promise<Object>} - A promise that resolves to the watched reactions data.
 */
export async function getWatchedReactions(data) {
    const { data: suggestion } = await sendMessageToBackground(messages.WATCHED_REACTIONS_GET, data);

    return suggestion;
}

// ------------------------------------------------------------------------------------------------------------------------
// Content Rating
// ------------------------------------------------------------------------------------------------------------------------

/**
 * Function to get content ratings for a specific video by sending a message to the background.
 * 
 * @param {Object} params - The parameters for getting content ratings.
 * @param {string} params.videoUrl - The URL of the video for which content ratings are requested.
 * 
 * @returns {Promise} A promise that resolves with the content ratings data for the specified video.
 */
async function getContentRatingsForVideo({ videoUrl }) {
    return sendMessageToBackground(
        messages.CONTENT_RATINGS_GET,
        { videoUrl },
    );
}

// ------------------------------------------------------------------------------------------------------------------------
// Reactions
// ------------------------------------------------------------------------------------------------------------------------

/**
 * Function: getReactionsForVideo
 * 
 * Description: This function sends a message to the background with the type 'REACTIONS_GET_FOR_VIDEO' and the provided videoUrl and onlyFollowed parameters.
 * 
 * @param {Object} params - An object containing the videoUrl and onlyFollowed parameters.
 * @param {string} params.videoUrl - The URL of the video for which reactions are being requested.
 * @param {boolean} params.onlyFollowed - A flag indicating whether to fetch reactions only from followed users.
 * 
 * @returns {Promise} A Promise that resolves with the response from the background after sending the message.
 */
async function getReactionsForVideo({ videoUrl, onlyFollowed }) {
    return sendMessageToBackground(
        messages.REACTIONS_GET_FOR_VIDEO,
        { videoUrl, onlyFollowed },
    );
}

/**
 * Function: getReactionOriginalVideos
 * 
 * Description: This function sends a message to the background script to get original videos for a given video URL.
 * 
 * @param {Object} params - An object containing the videoUrl parameter.
 * @param {string} params.videoUrl - The URL of the video for which original videos are requested.
 * 
 * @returns {Promise} A promise that resolves with the response from the background script.
 */
async function getReactionOriginalVideos({ videoUrl }) {
    return sendMessageToBackground(
        messages.REACTIONS_GET_ORIGINAL_VIDEOS,
        { videoUrl },
    );
}

/**
 * Submits a reaction to the background using the sendMessageToBackground function.
 * 
 * @param {Object} data - The data to be submitted for the reaction.
 * @returns {Promise<Object>} - A promise that resolves to the response from the background.
 * @throws {Error} - If there is an error in the response or if the response contains an error message.
 */
export async function submitReaction(data) {
    const response = await sendMessageToBackground(messages.REACTION_SUBMIT, data);

    if (response.message) {
        throw new Error(response.message);
    }

    return response;
}

// ------------------------------------------------------------------------------------------------------------------------
// Reaction Policy
// ------------------------------------------------------------------------------------------------------------------------

/**
 * Retrieves the reaction policy for a specific video by sending a message to the background script.
 * 
 * @param {Object} params - The parameters for the request.
 * @param {string} params.videoUrl - The URL of the video.
 * @param {string} params.channelUrl - The URL of the channel.
 * @param {string} params.userId - The ID of the user.
 * @returns {Promise<Object>} A promise that resolves to an object containing the reaction policy data.
 */
async function getReactionPolicyForVideo({ videoUrl, channelUrl, userId }) {
    const data = await sendMessageToBackground(
        messages.REACTION_POLICY_GET,
        { videoUrl, channelUrl, userId },
    );

    return { data: data?.data };
}

// ------------------------------------------------------------------------------------------------------------------------
// Analytics
// ------------------------------------------------------------------------------------------------------------------------

/**
 * Function: getVideoAnalytics
 * 
 * Description: This function sends a message to the background script to retrieve video analytics data for a specific video URL and account IDs.
 * 
 * @param {Object} params - An object containing the videoUrl and accountIds for which the video analytics data is requested.
 * @param {string} params.videoUrl - The URL of the video for which analytics data is requested.
 * @param {Array} params.accountIds - An array of account IDs associated with the video.
 * 
 * @returns {Promise} A promise that resolves with the video analytics data retrieved from the background script.
 */
async function getVideoAnalytics({ videoUrl, accountIds }) {
    return sendMessageToBackground(
        messages.VIDEO_ANALYTICS_GET,
        { videoUrl, accountIds },
    );
}

// ------------------------------------------------------------------------------------------------------------------------
// Settings
// ------------------------------------------------------------------------------------------------------------------------

/**
 * Update the visibility settings by sending a message to the background script.
 * 
 * @param {Object} options - The options object.
 * @param {boolean} options.visible - The visibility status to be updated.
 * @returns {Promise} A promise that resolves with the response from the background script.
 */
export async function settingsUpdateVisible({ visible }) {
    return sendMessageToBackground(
        messages.SETTING_UPDATE_VISIBLE,
        { visible },
    );
}

/**
 * Set the browser theme to either dark or light mode.
 *
 * @param {Object} options - The options object.
 * @param {boolean} options.isDark - A boolean indicating whether to set the theme to dark mode.
 * 
 * @returns {Promise} A promise that resolves with the response from the background script.
 */
export async function setTheme({ isDark }) {
    return sendMessageToBackground(
        messages.SET_BROWSER_THEME,
        { dark: isDark },
    );
}

// ------------------------------------------------------------------------------------------------------------------------
// Community Notes
// ------------------------------------------------------------------------------------------------------------------------

/**
 * Function: getCommunityNotes
 * 
 * Description:
 * This function is responsible for fetching community notes for a given video URL by sending a message to the background script.
 * 
 * Parameters:
 * - videoUrl (string): The URL of the video for which community notes are to be fetched.
 * 
 * Returns:
 * Promise: A promise that resolves with the response containing the community notes data.
 */
export async function getCommunityNotes({ videoUrl }) {
    return sendMessageToBackground(
        messages.COMMUNITY_NOTES_GET,
        { videoUrl },
    );
}

// ------------------------------------------------------------------------------------------------------------------------
// Hooks
// ------------------------------------------------------------------------------------------------------------------------

/**
 * Custom hook to fetch and return the status data.
 * Uses useQuery hook from @tanstack/react-query to make the API call.
 * Query key is set to 'status'.
 * Query function calls the getStatus function to fetch the status data.
 * Previous data is kept and retries are disabled.
 * Data is refetched every 10 seconds (10000 milliseconds).
 * @returns {Object} The status data object or null if no data is available.
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
 * Custom React hook to fetch reaction policy for a video based on the provided video URL, channel URL, and user ID.
 * 
 * @param {Object} params - The parameters object containing videoUrl, channelUrl, and userId.
 * @param {string} params.videoUrl - The URL of the video.
 * @param {string} params.channelUrl - The URL of the channel.
 * @param {string} params.userId - The ID of the user.
 * 
 * @returns {Object} An object containing the query result with reaction policy data.
 */
export function useReactionPolicyForVideo({ videoUrl, channelUrl, userId }) {
    const query = useQuery({
        queryKey: ['reaction-policies', videoUrl, channelUrl, userId],
        queryFn: () => getReactionPolicyForVideo({ videoUrl, channelUrl, userId }),
        enabled: !!videoUrl && !!channelUrl,
    });

    return {
        ...query,
        data: query.data?.data,
    };
}

/**
 * Custom React hook to fetch content ratings for a specific video URL.
 * 
 * @param {Object} params - The parameters for fetching content ratings.
 * @param {string} params.videoUrl - The URL of the video to fetch content ratings for.
 * 
 * @returns {Object} An object containing the query result with the content ratings data.
 */
export function useContentRatings({ videoUrl }) {
    const query = useQuery({
        queryKey: ['content-ratings', videoUrl],
        queryFn: () => getContentRatingsForVideo({ videoUrl }),
        enabled: !!videoUrl,
    });

    return {
        ...query,
        data: query.data?.data,
    };
}

/**
 * Custom React hook to fetch reactions for a video based on the provided video URL and filter option.
 * 
 * @param {Object} params - The parameters for fetching reactions.
 * @param {string} params.videoUrl - The URL of the video to fetch reactions for.
 * @param {boolean} params.onlyFollowed - A flag to indicate whether to fetch reactions only from followed users.
 * 
 * @returns {Object} An object containing the query result with reaction data for the video.
 */
export function useReactions({ videoUrl, onlyFollowed }) {
    const query = useQuery({
        queryKey: ['reactions-to-video', videoUrl, onlyFollowed],
        queryFn: () => getReactionsForVideo({ videoUrl, onlyFollowed }),
        enabled: !!videoUrl,
    });

    return {
        ...query,
        data: query.data?.data,
    };
}

/**
 * Custom React hook to fetch original videos for a given video URL.
 * Uses the useQuery hook from '@tanstack/react-query' to make the API call.
 * 
 * @param {Object} params - The parameters for fetching original videos.
 * @param {string} params.videoUrl - The URL of the video for which original videos are to be fetched.
 * 
 * @returns {Object} An object containing the query result with original videos data.
 */
export function useOriginalVideos({ videoUrl }) {
    const query = useQuery({
        queryKey: ['original-videos-for-video', videoUrl],
        queryFn: () => getReactionOriginalVideos({ videoUrl }),
        enabled: !!videoUrl,
    });

    return {
        ...query,
        data: query.data?.data,
    };
}

/**
 * Custom React hook to fetch video analytics data based on the provided video URL and account IDs.
 * 
 * @param {Object} params - Object containing videoUrl and accountIds to fetch analytics data for.
 * @param {string} params.videoUrl - The URL of the video to fetch analytics data for.
 * @param {Array<string>} params.accountIds - An array of account IDs associated with the video.
 * 
 * @returns {Object} An object containing the query result with data property for easy access to the fetched analytics data.
 */
export function useVideoAnalytics({ videoUrl, accountIds }) {
    const query = useQuery({
        queryKey: ['video-analytics', videoUrl, accountIds],
        queryFn: () => getVideoAnalytics({ videoUrl, accountIds }),
        enabled: !!videoUrl && !!accountIds?.length,
    });

    return {
        ...query,
        data: query.data?.data,
    };
}

/**
 * Custom React hook to fetch community notes for a given video URL.
 * 
 * @param {Object} params - The parameters for fetching community notes.
 * @param {string} params.videoUrl - The URL of the video for which to fetch community notes.
 * 
 * @returns {Object} An object containing the query result with the community notes data.
 */
export function useCommunityNotes({ videoUrl }) {
    const query = useQuery({
        queryKey: ['community-notes', videoUrl],
        queryFn: () => getCommunityNotes({ videoUrl }),
        enabled: !!videoUrl,
    });

    return {
        ...query,
        data: query.data?.data,
    };
}
