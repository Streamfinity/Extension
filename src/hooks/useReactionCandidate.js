import { useEffect, useState } from 'react';
import { useAppStore } from '~/entries/contentScript/state';
import { getReactionCandidate } from '~/common/bridge';
import { getIdFromLink, getYouTubePlayer, retryFind } from '~/common/utility';
import { hasOtherVideoLink, scrapeVideo } from '~/common/reactionCandidate';
import { createLogger } from '~/common/log';

const log = createLogger('useReactionCandidate');

const MIN_WATCH_SECONDS = 30;

export function useReactionCandidate({ enabled }) {
    const currentUrl = useAppStore((state) => state.currentUrl);
    const [candidate, setCandidate] = useState(null);

    useEffect(() => {
        setCandidate(null);

        const videoId = currentUrl && getIdFromLink(currentUrl);

        if (!enabled || !videoId) {
            return () => {};
        }

        let cancelled = false;

        async function detect() {
            const video = await retryFind(() => scrapeVideo(document, videoId), 1000, 15).catch(() => null);

            if (cancelled) {
                return;
            }

            if (!video) {
                log.debug('video details not found on page', videoId);
                return;
            }

            if (!hasOtherVideoLink(video.description, videoId)) {
                log.debug('no link to other video in description', videoId);
                return;
            }

            try {
                const result = await getReactionCandidate({ video_id: videoId, ...video });

                if (!cancelled) {
                    setCandidate(result);
                }
            } catch (err) {
                log.debug('reaction candidate request failed', err);
            }
        }

        // The <video> element is reused between videos, so we count played seconds ourselves.
        // Seeks (jumps > 3s) and ads are not counted.

        let watchedSeconds = 0;
        let lastTime = null;

        const watchInterval = setInterval(() => {
            const player = getYouTubePlayer();
            const time = player?.currentTime ?? null;
            const isAdShowing = !!document.querySelector('#movie_player.ad-showing');

            if (player && !player.paused && !isAdShowing && lastTime !== null && time > lastTime && time - lastTime < 3) {
                watchedSeconds += time - lastTime;
            }

            lastTime = time;

            if (watchedSeconds >= MIN_WATCH_SECONDS) {
                clearInterval(watchInterval);
                detect();
            }
        }, 1000);

        return () => {
            cancelled = true;
            clearInterval(watchInterval);
        };
    }, [currentUrl, enabled]);

    return candidate;
}
