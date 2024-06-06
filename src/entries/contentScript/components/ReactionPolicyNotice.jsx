import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import { useShallow } from 'zustand/react/shallow';
import { useTranslation } from 'react-i18next';
import { reactionPolicyEnum } from '~/enums';
import { getCurrentVideoPublishDate, buildFrontendUrl } from '~/common/utility';
import { childrenShape } from '~/shapes';
import Card from '~/entries/contentScript/components/Card';
import { useReactionPolicyForVideo } from '~/common/bridge';
import { useAppStore } from '~/entries/contentScript/state';
import useAuth from '~/hooks/useAuth';
import cirWordmarkLight from '~/assets/cir/canireact_light.png';
import cirWordmarkDark from '~/assets/cir/canireact_dark.png';

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
    title,
    children,
    preview = null,
    isThirdParty = false,
    cardColor,
    note,
    className,
}) {
    const { t } = useTranslation();
    const { isOwnVideo } = useAuth();

    const compact = useAppStore((state) => state.isCompact);

    const cirWordmarkUrlLight = new URL(cirWordmarkLight, import.meta.url).href;
    const cirWordmarkUrlDark = new URL(cirWordmarkDark, import.meta.url).href;

    return (
        <Card
            id="rp"
            title={t('reactionPolicy.title')}
            color={cardColor}
            compact={compact}
            preview={preview}
            className={classNames(
                className,
                'text-sm leading-normal',
            )}
        >
            {title && (
                <div className="mb-2">
                    {title}
                </div>
            )}

            {note && (
                <div className="mb-3">
                    {note}
                </div>
            )}

            {children && (
                <div className="text-sm">
                    {children}
                </div>
            )}

            {isOwnVideo && (
                <div className="mt-3 text-xs font-medium">
                    <a
                        href={buildFrontendUrl('/dashboard/policy')}
                        target="_blank"
                        rel="noreferrer"
                        className="transition-opacity hover:opacity-75"
                    >
                        {t('reactionPolicy.edit')}
                    </a>
                </div>
            )}

            {isThirdParty && (
                <div className="mt-1 text-center text-xs">
                    {t('reactionPolicy.thirdPartyHint')}
                    <a
                        href="https://canireact.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            src={cirWordmarkUrlLight}
                            className="ml-2 inline h-8 dark:hidden"
                            alt="Can I React"
                        />
                        <img
                            src={cirWordmarkUrlDark}
                            className="ml-2 hidden h-8 dark:inline"
                            alt="Can I React"
                        />
                    </a>
                </div>
            )}

        </Card>
    );
}

Notice.propTypes = {
    title: PropTypes.string,
    children: childrenShape,
    preview: PropTypes.string,
    isThirdParty: PropTypes.bool,
    className: PropTypes.string,
    note: PropTypes.string,
    cardColor: PropTypes.string.isRequired,
};

Notice.defaultProps = {
    title: null,
    isThirdParty: false,
    className: '',
};

