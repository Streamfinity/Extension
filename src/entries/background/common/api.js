import browser from 'webextension-polyfill';
import moment from 'moment';
import { storageGetToken, storageGetUser } from '~/entries/background/common/storage';
import { sendMessageToContentScript } from '~/entries/background/common/spaceship';
import { EVENT_REFRESH_AUTH } from '~/messages';
import { createLogger } from '~/common/log';
import { getApiUrl } from '~/config';

const log = createLogger('Background-API');

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

export async function getAuthenticatedUser({ token }) {
    return api('users/@me', {
        token,
    });
}

export async function updateExtensionVisibility(data) {
    const { data: suggestion } = await api('extension/visibility', {
        method: 'POST',
        token: await storageGetToken(),
        json: data,
    });

    return suggestion;
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

export async function getContentRatings({ videoUrl }) {
    const { data: ratings } = await api('content-ratings/by-video', {
        query: {
            video_url: videoUrl,
        },
    });

    return ratings;
}

export async function getOriginalVideosForVideo({ videoUrl }) {
    const { data: videos } = await api('reactions/original-videos', {
        query: {
            video_url: videoUrl,
        },
    });

    return videos;
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

export async function getCommunityNotes({ videoUrl }) {
    const { data: notes } = await api('community/notes/for-video', {
        token: await storageGetToken(),
        query: {
            video_url: videoUrl,
        },
    });

    return notes;
}

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
