/**
 * PropTypes for defining shapes of various data structures used in the application.
 */
import PropTypes from 'prop-types';

export const userShape = PropTypes.shape({
    id: PropTypes.string,
    display_name: PropTypes.string,
    avatar: PropTypes.shape({
        url: PropTypes.string,
    }),
});

export const accountShape = PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    display_name: PropTypes.string,
    service: PropTypes.shape({
        title: PropTypes.string,
    }),
    service_user_id: PropTypes.string,
    service_user_name: PropTypes.string,
    service_external_url: PropTypes.string,
    from_pivot: PropTypes.shape({
        type: PropTypes.oneOf(['team', 'account']),
    }),
    from_team: PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
    }),
    onboarding_completed: PropTypes.bool,
    onboarding_account_type: PropTypes.number,
});

export const videoShape = PropTypes.shape({
    id: PropTypes.string,
    external_url: PropTypes.string,
    external_tracking_url: PropTypes.string,
    thumbnail_url: PropTypes.string,
    title: PropTypes.string,
    service_video_id: PropTypes.string,
    channel: PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
        thumbnail_url: PropTypes.string,
        external_url: PropTypes.string,
        description: PropTypes.string,
    }),
    content_rating: PropTypes.shape({
        is_rated: PropTypes.bool,
        is_safe_rated: PropTypes.bool,
        is_unsafe_rated: PropTypes.bool,
    }),
});

export const streamShape = PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    account: accountShape,
});

export const vodShape = PropTypes.shape({
    id: PropTypes.string,
    created_at: PropTypes.string,
    updated_at: PropTypes.string,
    video: videoShape,
});

export const suggestionShape = PropTypes.shape({
    id: PropTypes.string,
    status: PropTypes.number,
    video: videoShape,
    timestamp: PropTypes.number,
    from_account: accountShape,
    to_account: accountShape,
    created_at: PropTypes.string,
    votes_up_count: PropTypes.number,
    votes_down_count: PropTypes.number,
    vote: PropTypes.shape({
        direction: PropTypes.number,
        user_id: PropTypes.string,
    }),
});

export const suggestionCampaignShape = PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    active: PropTypes.bool,
    created_at: PropTypes.string,
});

export const issueShape = PropTypes.shape({
    id: PropTypes.string,
    priority: PropTypes.string,
    dismissable: PropTypes.bool,
    title: PropTypes.string,
    description: PropTypes.string,
    actions: PropTypes.arrayOf(PropTypes.shape({
        url: PropTypes.string,
    })),
});

export const childrenShape = PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
]);

export const planShape = PropTypes.shape({
    id: PropTypes.string,
    price: PropTypes.arrayOf(PropTypes.shape({
        currency: PropTypes.string,
        currency_symbol: PropTypes.string,
        price: PropTypes.number,
        stripe_lookup_id: PropTypes.string,
    })),
    title: PropTypes.string,
    description: PropTypes.string,
    free: PropTypes.bool,
    perks: PropTypes.arrayOf(PropTypes.shape({
        feature: PropTypes.number,
        included: PropTypes.bool,
        value: PropTypes.number,
        display_value: PropTypes.string,
    })),
});

export const planFeatureShape = PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    category: PropTypes.string,
});

export const planDetailsShape = PropTypes.shape({
    plans: PropTypes.arrayOf(planShape),
    features: PropTypes.arrayOf(planFeatureShape),
});

export const subscriptionShape = PropTypes.shape({
    id: PropTypes.string,
    is_active: PropTypes.bool,
    plan: planShape,
    plan_price_currency: PropTypes.string,
    plan_price_amount: PropTypes.number,
    account: accountShape,
    stripe: PropTypes.shape({
        status: PropTypes.string,
        collection_method: PropTypes.string,
        created: PropTypes.string,
        canceled_at: PropTypes.string,
        ended_at: PropTypes.string,
        start_date: PropTypes.string,
        current_period_end: PropTypes.string,
        current_period_start: PropTypes.string,
    }),
});

export const reactionShape = PropTypes.shape({
    id: PropTypes.string,
    to_video: videoShape,
    from_info: PropTypes.shape({
        display_name: PropTypes.string,
        service_external_url: PropTypes.string,
        avatar_url: PropTypes.string,
    }),
    from_stream_id: PropTypes.string,
    from_stream: streamShape,
    from_video_id: PropTypes.string,
    from_video: videoShape,
    reaction_timestamp_start: PropTypes.string,
    reaction_timestamp_end: PropTypes.string,
    video_seconds_from: PropTypes.number,
    video_seconds_to: PropTypes.number,
    interval_duration: PropTypes.number,
    aggregated: PropTypes.shape({
        live_avg_views: PropTypes.number,
        sum_unique_views: PropTypes.number,
    }),
    created_at: PropTypes.string,
    updated_at: PropTypes.string,
});

export const styleShape = PropTypes.objectOf(PropTypes.string);

export const rgbShape = PropTypes.shape({
    r: PropTypes.number,
    g: PropTypes.number,
    b: PropTypes.number,
});

export const mediaInfoShape = PropTypes.shape({
    dominant_color: rgbShape,
});

export const reactionSubmissionShape = PropTypes.shape({
    from_video: videoShape,
    from: PropTypes.number,
    to_video: videoShape,
    user: userShape,
});

export const reactionPolicyShape = PropTypes.shape({
    id: PropTypes.string,
});

export const extensionStoreShape = PropTypes.shape({
    title: PropTypes.string,
    url: PropTypes.string,
    recommended: PropTypes.bool,
});

export const reactionPolicyPresetMediumShape = PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
});

export const reactionPolicyPresetOptionShape = PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    mediums: PropTypes.oneOfType([
        PropTypes.arrayOf(reactionPolicyPresetMediumShape),
        PropTypes.arrayOf(PropTypes.number),
    ]),
});

export const reactionPolicyPresetGroupShape = PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    options: PropTypes.arrayOf(reactionPolicyPresetOptionShape),
});

export const inviteShape = PropTypes.shape({
    id: PropTypes.string,
    code: PropTypes.string,
    created_at: PropTypes.string,
    for_account_service: PropTypes.number,
    for_account_service_user_id: PropTypes.string,
    permissions: PropTypes.arrayOf(PropTypes.string),
    updated_at: PropTypes.string,
    url: PropTypes.string,
    used_at: PropTypes.string,
});

export const cartItemShape = PropTypes.shape({
    id: PropTypes.string,
    account_id: PropTypes.string,
});

export const videoPreviewMetaWithoutProp = PropTypes.arrayOf(PropTypes.oneOf([
    'channel',
    'contentRating',
    'likes',
    'views',
]));
