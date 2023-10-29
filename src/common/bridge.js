// Bridge sends messages from ContentScripts to BackgroundScripts/ServiceWorkers

import browser from 'webextension-polyfill';
import { useQuery } from '@tanstack/react-query';
import {
    SUGGESTIONS_SEARCH_ACCOUNT, SUGGESTIONS_SUBMIT, WATCHED_REACTIONS_GET, PLAYER_PROGRESS, GET_STATUS, REACTION_SUBMIT, REACTION_POLICY_GET, LOGOUT, LOGIN, CONTENT_RATINGS_GET,
} from '~/messages';
import { createLogger } from '~/common/log';
import { api } from '~/entries/background/common/api';

const log = createLogger('Bridge');

export async function login() {
    await browser.runtime.sendMessage({ type: LOGIN });
}

export async function logout() {
    await browser.runtime.sendMessage({ type: LOGOUT });
}

export async function sendPlayerProgress(data) {
    await browser.runtime.sendMessage({
        type: PLAYER_PROGRESS,
        data,
    });
}

export async function searchSuggestionAccounts(data) {
    const { data: accounts } = await browser.runtime.sendMessage({ type: SUGGESTIONS_SEARCH_ACCOUNT, data });

    log.debug('searchSuggestionAccounts', accounts);

    return accounts;
}

export async function submitSuggestion(data) {
    const { data: suggestion } = await browser.runtime.sendMessage({ type: SUGGESTIONS_SUBMIT, data });

    return suggestion;
}

export async function getWatchedReactions(data) {
    const { data: suggestion } = await browser.runtime.sendMessage({ type: WATCHED_REACTIONS_GET, data });

    return suggestion;
}

export async function getStatus() {
    const data = await browser.runtime.sendMessage({ type: GET_STATUS });

    return { status: data?.status, user: data?.user };
}

export async function submitReaction(data) {
    const response = await browser.runtime.sendMessage({ type: REACTION_SUBMIT, data });

    if (response.message) {
        throw new Error(response.message);
    }

    return response;
}

export async function getReactionPolicyForVideo({ videoUrl, channelUrl }) {
    const data = await browser.runtime.sendMessage({ type: REACTION_POLICY_GET, data: { videoUrl, channelUrl } });

    return { data: data?.data };
}

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
        items: query.data?.data,
    };
}
