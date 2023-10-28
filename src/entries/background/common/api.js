import { storageGetToken, storageGetUser } from '~/entries/background/common/storage';

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

export async function getWatchedReactions(data) {
    const user = await storageGetUser();
    const { data: watchedReactions } = await api(`users/${user.id}/watched-reactions`, {
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
