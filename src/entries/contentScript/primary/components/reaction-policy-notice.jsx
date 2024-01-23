import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import { reactionPolicyEnum } from '~/enums';
import { getCurrentVideoPublishDate, getCurrentVideoChannel } from '~/common/utility';
import { childrenShape } from '~/shapes';
import Card from '~/entries/contentScript/primary/components/card';
import { useReactionPolicyForVideo } from '~/common/bridge';
import { usePage } from '~/hooks/usePage';

const STATUS_ALLOWED = 0;
const STATUS_DENIED = 1;
const STATUS_CONDITION = 2;

const STATUS_ON_COUNTDOWN = 3;
const STATUS_OTHER_CONDITION = 4;

function prettyFormatCountdown(diff) {
    const duration = moment.duration(diff);

    const days = duration.days();
    const hours = String(duration.hours()).padStart(2, '0');
    const minutes = String(duration.minutes()).padStart(2, '0');
    const seconds = String(duration.seconds()).padStart(2, '0');

    return `${days}d ${hours}:${minutes}:${seconds}`;
}

function Notice({
    title, description, cardColor, className,
}) {
    return (
        <Card
            color={cardColor}
            className={classNames(
                className,
                'text-sm dark:text-white/60 text-gray-800 leading-normal flex flex-col gap-3',
            )}
        >
            <div>
                {title || 'The Content Creator has set conditions for reactions.'}
            </div>

            {description && (
                <div className="text-sm">
                    {description}
                </div>
            )}
        </Card>
    );
}

Notice.propTypes = {
    title: PropTypes.string,
    description: childrenShape,
    className: PropTypes.string,
    cardColor: PropTypes.string.isRequired,
};

Notice.defaultProps = {
    title: null,
    description: null,
    className: '',
};

function NoticeLine({
    title, status, countdown, maxPercentage, comment,
}) {
    return (
        <div>
            <div className="font-semibold">
                {title}
            </div>
            {status === STATUS_ALLOWED && (
                <div className="flex items-center">
                    <div className="w-4 h-4 mr-2 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-400 shadow shadow-emerald-700/20" />
                    <div className="text-emerald-500 font-medium">
                        No Restriction
                    </div>
                </div>
            )}
            {status === STATUS_DENIED && (
                <div className="flex items-center">
                    <div className="w-4 h-4 mr-2 rounded-full bg-gradient-to-tr from-red-500 to-red-400 shadow shadow-red-700/20" />
                    <div className="text-red-500 font-medium">
                        Not Allowed
                    </div>
                </div>
            )}
            {status === STATUS_ON_COUNTDOWN && (
                <div className="flex items-center">
                    <div className="w-4 h-4 mr-2 rounded-full bg-gradient-to-tr from-red-500 to-red-400 shadow shadow-red-700/20" />
                    <div className="font-medium">
                        <span className="text-red-500">
                            Reactions allowed in:
                        </span>
                        {' '}
                        <span>
                            {prettyFormatCountdown(countdown)}
                        </span>
                    </div>
                </div>
            )}
            {maxPercentage > 0 && (
                <div className="flex items-center">
                    <div className="w-4 h-4 mr-2 rounded-full bg-gradient-to-tr from-orange-500 to-orange-400 shadow shadow-orange-700/20" />
                    <div className="font-medium">
                        <span className="dark:text-orange-500 text-orange-800">
                            Notice:
                        </span>
                        {' '}
                        You may only react to
                        {' '}
                        {maxPercentage}
                        % of this video.
                    </div>
                </div>
            )}

            {comment && (
                <div className="flex items-center">
                    <div className="w-4 h-4 mr-2 rounded-full bg-gradient-to-tr from-orange-500 to-orange-400 shadow shadow-orange-700/20" />
                    <div className="font-medium">
                        <span className="dark:text-orange-500 text-orange-800">
                            Notice:
                        </span>
                        {' '}
                        {comment}
                    </div>
                </div>
            )}
        </div>
    );
}

NoticeLine.propTypes = {
    title: PropTypes.string.isRequired,
    status: PropTypes.number.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    countdown: PropTypes.object,
    maxPercentage: PropTypes.number,
    comment: PropTypes.string,
};

NoticeLine.defaultProps = {
    countdown: null,
    maxPercentage: null,
    comment: null,
};

