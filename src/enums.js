/**
 * Constants for account services, reaction policy, subscription IDs, account types, and subscription features.
 */
export const accountServices = {
    TWITCH: 0,
    YOUTUBE: 1,
    UNKNOWN: 9999,
};

export const reactionPolicyEnum = {
    ALLOW: 0,
    DENY: 1,
    CONDITIONS: 2,
};

export const subscriptionIds = {
    CREATOR: 'creator-v1',
    STREAMER: 'streamer-v1',
    VIEWER: 'viewer-v1',
};

export const accountTypes = {
    STREAMER: 0b001,
    CREATOR: 0b010,
    VIEWER: 0b100,
};

export const subscriptionFeatures = {
    // Basics
    AD_FREE: 1,
    SUGGEST_VIDEOS: 18,
    SUGGEST_VIDEOS_BOOST: 11,
    NOTIFICATIONS: 2,
    STREAMS_VIDEOS_HISTORY: 0,
    VIEWER_VIDEOS_HISTORY: 19,
    COMMUNITY_NOTES: 20,

    // Premium
    AUTHORIZED_USERS: 21,
    EMBEDS: 4,
    ANALYTICS_STREAMS: 14,
    ANALYTICS_VIDEOS: 8,
    ANALYTICS_LIVE_FEED: 24,
    STEALTH_MODE: 22,
    CUSTOMIZE_PAGES: 23,
    REACTION_POLICY: 16,
    REACTION_POLICY_EXTENDED: 17,

    // Streamfinity Buddy
    EXT_LIVE_REACT_STATUS: 25,
    EXT_ANALYTICS: 26,
    EXT_MARK_REACTIONS: 27,
    EXT_ORIGINAL_CONTENT: 28,

    // Specials
    SUPPORT_DEVELOPMENT: 5,
};
