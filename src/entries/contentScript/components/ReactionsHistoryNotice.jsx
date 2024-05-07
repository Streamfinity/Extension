/* eslint-disable react/no-array-index-key */
import React, { useMemo, Fragment } from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import Card from '~/entries/contentScript/components/Card';
import { useReactions } from '~/common/bridge';
import { reactionShape } from '~/shapes';
import ServiceIcon from '~/components/Icons/ServiceIcon';
import { useAppStore } from '~/entries/contentScript/state';
import useAuth from '~/hooks/useAuth';
import { hasSubscriptionFeature } from '~/entries/contentScript/hooks/useSubscription';
import { subscriptionIds, subscriptionFeatures } from '~/enums';
import PremiumCtaLabel from '~/entries/contentScript/components/PremiumCtaLabel';
import { buildReactionFromUrl } from '~/common/pretty';

function ReactionPreview({ reaction }) {
    const { t } = useTranslation();

    return (
        <div
            key={reaction.id}
            className="flex items-center gap-2"
        >
            {reaction.from_info?.service && (
                <ServiceIcon
                    service={reaction.from_info?.service}
                    size={12}
                    className="inline-block"
                />
            )}
            <a
                href={reaction.from_info?.service_external_url}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-primary-gradient-from"
            >
                {reaction.from_info?.display_name}
            </a>

            {' '}
            {moment(reaction.reaction_timestamp_start).fromNow()}
            {' '}

            {reaction.from_stream && (
                reaction.from_stream.vods.length > 0 ? (
                    reaction.from_stream.vods?.map((vod) => (
                        <Fragment key={vod.id}>
                            <a
                                href={vod.video.external_tracking_url_time.replace('{timestamp}', reaction.vod_seconds_from)}
                                target="_blank"
                                rel="noreferrer"
                                className="font-bold text-primary-gradient-from"
                            >
                                {t('reactionHistory.inAStream', { service: reaction.from_stream?.account?.service?.title })}
                            </a>
                        </Fragment>
                    ))
                ) : (
                    <a
                        href={buildReactionFromUrl(reaction)}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-primary-gradient-from"
                    >
                        {t('reactionHistory.inAStream', { service: reaction.from_stream?.account?.service?.title })}
                    </a>
                )
            )}

            {reaction.from_video && (
                <a
                    href={buildReactionFromUrl(reaction)}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-primary-gradient-from"
                >
                    {t('reactionHistory.inAVideo')}
                </a>
            )}
        </div>
    );
}

ReactionPreview.propTypes = {
    reaction: reactionShape.isRequired,
};

function ReactionsHistoryNotice() {
    const { t } = useTranslation();
    const currentUrl = useAppStore((state) => state.currentUrl);
    const compact = useAppStore((state) => state.isCompact);

    const { user, isOwnVideo } = useAuth();

    const isSubscribed = hasSubscriptionFeature(
        subscriptionFeatures.VIEWER_VIDEOS_HISTORY,
        null,
        user,
    );

    const { data: reactions } = useReactions({
        videoUrl: currentUrl,
        onlyFollowed: !isOwnVideo,
    });

    const videoReactions = useMemo(() => reactions?.filter((reaction) => !!reaction.from_video), [reactions]);
    const liveReactions = useMemo(() => reactions?.filter((reaction) => !!reaction.from_stream), [reactions]);

    const placeholders = useMemo(() => [
        { id: 0, sizeClassNames: ['w-20', 'w-16', 'w-8'] },
        { id: 1, sizeClassNames: ['w-16', 'w-20', 'w-12'] },
        { id: 2, sizeClassNames: ['w-24', 'w-14', 'w-14'] },
    ].filter((_, index) => (index + 1) >= reactions?.length), [reactions?.length]);

    if (!reactions || reactions?.length === 0) {
        if (!isSubscribed && !isOwnVideo) {
            return (
                <PremiumCtaLabel
                    plan={subscriptionIds.VIEWER}
                    campaign="reaction-history"
                    feature={subscriptionFeatures.VIEWER_VIDEOS_HISTORY}
                >
                    {t('reactionHistory.ctaViewer')}
                </PremiumCtaLabel>
            );
        }

        return null;
    }

    return (
        <Card
            title={isOwnVideo ? t('reactionHistory.titleOwn') : t('reactionHistory.title')}
            color="primary"
            compact={compact}
            preview={reactions?.length > 0 && t('reactionHistory.preview', { count: reactions.length })}
        >
            {(!isSubscribed) ? (
                <>
                    <div className="mb-3 select-none">
                        {placeholders.map((placeholder) => (
                            <div
                                key={placeholder.id}
                                className="flex items-center gap-2 text-sm text-white/60"
                            >
                                <div className="size-5 rounded-lg bg-white/30" />
                                <div className={`h-5 ${placeholder.sizeClassNames[0]} rounded-lg bg-white/30`} />
                                reacted in a
                                <div className={`h-5 ${placeholder.sizeClassNames[1]} rounded-lg bg-white/30`} />
                                for
                                <div className={`h-5 ${placeholder.sizeClassNames[2]} rounded-lg bg-white/30`} />
                            </div>
                        ))}
                    </div>
                    <PremiumCtaLabel
                        plan={isOwnVideo ? subscriptionIds.CREATOR : subscriptionIds.VIEWER}
                        campaign="reaction-history"
                        feature={isOwnVideo ? subscriptionFeatures.ANALYTICS_LIVE_FEED : subscriptionFeatures.VIEWER_VIDEOS_HISTORY}
                        className="!rounded-xl"
                    >
                        {isOwnVideo ? t('reactionHistory.ctaCreator') : t('reactionHistory.ctaViewer')}
                    </PremiumCtaLabel>
                </>
            ) : (
                <div className="flex flex-col gap-4 text-sm">
                    {liveReactions.length > 0 && (
                        <div>
                            <div className="mb-2 font-bold">
                                Live Reactions
                            </div>

                            {liveReactions.map((reaction) => (
                                <Fragment key={reaction.id}>
                                    <ReactionPreview reaction={reaction} />
                                </Fragment>
                            ))}
                        </div>
                    )}

                    {videoReactions.length > 0 && (
                        <div>
                            <div className="mb-2 font-bold">
                                {t('words.videoReactions')}
                            </div>

                            {videoReactions.map((reaction) => (
                                <Fragment key={reaction.id}>
                                    <ReactionPreview reaction={reaction} />
                                </Fragment>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
}

ReactionsHistoryNotice.propTypes = {};

ReactionsHistoryNotice.defaultProps = {};

export default ReactionsHistoryNotice;
