// Content-Script -> Background

/**
 * Represents a collection of message types used for communication between the content script and the background script.
 * @module messages
 */

/**
 * Get status message type.
 * @type {string}
 */
export const GET_STATUS = 'status.get';

/**
 * Player progress message type.
 * @type {string}
 */
export const PLAYER_PROGRESS = 'player.progress';

/**
 * Login message type.
 * @type {string}
 */
export const LOGIN = 'auth.login';

/**
 * Logout message type.
 * @type {string}
 */
export const LOGOUT = 'auth.logout';

/**
 * Suggestions search account message type.
 * @type {string}
 */
export const SUGGESTIONS_SEARCH_ACCOUNT = 'suggestions.search-account';

/**
 * Suggestions submit message type.
 * @type {string}
 */
export const SUGGESTIONS_SUBMIT = 'suggestions.submit';

/**
 * Watched reactions get message type.
 * @type {string}
 */
export const WATCHED_REACTIONS_GET = 'watched-reactions.get';

/**
 * Reaction submit message type.
 * @type {string}
 */
export const REACTION_SUBMIT = 'reaction-suggestion.submit';

/**
 * Reaction policy get message type.
 * @type {string}
 */
export const REACTION_POLICY_GET = 'reaction-policy.get';

/**
 * Reactions get for video message type.
 * @type {string}
 */
export const REACTIONS_GET_FOR_VIDEO = 'reactions-for-video.submit';

/**
 * Content ratings get message type.
 * @type {string}
 */
export const CONTENT_RATINGS_GET = 'content-ratings.get';

/**
 * Setting update visible message type.
 * @type {string}
 */
export const SETTING_UPDATE_VISIBLE = 'settings.visible';

// Background -> Content-Script

/**
 * Event refresh settings message type.
 * @type {string}
 */
export const EVENT_REFRESH_SETTINGS = 'events.refresh-settings';
