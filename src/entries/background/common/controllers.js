import * as api from '~/entries/background/common/api';
import * as messages from '~/messages';
import * as actions from '~/entries/background/common/actions';
import { storageGetAll } from '~/entries/background/common/storage';
import { createLogger } from '~/common/log';

const log = createLogger('Background');

async function getResponse(type, data) {
    const callback = {
        [messages.OPEN_POPUP]: actions.openPopup,
        [messages.SET_BROWSER_THEME]: actions.updateScheme,
        [messages.LOGOUT]: actions.logout,
        [messages.LOGIN]: actions.login,
        [messages.GET_STATUS]: actions.getStatus,
        [messages.PLAYER_PROGRESS]: actions.sendPlayerProgress,
        [messages.SUGGESTIONS_SEARCH_ACCOUNT]: api.searchSuggestionAccounts,
        [messages.SUGGESTIONS_SUBMIT]: api.submitSuggestion,
        [messages.WATCHED_REACTIONS_GET]: api.getWatchedReactions,
        [messages.REACTION_SUBMIT]: api.submitReaction,
        [messages.REACTION_POLICY_GET]: api.getReactionPolicy,
        [messages.CONTENT_RATINGS_GET]: api.getContentRatings,
        [messages.REACTIONS_GET_FOR_VIDEO]: api.getReactionsForVideo,
        [messages.REACTIONS_GET_ORIGINAL_VIDEOS]: api.getOriginalVideosForVideo,
        [messages.SETTING_UPDATE_VISIBLE]: actions.updateSettingUpdateVisible,
    };

    if (callback[type]) {
        return callback[type](data);
    }

    return null;
}

export async function handleMessage(msg) {
    if (typeof msg !== 'object') {
        log.warn('message is not an object', { msg });
        return Promise.resolve();
    }

    const { type, data } = msg;
    log.debug('RECV ->', type, data);

    const response = await getResponse(type, data);

    if (response === null) {
        return Promise.resolve();
    }

    return response;
}

// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------

(async () => {
    log.debug('storage', await storageGetAll());
    log.debug('----------------------------------------------');
})();
