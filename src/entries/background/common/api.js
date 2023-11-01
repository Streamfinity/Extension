import { useQuery } from '@tanstack/react-query';
import browser from 'webextension-polyfill';
import { storageGetToken, storageGetUser } from '~/entries/background/common/storage';
import { REACTION_POLICY_GET } from '~/messages';

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

export async function getExtensionStatus() {
    return api('extension/status', {
        token: await storageGetToken(),
    });
}

export async function getAuthenticatedUser({ token }) {
    return api('users/@me', {
        token,
    });
}

export async function searchSuggestionAccounts({ query }) {
    const { data } = await api('suggestions/search-account', {
        token: await storageGetToken(),
        query: {
            query,
        },
    });

    return data;
}

export async function submitSuggestion(data) {
    const { data: suggestion } = await api('suggestions', {
        method: 'POST',
        token: await storageGetToken(),
        json: data,
    });

    return suggestion;
}

export async function getWatchedReactions({ userId }) {
    const { data: watchedReactions } = await api(`users/${userId}/watched-reactions`, {
        token: await storageGetToken(),
    });

    return watchedReactions;
}

export async function submitReaction(data) {
    const { data: response } = await api('reactions', {
        method: 'POST',
        token: await storageGetToken(),
        json: data,
    });

    return response;
}

export async function getReactionPolicy({ videoUrl, channelUrl }) {
    const { data: policy } = await api('reaction-policies/for-video', {
        query: {
            video_url: videoUrl,
            channel_url: channelUrl,
        },
    });

    return policy;
}

export async function getContentRatings({ videoUrl }) {
    const { data: ratings } = await api('content-ratings/by-video', {
        query: {
            url: videoUrl,
        },
    });

    return ratings;
}

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