function NoticeLine({
    title,
    countdown,
    maxPercentage,
    minHours,
    allowValue,
    comment,
    options,
}) {
    const { t } = useTranslation();

    const textGreenClassNames = 'font-medium text-emerald-500';
    const textOrangeClassNames = 'font-medium text-orange-800 dark:text-orange-500';
    const textRedClassNames = 'font-medium text-red-500';

    const buttonClassNames = 'mr-2 size-3 rounded-full bg-gradient-to-tr shrink-0 mt-[0.5rem]';

    const buttonGreenClassNames = `${buttonClassNames} from-emerald-500 to-emerald-400 shadow shadow-emerald-700/20`;
    const buttonOrangeClassNames = `${buttonClassNames} from-orange-500 to-orange-400 shadow shadow-orange-700/20`;
    const buttonRedClassNames = `${buttonClassNames} from-red-500 to-red-400 shadow shadow-red-700/20`;

    if (allowValue === null && options.length === 0 && !maxPercentage && !minHours && !countdown && !comment) {
        return null;
    }

    return (
        <div>
            <div className="font-semibold">
                {title}
            </div>

            {options?.length > 0 && (
                <>
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className="flex items-start"
                        >
                            <div className={allowValue === true ? buttonGreenClassNames : buttonOrangeClassNames} />
                            <div className={allowValue === true ? textGreenClassNames : textOrangeClassNames}>
                                {option.title}
                            </div>
                        </div>
                    ))}
                </>
            )}

            {(allowValue === true && options?.length === 0) && (
                <div className="flex items-start">
                    <div className={buttonGreenClassNames} />
                    <div className={textGreenClassNames}>
                        {t('reactionPolicy.status.noRestriction')}
                    </div>
                </div>
            )}

            {allowValue === false && (
                <div className="flex items-start">
                    <div className={buttonRedClassNames} />
                    <div className={textRedClassNames}>
                        {t('reactionPolicy.status.notAllowed')}
                    </div>
                </div>
            )}

            {countdown && (
                <div className="flex items-start">
                    <div className={buttonRedClassNames} />
                    <div className={textRedClassNames}>
                        <span className="underline">
                            {t('reactionPolicy.status.allowedIn')}
                        </span>
                        {' '}
                        <span>
                            {prettyFormatCountdown(countdown)}
                        </span>
                    </div>
                </div>
            )}

            {maxPercentage > 0 && (
                <div className="flex items-start">
                    <div className={buttonOrangeClassNames} />
                    <div className={textOrangeClassNames}>
                        <span className="underline">
                            {t('reactionPolicy.status.notice')}
                        </span>
                        {' '}
                        {t('reactionPolicy.status.reactUpToPercentage', { value: maxPercentage })}
                    </div>
                </div>
            )}

            {comment && (
                <div className="flex items-start">
                    <div className={buttonOrangeClassNames} />
                    <div className={textOrangeClassNames}>
                        <span className="underline">
                            {t('reactionPolicy.status.notice')}
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
    // eslint-disable-next-line react/forbid-prop-types
    countdown: PropTypes.object,
    maxPercentage: PropTypes.number,
    minHours: PropTypes.number,
    allowValue: PropTypes.bool,
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
    const { t } = useTranslation();

    const { user } = useAuth();
    const [currentUrl, currentChannel] = useAppStore(
        useShallow((state) => [state.currentUrl, state.currentChannel]),
    );

    const { data: policy, isLoading } = useReactionPolicyForVideo({
        videoUrl: currentUrl,
        channelUrl: currentChannel.url,
        userId: user?.id || '',
    });

    const [liveCountdownDuration, setLiveCountdownDuration] = useState(null);
    const [videoCountdownDuration, setVideoCountdownDuration] = useState(null);

    useEffect(() => {
        const publishDate = getCurrentVideoPublishDate();

        if (!policy) {
            return () => {};
        }

        function refreshInterval() {
            const now = moment();

            if (policy.live_min_hours) {
                const liveAllowedAfter = moment(publishDate).add(policy.live_min_hours, 'hours');
                const liveDiff = liveAllowedAfter.diff(now);
                const liveDuration = moment.duration(liveDiff);

                setLiveCountdownDuration(
                    (liveDuration && liveDuration.asSeconds()) > 0 ? liveDuration : null,
                );
            }

            if (policy.video_min_hours) {
                const videoAllowedAfter = moment(publishDate).add(policy.video_min_hours, 'hours');
                const videoDiff = videoAllowedAfter.diff(now);
                const videoDuration = moment.duration(videoDiff);

                setVideoCountdownDuration(
                    (videoDuration && videoDuration.asSeconds()) > 0 ? videoDuration : null,
                );
            }
        }

        const interval = setInterval(() => {
            refreshInterval();
        }, 1000);

        refreshInterval();

        return () => clearInterval(interval);
    }, [policy]);

    const [cardColor, previewTitle] = useMemo(() => {
        if (!policy) {
            return ['green', t('reactionPolicy.previewNone')];
        }

        if (policy.policy === reactionPolicyEnum.DENY) {
            return ['red', t('reactionPolicy.previewNotAllowed')];
        }

        if (policy.policy === reactionPolicyEnum.ALLOW) {
            return ['green', t('reactionPolicy.previewAllowed')];
        }

        if (policy.policy === reactionPolicyEnum.CONDITIONS) {
            return ['yellow', t('reactionPolicy.previewConditions')];
        }

        return ['default', t('reactionPolicy.previewInfo')];
    }, [policy]);

    const { isOwnVideo } = useAuth();

    const isThirdParty = policy?.is_third_party || false;

    if (isLoading) {
        return (
            <Notice
                cardColor="default"
                title={t('words.loading')}
            />
        );
    }

    if (!policy) {
        return (
            <Notice
                cardColor={cardColor}
                preview={previewTitle}
                title={isOwnVideo ? t('reactionPolicy.notSetOwn') : t('reactionPolicy.notSet')}
            />
        );
    }

    return (
        <Notice
            cardColor={cardColor}
            preview={previewTitle}
            isThirdParty={isThirdParty}
            note={policy.note}
        >
            <div className="flex flex-col gap-4">
                <NoticeLine
                    title={t('words.liveReactions')}
                    countdown={liveCountdownDuration}
                    allowValue={policy.allow_live}
                    maxPercentage={policy.live_max_percentage}
                    minHours={policy.live_min_hours}
                    comment={policy.live_comment}
                    options={policy.live_options}
                />
                <NoticeLine
                    title={t('words.videoReactions')}
                    countdown={videoCountdownDuration}
                    allowValue={policy.allow_video}
                    maxPercentage={policy.video_max_percentage}
                    minHours={policy.video_min_hours}
                    comment={policy.video_comment}
                    options={policy.video_options}
                />
            </div>
        </Notice>
    );
}

export default ReactionPolicyNotice;
