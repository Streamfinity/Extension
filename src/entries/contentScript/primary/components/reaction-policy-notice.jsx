import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import { reactionPolicyEnum } from '~/enums';
import { findCurrentVideoPublishDate } from '~/common/utility';
import { childrenShape } from '~/shapes';
import useReactionPolicy from '~/hooks/useReactionPolicy';

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

function Notice({ title, description, className }) {
    return (
        <div className={classNames(
            className,
            'mt-4 p-4 rounded-xl border text-sm dark:text-white/60 text-gray-800 leading-normal',
        )}
        >
            <div className="mb-2 text-base font-semibold text-center">
                {title}
            </div>

            <div className="text-sm">
                {description}
            </div>
        </div>
    );
}

Notice.propTypes = {
    title: PropTypes.string.isRequired,
    description: childrenShape.isRequired,
    className: PropTypes.string,
};

Notice.defaultProps = {
    className: '',
};

function NoticeLine({
    title, status, countdown, maxPercentage,
}) {
    return (
        <div>
            <div className="font-semibold text-base">
                {title}
                {' '}
                Reactions
                {' '}
            </div>
            {status === STATUS_ALLOWED && (
                <div className="font-semibold text-green-500">
                    Reactions Allowed!
                </div>
            )}
            {status === STATUS_DENIED && (
                <div className="font-semibold text-red-500">
                    Not allowed
                </div>
            )}
            {status === STATUS_ON_COUNTDOWN && (
                <div className="font-semibold dark:text-orange-500 text-orange-800">
                    Reactions allowed in:
                    {' '}
                    <span>
                        {prettyFormatCountdown(countdown)}
                    </span>
                </div>
            )}
            {maxPercentage > 0 && (
                <div className="font-semibold dark:text-orange-500 text-orange-800">
                    Restrictions:
                    {' '}
                    You may only react to
                    {' '}
                    {maxPercentage}
                    % of this video.
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
};

NoticeLine.defaultProps = {
    countdown: null,
    maxPercentage: null,
};

function ReactionPolicyNotice() {
    const { policy, loading } = useReactionPolicy();

    const [liveCountdownDuration, setLiveCountdownDuration] = useState(null);
    const [videoCountdownDuration, setVideoCountdownDuration] = useState(null);

    useEffect(() => {
        const publishDate = findCurrentVideoPublishDate();

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
    }, []);

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

    if (loading) {
        return (
            <Notice
                className="bg-gray-300 dark:bg-neutral-700/30 border border-gray-400/30 dark:border-neutral-700"
                title="Loading..."
                description="asdasd"
            />
        );
    }

    if (!policy) {
        return (
            <Notice
                className="bg-gray-300 dark:bg-neutral-700/30 border border-gray-400/30 dark:border-neutral-700"
                title="No Reaction Policy"
                description="The content creator has not defined a reaction policy"
            />
        );
    }

    // eslint-disable-next-line default-case
    switch (status) {
    case STATUS_ALLOWED:
        return (
            <Notice
                className="text-center border-green-700 bg-green-700/30"
                title="Reactions Allowed"
                description="The content creator has approved live & video reactions"
            />
        );

    case STATUS_DENIED:
        return (
            <Notice
                className="text-center border-red-700 bg-red-700/30"
                title="Reactions Not Allowed"
                description="The content creator asks not to reaction on to video"
            />
        );
    }

    return (
        <Notice
            className="border-yellow-500/50 bg-yellow-700/10 dark:border-yellow-800/80 dark:bg-yellow-700/10 text-gray-900"
            title="Conditions Policy"
            description={(
                <div className="flex flex-col gap-4">
                    <p className="mb-2">
                        The content creator has set conditions for reactions.
                    </p>
                    <NoticeLine
                        title="Live"
                        status={liveStatus}
                        countdown={liveCountdownDuration}
                        maxPercentage={policy.live_max_percentage}
                    />
                    <NoticeLine
                        title="Video"
                        status={videoStatus}
                        countdown={videoCountdownDuration}
                        maxPercentage={policy.video_max_percentage}
                    />
                </div>
            )}
        />
    );
}

export default ReactionPolicyNotice;
