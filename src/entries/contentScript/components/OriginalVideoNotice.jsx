import React, { Fragment } from 'react';
import { useOriginalVideos } from '~/common/bridge';
import Card, { CardTitle } from '~/entries/contentScript/components/Card';
import { reactionShape } from '~/shapes';
import { prettyDuration } from '~/common/pretty';
import { useAppStore } from '~/entries/contentScript/state';

function ReactionPreview({ reaction }) {
    return (
        <a
            href={reaction.to_video.external_tracking_url}
            target="_blank"
            className="flex gap-3"
            rel="noreferrer"
        >
            <div className="w-2/5 shrink-0">
                <img
                    src={reaction.to_video.thumbnail_url}
                    alt={reaction.to_video.title}
                    className="aspect-video rounded-lg object-cover"
                />
            </div>
            <div className="flex flex-col justify-between gap-2">
                <div>
                    <div className="line-clamp-2 font-semibold leading-7">
                        {reaction.to_video.title}
                    </div>
                    {reaction.to_video.channel && (
                        <div className="mt-1 text-xs text-black/80 dark:text-white/70">
                            {reaction.to_video.channel.title}
                        </div>
                    )}
                </div>
                <div className="flex items-center text-xs font-semibold text-black">
                    <div className="rounded-lg bg-primary-gradient-from px-2 py-[1px]">
                        {reaction.video_seconds_from ? prettyDuration(reaction.video_seconds_from) : '00:00'}
                    </div>
                    <div className="h-2 w-4 bg-gradient-to-r from-primary-gradient-from to-primary-gradient-to" />
                    <div className="rounded-lg bg-primary-gradient-to px-2 py-[1px]">
                        {reaction.video_seconds_to ? prettyDuration(reaction.video_seconds_to) : prettyDuration(reaction.interval_duration)}
                    </div>
                </div>
            </div>
        </a>
    );
}

ReactionPreview.propTypes = {
    reaction: reactionShape.isRequired,
};

function OriginalVideoNotice() {
    const currentUrl = useAppStore((state) => state.currentUrl);

    const { data: originalVideoReactions } = useOriginalVideos({
        videoUrl: currentUrl,
    });

    if (originalVideoReactions?.length > 0) {
        return (
            <Card color="primary">
                <CardTitle>
                    Original Video
                    {originalVideoReactions.length > 1 ? 's' : ''}
                </CardTitle>

                <div className="mt-3 flex flex-col gap-4">
                    {originalVideoReactions.map((reaction) => (
                        <Fragment key={reaction.id}>
                            <ReactionPreview reaction={reaction} />
                        </Fragment>
                    ))}
                </div>
            </Card>
        );
    }

    return null;
}

OriginalVideoNotice.propTypes = {};

OriginalVideoNotice.defaultProps = {};

export default OriginalVideoNotice;
