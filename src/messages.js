/**
 * Constants for communication between Content-Script and Background in a browser extension.
 * Includes actions like getting status, player progress, login/logout, submitting suggestions, etc.
 */

// Content-Script -> Background

export const GET_STATUS = 'GET_STATUS';
export const PLAYER_PROGRESS = 'PLAYER_PROGRESS';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const SUGGESTIONS_SEARCH_ACCOUNT = 'SUGGESTIONS_SEARCH_ACCOUNT';
export const SUGGESTIONS_SUBMIT = 'SUGGESTIONS_SUBMIT';
export const WATCHED_REACTIONS_GET = 'WATCHED_REACTIONS_GET';
export const REACTION_SUBMIT = 'REACTION_SUBMIT';
export const REACTION_POLICY_GET = 'REACTION_POLICY_GET';
export const REACTIONS_GET_FOR_VIDEO = 'REACTIONS_GET_FOR_VIDEO';
export const REACTIONS_GET_ORIGINAL_VIDEOS = 'REACTIONS_GET_ORIGINAL_VIDEOS';
export const CONTENT_RATINGS_GET = 'CONTENT_RATINGS_GET';
export const VIDEO_ANALYTICS_GET = 'VIDEO_ANALYTICS_GET';
export const COMMUNITY_NOTES_GET = 'COMMUNITY_NOTES_GET';
export const SETTING_UPDATE_VISIBLE = 'SETTING_UPDATE_VISIBLE';
export const OPEN_POPUP = 'OPEN_POPUP';
export const SET_BROWSER_THEME = 'SET_BROWSER_THEME';
export const TOGGLE_INCOGNITO_MODE = 'TOGGLE_INCOGNITO_MODE';

// Background -> Content-Script

export const EVENT_NOTICE = 'EVENT_NOTICE';
export const EVENT_REFRESH_AUTH = 'EVENT_REFRESH_AUTH';
export const EVENT_REFRESH_SETTINGS = 'EVENT_REFRESH_SETTINGS';
