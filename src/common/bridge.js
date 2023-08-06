// Bridge sends messages from ContentScripts to BackgroundScripts/ServiceWorkers

import browser from 'webextension-polyfill';
import {
    SUGGESTIONS_SEARCH_ACCOUNT, SUGGESTIONS_SUBMIT, WATCHED_REACTIONS_GET, PLAYER_PROGRESS, GET_STATUS,
} from '~/messages';
import { createLogger } from '~/common/log';

const log = createLogger('Bridge');

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
