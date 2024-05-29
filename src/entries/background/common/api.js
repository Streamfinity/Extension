import browser from 'webextension-polyfill';
import { storageGetToken, storageGetUser } from '~/entries/background/common/storage';
import { sendMessageToContentScript } from '~/entries/background/common/spaceship';
import { EVENT_REFRESH_AUTH } from '~/messages';
import { createLogger } from '~/common/log';
import { getApiUrl } from '~/config';

const log = createLogger('Background-API');

/**
 * Makes an API request to the specified URL with the given options.
 * 
 * @param {string} url - The URL to make the API request to.
 * @param {Object} opts - The options for the API request.
 * @param {Object} opts.query - The query parameters for the request.
 * @param {Object} opts.headers - The headers for the request.
 * @param {string} opts.token - The authorization token for the request.
 * @param {Object} opts.json - The JSON data to send in the request body.
 * 
 * @returns {Promise<Object>} - A promise that resolves to an object with the response status and data.
 * @throws {Error} - If an error occurs during the API request.
 */
export async function api(url, opts) {
    const options = opts;

    const host = getApiUrl();
    let finalUrl = `${host}/api/v1/${url}`;

    const user = await storageGetUser();

    if (user && user.locale) {
        options.query = options.query ? { ...options.query, hl: user.locale } : { hl: user.locale };
    }

    if (options.query) {
        finalUrl = `${finalUrl}?${new URLSearchParams(options.query)}`;
        delete options.query;
    }

    let response;
    try {
        response = await fetch(finalUrl, {
            headers: {
                Accept: 'application/json',
                ...options?.headers || {},
                ...options?.token ? {
                    Authorization: `Bearer ${options.token}`,
                } : {},
                ...options?.json ? {
                    'Content-Type': 'application/json',
                } : {},
            },
            ...options || {},
            ...options?.json ? {
                body: JSON.stringify(options.json),
            } : {},
        });

        return {
            status: response.status,
            data: await response.json(),
        };
    } catch (err) {
        log.error('error sending API request', { status: response?.status, url: finalUrl });
        throw err;
    }
}

/**
 * Retrieves the extension status by gathering information such as platform, version, and operating system.
 * 
 * @returns {Promise} A promise that resolves with the extension status data, including platform, version, and OS.
 */
export async function getExtensionStatus() {
    let platform = null;
    let version = null;
    let os = null;

    if (browser.runtime.getManifest) {
        version = browser.runtime.getManifest()?.version || null;
    }

    if (browser.runtime.getPlatformInfo) {
        os = (await browser.runtime.getPlatformInfo()).os || null;
    }

    if (navigator && navigator.userAgent) {
        if (navigator.userAgent.includes('Chrome')) {
            platform = 'chrome';
        } else if (navigator.userAgent.includes('Firefox')) {
            platform = 'firefox';
        }
    }

    return api('extension/status', {
        token: await storageGetToken(),
        query: {
            platform,
            version,
            os,
        },
    });
}

/**
 * Function to retrieve the authenticated user information.
 * 
 * @param {Object} options - The options object containing the authentication token.
 * @param {string} options.token - The authentication token for the user.
 * 
 * @returns {Promise<Object>} A promise that resolves to an object with the status and data of the API response.
 */
export async function getAuthenticatedUser({ token }) {
    return api('users/@me', {
        token,
    });
}

/**
 * Update the visibility of the extension by sending a POST request to the 'extension/visibility' API endpoint.
 * 
 * @param {Object} data - The data to be sent in the request body.
 * @returns {Promise<Object>} A promise that resolves to the suggestion data received from the API.
 */
export async function updateExtensionVisibility(data) {
    const { data: suggestion } = await api('extension/visibility', {
        method: 'POST',
        token: await storageGetToken(),
        json: data,
    });

    return suggestion;
}

/**
 * Function to search for suggestion accounts based on a query.
 * 
 * @param {Object} options - The options object containing the query to search for.
 * @param {string} options.query - The query string to search for suggestion accounts.
 * 
 * @returns {Promise<Array>} - A promise that resolves with an array of suggestion accounts matching the query.
 */
export async function searchSuggestionAccounts({ query }) {
    const { data } = await api('suggestions/search-account', {
        token: await storageGetToken(),
        query: {
            query,
        },
    });

    return data;
}

/**
 * Submits a suggestion by making a POST request to the 'suggestions' API endpoint.
 * 
 * @param {Object} data - The data of the suggestion to be submitted.
 * @returns {Object} The submitted suggestion data.
 */
export async function submitSuggestion(data) {
    const { data: suggestion } = await api('suggestions', {
        method: 'POST',
        token: await storageGetToken(),
        json: data,
    });

    return suggestion;
}

/**
 * Retrieves the watched reactions for a specific user.
 *
 * @param {Object} params - The parameters for the function.
 * @param {string} params.userId - The ID of the user for whom to retrieve watched reactions.
 * @returns {Array} An array of watched reactions for the specified user.
 */
export async function getWatchedReactions({ userId }) {
    const { data: watchedReactions } = await api(`users/${userId}/watched-reactions`, {
        token: await storageGetToken(),
    });

    return watchedReactions;
}

/**
 * Submits a reaction by making a POST request to the 'reactions' API endpoint.
 * 
 * @param {Object} data - The data object containing the information for the reaction.
 * @returns {Promise<Object>} - A promise that resolves to the response data from the API.
 */
export async function submitReaction(data) {
    const { data: response } = await api('reactions', {
        method: 'POST',
        token: await storageGetToken(),
        json: data,
    });

    return response;
}