function ReactionPolicyNotice() {
    const { currentUrl } = usePage();

    const { data: policy, isLoading } = useReactionPolicyForVideo({
        videoUrl: currentUrl,
        channelUrl: getCurrentVideoChannel(),
    });

    const [liveCountdownDuration, setLiveCountdownDuration] = useState(null);
    const [videoCountdownDuration, setVideoCountdownDuration] = useState(null);

    useEffect(() => {
        const publishDate = getCurrentVideoPublishDate();

        if (!policy) {
            return () => {};
        }

        const interval = setInterval(() => {
            const liveAllowedAfter = moment(publishDate).add(policy.live_min_hours, 'hours');
            const videoAllowedAfter = moment(publishDate).add(policy.video_min_hours, 'hours');
            const now = moment();

            const liveDiff = liveAllowedAfter.diff(now);
            const videoDiff = videoAllowedAfter.diff(now);

            const liveDuration = moment.duration(liveDiff);
            const videoDuration = moment.duration(videoDiff);

            setLiveCountdownDuration(liveDuration);
            setVideoCountdownDuration(videoDuration);
        }, 1000);

        return () => clearInterval(interval);
    }, [policy]);

    const videoStatus = useMemo(() => {
        if (!policy) {
            return null;
        }

        if (!policy.allow_video) {
            return STATUS_DENIED;
        }

        if (policy.video_min_hours > 0) {
            if (videoCountdownDuration && videoCountdownDuration.asSeconds() < 0) {
                return STATUS_ALLOWED;
            }

            return STATUS_ON_COUNTDOWN;
        }

        if (policy.video_max_percentage > 0) {
            return STATUS_OTHER_CONDITION;
        }

        return STATUS_ALLOWED;
    }, [policy, videoCountdownDuration]);

    const liveStatus = useMemo(() => {
        if (!policy) {
            return null;
        }

        if (!policy.allow_live) {
            return STATUS_DENIED;
        }

        if (policy.live_min_hours > 0) {
            if (liveCountdownDuration && liveCountdownDuration.asSeconds() < 0) {
                return STATUS_ALLOWED;
            }

            return STATUS_ON_COUNTDOWN;
        }

        if (policy.live_max_percentage > 0) {
            return STATUS_OTHER_CONDITION;
        }

        return STATUS_ALLOWED;
    }, [policy, liveCountdownDuration]);

    const status = useMemo(() => {
        if (!policy) {
            return null;
        }

        if (policy.policy === reactionPolicyEnum.ALLOW) {
            return STATUS_ALLOWED;
        }

        if (policy.policy === reactionPolicyEnum.DENY || (policy.policy === reactionPolicyEnum.CONDITIONS && !policy.allow_video && !policy.allow_live)) {
            return STATUS_DENIED;
        }

        if (policy.policy === reactionPolicyEnum.CONDITIONS) {
            if (liveStatus === STATUS_ALLOWED && videoStatus === STATUS_ALLOWED) {
                return STATUS_ALLOWED;
            }

            return STATUS_CONDITION;
        }

        return STATUS_DENIED;
    }, [policy, liveStatus, videoStatus]);

    if (isLoading) {
        return (
            <Notice
                cardColor="default"
                title="Loading..."
            />
        );
    }

    if (!policy) {
        return (
            <Notice
                cardColor="default"
                title="The Content Creator has not set conditions for reactions."
            />
        );
    }

    // eslint-disable-next-line default-case
    switch (status) {
    case STATUS_ALLOWED:
        return (
            <Notice
                cardColor="green"
                description={(
                    <div className="flex flex-col gap-4">
                        <NoticeLine
                            title="Live Reactions"
                            status={STATUS_ALLOWED}
                        />
                        <NoticeLine
                            title="Video Reactions"
                            status={STATUS_ALLOWED}
                        />
                    </div>
                )}
            />
        );

    case STATUS_DENIED:
        return (
            <Notice
                cardColor="red"
                description={(
                    <div className="flex flex-col gap-4">
                        <NoticeLine
                            title="Live Reactions"
                            status={STATUS_DENIED}
                        />
                        <NoticeLine
                            title="Video Reactions"
                            status={STATUS_DENIED}
                        />
                    </div>
                )}
            />
        );
    }

    return (
        <Notice
            cardColor="yellow"
            description={(
                <div className="flex flex-col gap-4">
                    <NoticeLine
                        title="Live Reactions"
                        status={liveStatus}
                        countdown={liveCountdownDuration}
                        maxPercentage={policy.live_max_percentage}
                        comment={policy.comment}
                    />
                    <NoticeLine
                        title="Video Reactions"
                        status={videoStatus}
                        countdown={videoCountdownDuration}
                        maxPercentage={policy.video_max_percentage}
                        comment={policy.comment}
                    />
                </div>
            )}
        />
    );
}

export default ReactionPolicyNotice;
