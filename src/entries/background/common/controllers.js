import * as api from '~/entries/background/common/api';
import * as messages from '~/messages';
import * as actions from '~/entries/background/common/actions';
import { storageGetAll } from '~/entries/background/common/storage';
import { createLogger } from '~/common/log';

const log = createLogger('Background');

/**
 * Retrieves the appropriate action or API function based on the provided type and executes it with the given data.
 * 
 * @param {string} type - The type of action or API function to be executed.
 * @param {object} data - The data to be passed to the action or API function.
 * @returns {Promise} A Promise that resolves with the result of the executed action or API function, or null if the type is not recognized.
 */
async function getResponse(type, data) {
    const callback = {
        // Actions

        [messages.OPEN_POPUP]: actions.openPopup,
        [messages.SET_BROWSER_THEME]: actions.updateScheme,
        [messages.LOGOUT]: actions.logout,
        [messages.LOGIN]: actions.login,
        [messages.GET_STATUS]: actions.getStatus,
        [messages.PLAYER_PROGRESS]: actions.sendPlayerProgress,
        [messages.SETTING_UPDATE_VISIBLE]: actions.updateSettingUpdateVisible,

        // API

        [messages.SUGGESTIONS_SEARCH_ACCOUNT]: api.searchSuggestionAccounts,
        [messages.SUGGESTIONS_SUBMIT]: api.submitSuggestion,
        [messages.WATCHED_REACTIONS_GET]: api.getWatchedReactions,
        [messages.REACTION_SUBMIT]: api.submitReaction,
        [messages.REACTION_POLICY_GET]: api.getReactionPolicy,
        [messages.CONTENT_RATINGS_GET]: api.getContentRatings,
        [messages.REACTIONS_GET_FOR_VIDEO]: api.getReactionsForVideo,
        [messages.REACTIONS_GET_ORIGINAL_VIDEOS]: api.getOriginalVideosForVideo,
        [messages.VIDEO_ANALYTICS_GET]: api.getVideoAnalytics,
        [messages.COMMUNITY_NOTES_GET]: api.getCommunityNotes,
        [messages.TOGGLE_INCOGNITO_MODE]: api.updateUserIncognitoMode,
    };

    if (callback[type]) {
        return callback[type](data);
    }

    log.error('got message without listener', type);

    return null;
}

/**
 * Handle messages received from content scripts.
 * 
 * @param {string} type - The type of message being received.
 * @param {any} data - The data associated with the message.
 * @returns {Promise<any>} A promise that resolves with the response to the message.
 */
export async function onContentScriptMessage(type, data) {
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
