import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import { PencilSquareIcon } from '@heroicons/react/16/solid';
import { reactionPolicyEnum } from '~/enums';
import { getCurrentVideoPublishDate, buildFrontendUrl } from '~/common/utility';
import { childrenShape } from '~/shapes';
import Card, { CardTitle } from '~/entries/contentScript/components/card';
import { useReactionPolicyForVideo } from '~/common/bridge';
import { useAppStore } from '~/entries/contentScript/state';
import useAuth from '~/hooks/useAuth';

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

    if (days === 0) {
        return `${hours}:${minutes}:${seconds}`;
    }

    return `${days}d ${hours}:${minutes}:${seconds}`;
}

function Notice({
    title, description, cardColor, className,
}) {
    const { isOwnVideo } = useAuth();

    return (
        <Card
            color={cardColor}
            className={classNames(
                className,
                'text-sm leading-normal',
            )}
        >
            <CardTitle>
                <div className="flex justify-between">
                    Reaction Policy
                    {isOwnVideo && (
                        <a
                            href={buildFrontendUrl('/dashboard/policy')}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:opacity-75"
                        >
                            <PencilSquareIcon className="size-8" />
                        </a>
                    )}
                </div>
            </CardTitle>

            {title && (
                <div className="mb-2">
                    {title}
                </div>
            )}

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
    title, status, countdown, maxPercentage, comment, options,
}) {
    return (
        <div>
            <div className="font-semibold">
                {title}
            </div>
            {(status === STATUS_CONDITION && options?.length > 0) && (
                <>
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className="flex items-center"
                        >
                            <div className="mr-2 size-4 rounded-full bg-gradient-to-tr from-orange-500 to-orange-400 shadow shadow-orange-700/20" />
                            <div className="font-medium text-orange-800 dark:text-orange-500">
                                {option.title}
                            </div>
                        </div>
                    ))}
                </>
            )}
            {status === STATUS_ALLOWED && (
                <div className="flex items-center">
                    <div className="mr-2 size-4 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-400 shadow shadow-emerald-700/20" />
                    <div className="font-medium text-emerald-500">
                        No Restriction
                    </div>
                </div>
            )}
            {status === STATUS_DENIED && (
                <div className="flex items-center">
                    <div className="mr-2 size-4 rounded-full bg-gradient-to-tr from-red-500 to-red-400 shadow shadow-red-700/20" />
                    <div className="font-medium text-red-500">
                        Not Allowed
                    </div>
                </div>
            )}
            {status === STATUS_ON_COUNTDOWN && (
                <div className="flex items-center">
                    <div className="mr-2 size-4 rounded-full bg-gradient-to-tr from-red-500 to-red-400 shadow shadow-red-700/20" />
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
                    <div className="mr-2 size-4 rounded-full bg-gradient-to-tr from-orange-500 to-orange-400 shadow shadow-orange-700/20" />
                    <div className="font-medium">
                        <span className="text-orange-800 dark:text-orange-500">
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
                    <div className="mr-2 size-4 rounded-full bg-gradient-to-tr from-orange-500 to-orange-400 shadow shadow-orange-700/20" />
                    <div className="font-medium">
                        <span className="text-orange-800 dark:text-orange-500">
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
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.number,
        title: PropTypes.string,
    })),
};

NoticeLine.defaultProps = {
    countdown: null,
    maxPercentage: null,
    comment: null,
    options: null,
};

function ReactionPolicyNotice() {
    const { currentUrl, currentChannel } = useAppStore();

    const { data: policy, isLoading } = useReactionPolicyForVideo({
        videoUrl: currentUrl,
        channelUrl: currentChannel.url,
    });

    const [liveCountdownDuration, setLiveCountdownDuration] = useState(null);
    const [videoCountdownDuration, setVideoCountdownDuration] = useState(null);

    useEffect(() => {
        const publishDate = getCurrentVideoPublishDate();

        if (!policy) {
            return () => {};
        }

        function refreshInterval() {
            const liveAllowedAfter = moment(publishDate).add(policy.live_min_hours, 'hours');
            const videoAllowedAfter = moment(publishDate).add(policy.video_min_hours, 'hours');
            const now = moment();

            const liveDiff = liveAllowedAfter.diff(now);
            const videoDiff = videoAllowedAfter.diff(now);

            const liveDuration = moment.duration(liveDiff);
            const videoDuration = moment.duration(videoDiff);

            setLiveCountdownDuration(liveDuration);
            setVideoCountdownDuration(videoDuration);
        }

        const interval = setInterval(() => {
            refreshInterval();
        }, 1000);

        refreshInterval();

        return () => clearInterval(interval);
    }, [policy]);

    const videoStatus = useMemo(() => {
        if (!policy) {
            return null;
        }

        if (!policy.allow_video) {
            return STATUS_DENIED;
        }

        if (policy.video_min_hours > 0 && videoCountdownDuration && videoCountdownDuration.asSeconds() > 0) {
            return STATUS_ON_COUNTDOWN;
        }

        if (policy.video_max_percentage > 0) {
            return STATUS_OTHER_CONDITION;
        }

        if (policy.video_preset_group !== null || policy.computed.video_options.length > 0) {
            return STATUS_CONDITION;
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

        if (policy.live_min_hours > 0 && liveCountdownDuration && liveCountdownDuration.asSeconds() > 0) {
            return STATUS_ON_COUNTDOWN;
        }

        if (policy.live_max_percentage > 0) {
            return STATUS_OTHER_CONDITION;
        }

        if (policy.live_preset_group !== null || policy.computed.live_options.length > 0) {
            return STATUS_CONDITION;
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
            // Allow if "custom" but video & live allowed with no set conditions
            if ((liveStatus === STATUS_ALLOWED && policy.live_preset_group === null) && (videoStatus === STATUS_ALLOWED && policy.video_preset_group === null)) {
                return STATUS_ALLOWED;
            }

            return STATUS_CONDITION;
        }

        return STATUS_DENIED;
    }, [policy, liveStatus, videoStatus]);

    const { isOwnVideo } = useAuth();

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
                cardColor="green"
                title={`${isOwnVideo ? 'You have' : 'The Content Creator has'} not set conditions for reactions.`}
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
                        options={policy.computed.live_options}
                    />
                    <NoticeLine
                        title="Video Reactions"
                        status={videoStatus}
                        countdown={videoCountdownDuration}
                        maxPercentage={policy.video_max_percentage}
                        comment={policy.comment}
                        options={policy.computed.video_options}
                    />
                </div>
            )}
        />
    );
}

export default ReactionPolicyNotice;
