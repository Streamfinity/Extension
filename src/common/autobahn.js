import browser from 'webextension-polyfill';
import { SUGGESTIONS_SEARCH_ACCOUNT, SUGGESTIONS_SUBMIT, WATCHED_REACTIONS_GET } from '~/messages';
import { createLogger } from '~/common/log';

const log = createLogger('Autobahn');

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
