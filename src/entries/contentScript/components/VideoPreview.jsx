import React from 'react';
import PropTypes from 'prop-types';
import { videoShape } from '~/shapes';
import { prettyDuration } from '~/common/pretty';

function VideoPreview({ video, children }) {
    return (
        <a
            href={video.external_tracking_url}
            target="_blank"
            className="flex gap-3"
            rel="noreferrer"
        >
            <div className="relative w-2/5 shrink-0 @md:w-1/3">
                <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="aspect-video rounded-lg object-cover"
                />

                {video.duration > 0 && (
                    <div className="absolute bottom-2 right-2 rounded-md bg-black/80 px-1 text-xs font-semibold text-white/80">
                        {prettyDuration(video.duration)}
                    </div>
                )}
            </div>
            <div className="flex flex-col justify-between gap-2">
                <div>
                    <div className="line-clamp-2 font-semibold leading-7 @md:text-lg">
                        {video.title}
                    </div>
                    {video.channel && (
                        <div className="mt-1 text-xs text-black/80 dark:text-white/70">
                            {video.channel.title}
                        </div>
                    )}
                </div>
                {children}
            </div>
        </a>
    );
}

VideoPreview.propTypes = {
    video: videoShape.isRequired,
    children: PropTypes.node,
};

VideoPreview.defaultProps = {
    children: null,
};

export default VideoPreview;
