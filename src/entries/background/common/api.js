import { storageGetToken } from '~/entries/background/common/storage';

/**
 * Makes an API request using the provided URL and options.
 * @param {string} url - The URL for the API request.
 * @param {object} opts - The options for the API request.
 * @param {object} opts.query - The query parameters for the API request.
 * @param {object} opts.headers - The headers for the API request.
 * @param {string} opts.token - The authorization token for the API request.
 * @param {object} opts.json - The JSON data for the API request.
 * @returns {Promise<object>} - The response object containing the status and data.
 */
export async function api(url, opts) {
    const options = opts;
    let finalUrl = `${import.meta.env.VITE_API_URL}/api/v1/${url}`;

    if (options.query) {
        finalUrl = `${finalUrl}?${new URLSearchParams(options.query)}`;
        delete options.query;
    }

    const response = await fetch(finalUrl, {
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
}

/**
 * Retrieves the extension status.
 * @returns {Promise<any>} The extension status.
 */
export async function getExtensionStatus() {
    return api('extension/status', {
        token: await storageGetToken(),
    });
}

/**
 * Retrieves the authenticated user information.
 * @param {Object} options - The options for retrieving the authenticated user.
 * @param {string} options.token - The authentication token.
 * @returns {Promise<Object>} - A promise that resolves to the authenticated user information.
 */
export async function getAuthenticatedUser({ token }) {
    return api('users/@me', {
        token,
    });
}

/**
 * Searches for suggestion accounts based on the given query.
 * @param {Object} options - The options for the search.
 * @param {string} options.query - The search query.
 * @returns {Promise<any>} - A promise that resolves with the search results.
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
 * Submits a suggestion.
 * @param {Object} data - The suggestion data.
 * @returns {Promise<Object>} - The submitted suggestion.
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
 * Retrieves the watched reactions for a given user.
 * @param {Object} options - The options for retrieving watched reactions.
 * @param {string} options.userId - The ID of the user.
 * @returns {Promise<Array>} - A promise that resolves to an array of watched reactions.
 */
export async function getWatchedReactions({ userId }) {
    const { data: watchedReactions } = await api(`users/${userId}/watched-reactions`, {
        token: await storageGetToken(),
    });

    return watchedReactions;
}

/**
 * Submits a reaction.
 * @param {Object} data - The data to be submitted.
 * @returns {Promise<Object>} - The response from the API.
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
 * Retrieves reactions for a video.
 * @param {Object} options - The options for retrieving reactions.
 * @param {string} options.videoUrl - The URL of the video.
 * @returns {Promise<Object>} - The policy data for the reactions.
 */
export async function getReactionsForVideo({ videoUrl }) {
    const { data: policy } = await api('reactions/to-video', {
        token: await storageGetToken(),
        query: {
            video_url: videoUrl,
            only_followed: 1,
        },
    });

    return policy;
}

/**
 * Retrieves the reaction policy for a given video and channel.
 * @param {Object} options - The options for retrieving the reaction policy.
 * @param {string} options.videoUrl - The URL of the video.
 * @param {string} options.channelUrl - The URL of the channel.
 * @returns {Promise<Object>} A promise that resolves with the reaction policy.
 */
export async function getReactionPolicy({ videoUrl, channelUrl }) {
    const { data: policy } = await api('reaction-policies/for-video', {
        query: {
            video_url: videoUrl,
            channel_url: channelUrl,
        },
    });

    return policy;
}

/**
 * Retrieves content ratings for a given video URL.
 * @param {Object} options - The options for retrieving content ratings.
 * @param {string} options.videoUrl - The URL of the video.
 * @returns {Promise<Array>} - A promise that resolves to an array of content ratings.
 */
export async function getContentRatings({ videoUrl }) {
    const { data: ratings } = await api('content-ratings/by-video', {
        query: {
            url: videoUrl,
        },
    });

    return ratings;
}

/**
 * Creates a playback progress entry.
 * @param {Object} options - The options for creating the playback progress.
 * @param {Object} options.data - The data for the playback progress.
 * @param {number} options.data.timestamp - The timestamp of the playback progress.
 * @param {string} options.data.date - The date of the playback progress.
 * @param {string} options.data.url - The original URL of the playback progress.
 * @param {string} options.liveStreamId - The ID of the live stream.
 * @returns {Promise<void>} - A promise that resolves when the playback progress is created.
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
