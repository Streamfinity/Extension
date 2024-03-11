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
    REACTIONS_GET_FOR_VIDEO,
    SETTING_UPDATE_VISIBLE,
    OPEN_POPUP,
    SET_BROWSER_THEME,
    REACTIONS_GET_ORIGINAL_VIDEOS,
} from '~/messages';
import { createLogger } from '~/common/log';
import { sendMessageToBackground } from '~/entries/background/common/spaceship';

const log = createLogger('Bridge');

export async function login() {
    return sendMessageToBackground( LOGIN);
}

export async function logout() {
    return sendMessageToBackground(LOGOUT)
}

export async function sendPlayerProgress(data) {
    await browser.runtime.sendMessage({
        type: PLAYER_PROGRESS,
        data,
    });
}

export async function searchSuggestionAccounts(data) {
    const { data: accounts } = sendMessageToBackground( SUGGESTIONS_SEARCH_ACCOUNT, data);

    log.debug('searchSuggestionAccounts', accounts);

    return accounts;
}

export async function submitSuggestion(data) {
    const response = await sendMessageToBackground(SUGGESTIONS_SUBMIT, data);

    if (response.message) {
        throw new Error(response.message);
    }

    return response.suggestion;
}

export async function getWatchedReactions(data) {
    const { data: suggestion } = await sendMessageToBackground(WATCHED_REACTIONS_GET, data);

    return suggestion;
}

export async function getStatus() {
    // TODO move this to the useStatus/useAuth hook and watch for tanstack query error property
    try {
        const { data } = await sendMessageToBackground( GET_STATUS );

        return data;
    } catch (err) {
        log.error('getStatus()', 'error', err);
    }

    return null;
}

export async function submitReaction(data) {
    const response = await sendMessageToBackground( REACTION_SUBMIT, data );

    if (response.message) {
        throw new Error(response.message);
    }

    return response;
}

export async function getReactionPolicyForVideo({ videoUrl, channelUrl }) {
    const data = await sendMessageToBackground( REACTION_POLICY_GET,  { videoUrl, channelUrl } );

    return { data: data?.data };
}

export async function settingsUpdateVisible({ visible }) {
    return sendMessageToBackground(
        SETTING_UPDATE_VISIBLE,
         { visible },
    );
}

export async function openSettings() {
    return sendMessageToBackground(
         OPEN_POPUP,
    );
}

export async function setTheme({ isDark }) {
    return sendMessageToBackground(
        SET_BROWSER_THEME,
        { dark: isDark },
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

export function useReactionPolicyForVideo({ videoUrl, channelUrl }) {
    const query = useQuery({
        queryKey: ['reaction-policies', videoUrl, channelUrl],
        queryFn: () => sendMessageToBackground(
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

export function useContentRatings({ videoUrl }) {
    const query = useQuery({
        queryKey: ['content-ratings', videoUrl],
        queryFn: () => sendMessageToBackground(
             CONTENT_RATINGS_GET,
            { videoUrl },
        ),
        enabled: !!videoUrl,
    });

    return {
        ...query,
        data: query.data?.data,
    };
}

export function useReactions({ videoUrl, onlyFollowed }) {
    const query = useQuery({
        queryKey: ['reactions-to-video', videoUrl, onlyFollowed],
        queryFn: () => sendMessageToBackground(
             REACTIONS_GET_FOR_VIDEO,
             { videoUrl, onlyFollowed },
        ),
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
        queryFn: () => sendMessageToBackground(
             REACTIONS_GET_ORIGINAL_VIDEOS,
            { videoUrl },
        ),
        enabled: !!videoUrl,
    });

    return {
        ...query,
        data: query.data?.data,
    };
}
