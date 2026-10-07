import { useEffect, useState } from 'react';
import { useAppStore } from '~/entries/contentScript/state';
import { getReactionCandidate } from '~/common/bridge';
import { getIdFromLink, retryFind } from '~/common/utility';
import { hasOtherVideoLink, scrapeVideo } from '~/common/reactionCandidate';
import { createLogger } from '~/common/log';

const log = createLogger('useReactionCandidate');

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

        (async () => {
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
        })();

        return () => {
            cancelled = true;
        };
    }, [currentUrl, enabled]);

    return candidate;
}
