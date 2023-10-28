import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import { reactionPolicyEnum } from '~/enums';
import { findCurrentVideoPublishDate } from '~/common/utility';
import { childrenShape } from '~/shapes';

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
            'mt-4 py-2 px-4 rounded-xl border text-sm text-white/60 leading-normal',
        )}
        >
            <div className="mb-2 text-base font-semibold text-center">
                {title}
            </div>

            <p className="text-sm">
                {description}
            </p>
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
            <b className="font-semibold">
                {title}
                {' '}
                Reactions:
                {' '}
            </b>
            {status === STATUS_ALLOWED && (
                <span className="font-semibold text-green-500">
                    Allowed!
                </span>
            )}
            {status === STATUS_DENIED && (
                <span className="font-semibold text-red-500">
                    Not allowed
                </span>
            )}
            {status === STATUS_ON_COUNTDOWN && (
                <span className="font-semibold text-orange-500">
                    Please wait
                    {' '}
                    {prettyFormatCountdown(countdown)}
                    {' '}
                    before reacting.
                </span>
            )}
            {maxPercentage > 0 && (
                <span className="font-semibold text-orange-500">
                    {' '}
                    You may only react to
                    {' '}
                    {maxPercentage}
                    % of this video.
                </span>
            )}
        </div>
    );
}

NoticeLine.propTypes = {
    title: PropTypes.string.isRequired,
    status: PropTypes.number.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    countdown: PropTypes.object.isRequired,
    maxPercentage: PropTypes.number.isRequired,
};

function ReactionPolicyNotice({ policy }) {
    const [liveCountdownDuration, setLiveCountdownDuration] = useState(null);
    const [videoCountdownDuration, setVideoCountdownDuration] = useState(null);

    useEffect(() => {
        const publishDate = findCurrentVideoPublishDate();

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

    // eslint-disable-next-line default-case
    switch (status) {
    case STATUS_ALLOWED:
        return (
            <Notice
                className="text-center border-green-700 bg-green-700/30"
                description="The content creator has approved live & video reactions"
                title="Reactions Allowed"
            />
        );

    case STATUS_DENIED:
        return (
            <Notice
                className="text-center border-red-700 bg-red-700/30"
                description="The content creator asks not to reaction on to video"
                title="Reactions Not Allowed"
            />
        );
    }

    return (
        <Notice
            className="border-yellow-800/80 bg-yellow-700/10"
            description={(
                <div>
                    <p className="mb-2">
                        The content creator has set conditions for reactions:
                    </p>
                    <div>
                        <NoticeLine
                            title="Live"
                            status={liveStatus}
                            countdown={liveCountdownDuration}
                            maxPercentage={policy.live_max_percentage}
                        />
                    </div>
                    <div>
                        <NoticeLine
                            title="Video"
                            status={videoStatus}
                            countdown={videoCountdownDuration}
                            maxPercentage={policy.video_max_percentage}
                        />
                    </div>
                </div>
            )}
            title="Conditions"
        />
    );
}

ReactionPolicyNotice.propTypes = {
    policy: PropTypes.shape({
        id: PropTypes.string,
        policy: PropTypes.number,

        allow_live: PropTypes.bool,
        allow_video: PropTypes.bool,

        live_min_hours: PropTypes.number,
        video_min_hours: PropTypes.number,

        live_max_percentage: PropTypes.number,
        video_max_percentage: PropTypes.number,

        account_id: PropTypes.string,
        video_id: PropTypes.string,
        created_at: PropTypes.string,
        updated_at: PropTypes.string,
    }).isRequired,
};

ReactionPolicyNotice.defaultProps = {};

export default ReactionPolicyNotice;
