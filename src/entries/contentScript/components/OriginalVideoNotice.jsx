import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useOriginalVideos } from '~/common/bridge';
import Card from '~/entries/contentScript/components/Card';
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
            <div className="relative w-2/5 shrink-0">
                <img
                    src={reaction.to_video.thumbnail_url}
                    alt={reaction.to_video.title}
                    className="aspect-video rounded-lg object-cover"
                />

                {reaction.to_video.duration > 0 && (
                    <div className="absolute bottom-2 right-2 rounded-md bg-black/80 px-1 text-xs font-semibold text-white/80">
                        {prettyDuration(reaction.to_video.duration)}
                    </div>
                )}
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
                    <div className="rounded-lg bg-primary-gradient-from px-2 py-px">
                        {reaction.video_seconds_from ? prettyDuration(reaction.video_seconds_from) : '00:00'}
                    </div>
                    <div className="h-2 w-4 bg-gradient-to-r from-primary-gradient-from to-primary-gradient-to" />
                    <div className="rounded-lg bg-primary-gradient-to px-2 py-px">
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
    const { t } = useTranslation();
    const currentUrl = useAppStore((state) => state.currentUrl);
    const compact = useAppStore((state) => state.isCompact);

    const { data: originalVideoReactions } = useOriginalVideos({
        videoUrl: currentUrl,
    });

    if (originalVideoReactions?.length > 0) {
        return (
            <Card
                id="ov"
                title={originalVideoReactions.length > 1 ? t('originalVideo.titlePlural') : t('originalVideo.title')}
                color="primary"
                compact={compact}
                forceOpen
            >
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
