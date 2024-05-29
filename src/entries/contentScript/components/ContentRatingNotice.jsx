import React, { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import {
    findVideoPlayerBar, retryFind, getYouTubePlayer, getYouTubePlayerProgressBar,
} from '~/common/utility';
import { createLogger } from '~/common/log';
import Card from '~/entries/contentScript/components/Card';
import { useContentRatings } from '~/common/bridge';
import { prettyDuration } from '~/common/pretty';
import styles from '~/styles/content-rating.module.css';
import { useYouTubePlayer } from '~/hooks/useYouTubePlayer';
import { useAppStore } from '~/entries/contentScript/state';

const log = createLogger('Content-Rating');

/**
 * Function component for displaying content rating notice.
 * - Fetches current URL and compact state from app store.
 * - Retrieves player progress using useYouTubePlayer hook.
 * - Displays content rating segments in the player based on received segments.
 * - Uses useContentRatings hook to fetch content ratings for the current video.
 * - Computes content ratings based on player progress and received segments.
 * - Finds and sets the player progress bar element.
 * - Listens for content rating results and mounts them in the player.
 * - Renders a Card component with content rating information.
 */
function ContentRatingNotice() {
    const currentUrl = useAppStore((state) => state.currentUrl);
    const compact = useAppStore((state) => state.isCompact);

    const { progress: playerProgress } = useYouTubePlayer();

    const [playerBarElement, setPlayerBarElement] = useState(null);
    const [initialized, setInitialized] = useState(false);

    async function displayContentRatingSegmentsInPlayer(segments) {
        if (initialized) {
            return;
        }

        log.debug('spitting into player', segments);

        setInitialized(true);

        const player = await retryFind(() => getYouTubePlayer());
        const progressBar = await retryFind(() => getYouTubePlayerProgressBar());

        const videoDurationSeconds = player.duration;

        segments.forEach((segment) => {
            const segmentDuration = segment.to - segment.from;
            const id = `content-rating-${segment.from}-${segment.to}-${segment.type}`;

            if (progressBar.querySelector(id)) {
                return;
            }

            const foo = document.createElement('div');
            foo.id = id;
            foo.style.position = 'absolute';
            foo.style.width = `${(segmentDuration / videoDurationSeconds) * 100}%`;
            foo.style.height = '100%';
            foo.style.left = `${(segment.from / videoDurationSeconds) * 100}%`;
            foo.style.top = '0px';
            foo.style.zIndex = '60';
            foo.style.backgroundColor = 'rgba(37, 99, 235, 0.5)';

            log.debug('segment inserted', { segmentDuration, videoDurationSeconds }, foo);
            progressBar.append(foo);
        });

        log.debug('appended segments');
    }

    // API

    const { data: contentRatings } = useContentRatings({ videoUrl: currentUrl });

    const computedContentRatings = useMemo(() => contentRatings?.map((segment) => {
        if (!playerProgress) {
            return segment;
        }

        return {
            ...segment,
            alert: playerProgress <= segment.from && playerProgress >= (segment.from - 10),
        };
    }), [contentRatings, playerProgress]);

    // Find player bar

    useEffect(() => {
        let clear = null;

        async function find() {
            if (playerBarElement) {
                return;
            }

            const [findElement, clearFunction] = findVideoPlayerBar();
            clear = clearFunction;
            const el = await findElement();

            log.debug('found progress bar', el);
            setPlayerBarElement(el);
        }

        find();

        return () => clear();
    }, []);

    // Listen for content rating results and mount in player

    useEffect(() => {
        if (!contentRatings?.length || !playerBarElement) {
            return;
        }

        displayContentRatingSegmentsInPlayer(contentRatings, playerBarElement);
    }, [contentRatings, playerBarElement]);

    if (!contentRatings || contentRatings.length === 0) {
        return (<div />);
    }

    return (
        <Card
            title="Content Rating"
            compact={compact}
        >
            <div className="flex flex-col gap-1 text-sm">
                {computedContentRatings?.map((rating) => (
                    <div
                        key={`${rating.from}-${rating.to}-${rating.type}`}
                        className={classNames(
                            rating.alert ? styles.contentRatingAlert : 'hover:bg-gray-600/10 border-transparent',
                            'flex justify-between transition-colors rounded-lg py-1 px-2 border',
                        )}
                    >
                        <div>
                            <span className="pr-2 font-bold">
                                {prettyDuration(rating.from)}
                                {' - '}
                                {prettyDuration(rating.to)}
                            </span>
                            {rating.type_title}
                        </div>
                        <div className="flex gap-3">
                            <div className="font-bold uppercase text-green-500">Confirm</div>
                            <div className="font-bold uppercase text-red-500">Wrong</div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

ContentRatingNotice.propTypes = {

};

ContentRatingNotice.defaultProps = {};

export default ContentRatingNotice;
