// Bridge sends messages from ContentScripts to BackgroundScripts/ServiceWorkers

import { useQuery } from '@tanstack/react-query';
import * as messages from '~/messages';
import { sendMessageToBackground } from '~/entries/background/common/spaceship';

// Auth

export async function login() {
    return sendMessageToBackground(messages.LOGIN);
}

export async function logout() {
    return sendMessageToBackground(messages.LOGOUT);
}

// User

export async function toggleIncognitoMode({ length }) {
    return sendMessageToBackground(messages.TOGGLE_INCOGNITO_MODE, {
        length,
    });
}

// Player

export async function sendPlayerProgress(data) {
    await sendMessageToBackground(
        messages.PLAYER_PROGRESS,
        data,
    );
}

// Status

async function getStatus() {
    const { data } = await sendMessageToBackground(messages.GET_STATUS);

    return data || null;
}

// Suggestions

export async function searchSuggestionAccounts(data) {
    const { data: accounts } = await sendMessageToBackground(messages.SUGGESTIONS_SEARCH_ACCOUNT, data);

    return accounts;
}

export async function submitSuggestion(data) {
    const response = await sendMessageToBackground(messages.SUGGESTIONS_SUBMIT, data);

    return response.suggestion;
}

export async function getWatchedReactions(data) {
    const { data: suggestion } = await sendMessageToBackground(messages.WATCHED_REACTIONS_GET, data);

    return suggestion;
}

// Content Ratings

async function getContentRatingsForVideo({ videoUrl }) {
    return sendMessageToBackground(
        messages.CONTENT_RATINGS_GET,
        { videoUrl },
    );
}

// Reactions

async function getReactionsForVideo({ videoUrl, onlyFollowed, limit }) {
    return sendMessageToBackground(
        messages.REACTIONS_GET_FOR_VIDEO,
        { videoUrl, onlyFollowed, limit },
    );
}

async function getReactionOriginalVideos({ videoUrl }) {
    return sendMessageToBackground(
        messages.REACTIONS_GET_ORIGINAL_VIDEOS,
        { videoUrl },
    );
}

export async function submitReaction(data) {
    const response = await sendMessageToBackground(messages.REACTION_SUBMIT, data);

    if (response.message) {
        throw new Error(response.message);
    }

    return response;
}

// Reaction Policy

async function getReactionPolicyForVideo({ videoUrl, channelUrl, userId }) {
    const data = await sendMessageToBackground(
        messages.REACTION_POLICY_GET,
        { videoUrl, channelUrl, userId },
    );

    return { data: data?.data };
}

// Analytics

async function getVideoAnalytics({ videoUrl, accountIds }) {
    return sendMessageToBackground(
        messages.VIDEO_ANALYTICS_GET,
        { videoUrl, accountIds },
    );
}

// Settings

export async function settingsUpdateVisible({ visible }) {
    return sendMessageToBackground(
        messages.SETTING_UPDATE_VISIBLE,
        { visible },
    );
}

export async function setTheme({ isDark }) {
    return sendMessageToBackground(
        messages.SET_BROWSER_THEME,
        { dark: isDark },
    );
}

// Community Notes

export async function getCommunityNotes({ videoUrl }) {
    return sendMessageToBackground(
        messages.COMMUNITY_NOTES_GET,
        { videoUrl },
    );
}

// ------------------------------------------------------------------------------------------------------------------------
// Hooks
// ------------------------------------------------------------------------------------------------------------------------

export function useStatus() {
    return useQuery({
        queryKey: ['status'],
        queryFn: () => getStatus(),
        keepPreviousData: true,
        retry: false,
        refetchInterval: 10000,
    });
}

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

export function useReactions({ videoUrl, onlyFollowed, limit }) {
    const query = useQuery({
        queryKey: ['reactions-to-video', videoUrl, onlyFollowed, limit],
        queryFn: () => getReactionsForVideo({ videoUrl, onlyFollowed, limit }),
        enabled: !!videoUrl,
    });

    return {
        ...query,
        data: query.data?.data,
    };
}

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
