/* eslint-disable react/no-array-index-key */
import React, { useMemo, Fragment } from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import Card, { CardTitle } from '~/entries/contentScript/components/Card';
import { useReactions } from '~/common/bridge';
import { reactionShape } from '~/shapes';
import ServiceIcon from '~/components/Icons/ServiceIcon';
import { useAppStore } from '~/entries/contentScript/state';
import useAuth from '~/hooks/useAuth';
import { hasSubscription } from '~/entries/contentScript/hooks/useSubscription';
import {
    subscriptionIds, subscriptionFeatures, accountServices,
} from '~/enums';
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
                <a
                    href={buildReactionFromUrl(reaction)}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-primary-gradient-from"
                >
                    {t('reactionHistory.inAStream', { service: reaction.from_stream?.account?.service?.title })}
                </a>
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

    const { user, isOwnVideo } = useAuth();
    const subscribedCreater = hasSubscription(user, subscriptionIds.CREATOR);
    const subscribedViewer = hasSubscription(user, subscriptionIds.VIEWER);

    const { data: reactions } = useReactions({
        videoUrl: currentUrl,
        onlyFollowed: !isOwnVideo,
    });

    const videoReactions = useMemo(() => reactions?.filter((reaction) => !!reaction.from_video), [reactions]);
    const liveReactions = useMemo(() => reactions?.filter((reaction) => !!reaction.from_stream), [reactions]);

    if (!reactions || reactions?.length === 0) {
        if (!subscribedViewer && !isOwnVideo) {
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
        <Card color="primary">
            <CardTitle>
                {isOwnVideo ? t('reactionHistory.titleOwn') : t('reactionHistory.title')}
            </CardTitle>

            {((isOwnVideo && !subscribedCreater) || (!isOwnVideo && !subscribedViewer)) ? (
                <>
                    <div className="select-none">
                        {new Array(3).fill(null).map((_, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 text-sm blur"
                            >
                                <ServiceIcon
                                    service={{ id: accountServices.TWITCH, title: 'Twitch' }}
                                    size={12}
                                    className="inline-block"
                                />
                                {['Foobar reacted in a livestream for 1h', 'Someone reacted in a twitch livestream', 'A famous streamer reacted in a video'][index]}
                            </div>
                        ))}
                    </div>
                    <PremiumCtaLabel
                        plan={isOwnVideo ? subscriptionIds.CREATOR : subscriptionIds.VIEWER}
                        campaign="reaction-history"
                        feature={isOwnVideo ? subscriptionFeatures.ANALYTICS_LIVE_FEED : subscriptionFeatures.VIEWER_VIDEOS_HISTORY}
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
