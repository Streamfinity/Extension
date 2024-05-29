import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useOriginalVideos } from '~/common/bridge';
import Card from '~/entries/contentScript/components/Card';
import { reactionShape } from '~/shapes';
import { prettyDuration } from '~/common/pretty';
import { useAppStore } from '~/entries/contentScript/state';

/**
 * React component for displaying a preview of a reaction.
 * 
 * @param {Object} props - The props for the ReactionPreview component.
 * @param {Object} props.reaction - The reaction object containing information to display.
 * @param {Object} props.reaction.to_video - The video object to display.
 * @param {string} props.reaction.to_video.external_tracking_url - The external tracking URL of the video.
 * @param {string} props.reaction.to_video.thumbnail_url - The thumbnail URL of the video.
 * @param {string} props.reaction.to_video.title - The title of the video.
 * @param {Object} props.reaction.to_video.channel - The channel object of the video.
 * @param {string} props.reaction.to_video.channel.title - The title of the channel.
 * @param {number} props.reaction.video_seconds_from - The starting time of the reaction in seconds.
 * @param {number} props.reaction.video_seconds_to - The ending time of the reaction in seconds.
 * @param {number} props.reaction.interval_duration - The duration of the reaction interval in seconds.
 * 
 * @returns {JSX.Element} A React element representing the ReactionPreview component.
 */
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

/**
 * Function that renders a component to display original video reactions.
 * It fetches original video reactions based on the current URL and renders them inside a Card component.
 * If there are reactions to display, it shows them using ReactionPreview component.
 * @returns {JSX.Element | null} The rendered component or null if there are no reactions to display.
 */
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
                title={originalVideoReactions.length > 1 ? t('originalVideo.titlePlural') : t('originalVideo.title')}
                color="primary"
                compact={compact}
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