/**
 * Retrieves reactions for a specific video based on the provided video URL and filter criteria.
 * 
 * @param {Object} params - The parameters for fetching reactions.
 * @param {string} params.videoUrl - The URL of the video to fetch reactions for.
 * @param {boolean} params.onlyFollowed - Flag to indicate whether to fetch reactions only from followed users.
 * 
 * @returns {Promise<Object>} A promise that resolves to the reactions policy object for the specified video.
 */
export async function getReactionsForVideo({ videoUrl, onlyFollowed }) {
    const { data: policy } = await api('reactions/to-video', {
        token: await storageGetToken(),
        query: {
            video_url: videoUrl,
            only_followed: onlyFollowed ? 1 : '',
        },
    });

    return policy;
}

/**
 * Retrieves the reaction policy for a specific video based on the provided parameters.
 * 
 * @param {Object} params - The parameters object containing the videoUrl, channelUrl, and userId.
 * @param {string} params.videoUrl - The URL of the video for which the reaction policy is being retrieved.
 * @param {string} params.channelUrl - The URL of the channel associated with the video.
 * @param {string} params.userId - The ID of the user for whom the reaction policy is being fetched.
 * 
 * @returns {Promise<Object>} A promise that resolves to the reaction policy data object.
 */
export async function getReactionPolicy({ videoUrl, channelUrl, userId }) {
    const { data: policy } = await api('reaction-policies/for-video', {
        query: {
            video_url: videoUrl,
            channel_url: channelUrl,
            from_user_id: userId,
        },
    });

    return policy;
}

/**
 * Retrieves content ratings for a specific video URL.
 * 
 * @param {Object} params - The parameters for fetching content ratings.
 * @param {string} params.videoUrl - The URL of the video for which ratings are to be fetched.
 * 
 * @returns {Promise<Array>} - A promise that resolves with an array of content ratings for the specified video.
 */
export async function getContentRatings({ videoUrl }) {
    const { data: ratings } = await api('content-ratings/by-video', {
        query: {
            video_url: videoUrl,
        },
    });

    return ratings;
}

/**
 * Retrieves the original videos associated with a given video URL.
 * 
 * @param {Object} options - The options object containing the video URL.
 * @param {string} options.videoUrl - The URL of the video for which original videos are to be retrieved.
 * 
 * @returns {Array} An array of original videos associated with the provided video URL.
 */
export async function getOriginalVideosForVideo({ videoUrl }) {
    const { data: videos } = await api('reactions/original-videos', {
        query: {
            video_url: videoUrl,
        },
    });

    return videos;
}

/**
 * Creates playback progress for a given live stream.
 * 
 * @param {Object} options - The options object containing data and liveStreamId.
 * @param {Object} options.data - The data object containing timestamp, date, and url.
 * @param {number} options.data.timestamp - The timestamp of the playback progress.
 * @param {string} options.data.date - The date when the playback progress was created.
 * @param {string} options.data.url - The original URL of the playback progress.
 * @param {string} liveStreamId - The ID of the live stream for which playback progress is being created.
 * @returns {Promise<void>} - A promise that resolves once the playback progress is created.
 */
export async function createPlaybackProgress({ data, liveStreamId }) {
    const items = [{
        timestamp: Math.round(data.timestamp),
        created_at: data.date,
        original_url: data.url,
        stream_id: liveStreamId,
    }];

    await api('extension/playback', {
        token: await storageGetToken(),
        method: 'post',
        json: { items },
    });
}

/**
 * Function to retrieve video analytics data for a given video URL and account IDs.
 * 
 * @param {Object} params - Object containing videoUrl and accountIds.
 * @param {string} params.videoUrl - The URL of the video for which analytics data is to be retrieved.
 * @param {Array} params.accountIds - An array of account IDs for which analytics data is to be retrieved.
 * 
 * @returns {Promise<Object>} - A promise that resolves to the analytics data for the specified video and account IDs.
 */
export async function getVideoAnalytics({ videoUrl, accountIds }) {
    const { data: analytics } = await api('analytics/videos', {
        token: await storageGetToken(),
        query: {
            video_url: videoUrl,
            ...Object.fromEntries(accountIds.map((id, key) => `account_id[${key}]`).map((key, i) => [key, accountIds[i]])),
        },
    });

    return analytics;
}

/**
 * Retrieves community notes for a specific video URL.
 * 
 * @param {Object} params - The parameters for fetching community notes.
 * @param {string} params.videoUrl - The URL of the video for which to fetch community notes.
 * 
 * @returns {Promise<Array>} - A promise that resolves to an array of community notes for the specified video URL.
 */
export async function getCommunityNotes({ videoUrl }) {
    const { data: notes } = await api('community/notes/for-video', {
        token: await storageGetToken(),
        query: {
            video_url: videoUrl,
        },
    });

    return notes;
}

/**
 * Updates the user's incognito mode by sending a POST request to the 'extension/visibility' API endpoint.
 * 
 * @param {Object} params - The parameters for updating the incognito mode.
 * @param {number} params.length - The length of the incognito mode.
 * @returns {Promise<Object>} - A promise that resolves to the data returned from the API after updating the incognito mode.
 */
export async function updateUserIncognitoMode({ length }) {
    const { data } = await api('extension/visibility', {
        method: 'POST',
        token: await storageGetToken(),
        json: {
            length,
        },
    });

    await sendMessageToContentScript(EVENT_REFRESH_AUTH, {});

    return data;
}
