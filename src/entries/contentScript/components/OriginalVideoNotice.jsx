import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useOriginalVideos } from '~/common/bridge';
import Card from '~/entries/contentScript/components/Card';
import VideoPreview from '~/entries/contentScript/components/VideoPreview';
import { reactionShape } from '~/shapes';
import { prettyDuration } from '~/common/pretty';
import { useAppStore } from '~/entries/contentScript/state';

function ReactionPreview({ reaction }) {
    return (
        <VideoPreview video={reaction.to_video}>
            <div className="flex items-center text-xs font-semibold text-black">
                <div className="rounded-lg bg-primary-gradient-from px-2 py-px">
                    {reaction.video_seconds_from ? prettyDuration(reaction.video_seconds_from) : '00:00'}
                </div>
                <div className="h-2 w-4 bg-gradient-to-r from-primary-gradient-from to-primary-gradient-to" />
                <div className="rounded-lg bg-primary-gradient-to px-2 py-px">
                    {reaction.video_seconds_to ? prettyDuration(reaction.video_seconds_to) : prettyDuration(reaction.interval_duration)}
                </div>
            </div>
        </VideoPreview>
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
