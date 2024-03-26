import React, { useMemo, Fragment } from 'react';
import moment from 'moment';
import Card, { CardTitle } from '~/entries/contentScript/components/card';
import { useReactions } from '~/common/bridge';
import { reactionShape } from '~/shapes';
import ServiceIcon from '~/components/icons/service-icon';
import { useAppStore } from '~/entries/contentScript/state';
import useAuth from '~/hooks/useAuth';

function ReactionPreview({ reaction }) {
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
            <span className="font-bold text-primary-gradient-from">
                {reaction.from_info?.display_name}
            </span>

            {' '}
            {moment(reaction.reaction_timestamp_start).fromNow()}

            {reaction.from_stream && (
                <a
                    href={reaction.from_info?.service_external_url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-primary-gradient-from"
                >
                    {' '}
                    in a
                    {' '}
                    {reaction.from_stream?.account?.service?.title}
                    {' '}
                    livestream
                </a>
            )}

            {reaction.from_video && (
                <a
                    href={reaction.from_info?.service_external_url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-primary-gradient-from"
                >
                    {' '}
                    in a video
                </a>
            )}
        </div>
    );
}

ReactionPreview.propTypes = {
    reaction: reactionShape.isRequired,
};

function ReactionsHistoryNotice() {
    const currentUrl = useAppStore((state) => state.currentUrl);

    const { isOwnVideo } = useAuth();

    const { data: reactions } = useReactions({
        videoUrl: currentUrl,
        onlyFollowed: !isOwnVideo,
    });

    const videoReactions = useMemo(() => reactions?.filter((reaction) => !!reaction.from_video), [reactions]);
    const liveReactions = useMemo(() => reactions?.filter((reaction) => !!reaction.from_stream), [reactions]);

    if (!reactions || reactions?.length === 0) {
        return null;
    }

    return (
        <Card color="primary">
            <CardTitle>
                Reaction History
            </CardTitle>
            {isOwnVideo && (
                <p className="mb-4">
                    Those are all reactions to your video.
                </p>
            )}
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
                            Video Reactions
                        </div>

                        {videoReactions.map((reaction) => (
                            <Fragment key={reaction.id}>
                                <ReactionPreview reaction={reaction} />
                            </Fragment>
                        ))}
                    </div>
                )}
            </div>
        </Card>
    );
}

ReactionsHistoryNotice.propTypes = {};

ReactionsHistoryNotice.defaultProps = {};

export default ReactionsHistoryNotice;
