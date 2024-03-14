// Content-Script -> Background

export const GET_STATUS = 'status.get';
export const PLAYER_PROGRESS = 'player.progress';
export const LOGIN = 'auth.login';
export const LOGOUT = 'auth.logout';
export const SUGGESTIONS_SEARCH_ACCOUNT = 'suggestions.search-account';
export const SUGGESTIONS_SUBMIT = 'suggestions.submit';
export const WATCHED_REACTIONS_GET = 'watched-reactions.get';
export const REACTION_SUBMIT = 'reaction-suggestion.submit';
export const REACTION_POLICY_GET = 'reaction-policy.get';
export const REACTIONS_GET_FOR_VIDEO = 'reactions-for-video.get';
export const REACTIONS_GET_ORIGINAL_VIDEOS = 'original-videos-for-video.get';
export const CONTENT_RATINGS_GET = 'content-ratings.get';
export const VIDEO_ANALYTICS_GET = 'analytics.get';
export const SETTING_UPDATE_VISIBLE = 'settings.visible';
export const OPEN_POPUP = 'internal.open-popup';
export const SET_BROWSER_THEME = 'internal.theme';

// Background -> Content-Script

export const EVENT_REFRESH_AUTH = 'events.refresh-auth';
export const EVENT_REFRESH_SETTINGS = 'events.refresh-settings';
