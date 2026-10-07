import { useEffect, useState } from 'react';
import { useAppStore } from '~/entries/contentScript/state';
import { getReactionCandidate } from '~/common/bridge';
import { getIdFromLink, retryFind } from '~/common/utility';
import { hasOtherVideoLink, isYouTubeVideoUrl } from '~/common/reactionCandidate';
import { createLogger } from '~/common/log';

const log = createLogger('useReactionCandidate');

// YouTube renders links to other videos as chips showing the video title, so we put the url back in
function getDescriptionText(element) {
    const clone = element.cloneNode(true);

    clone.querySelectorAll('a').forEach((link) => {
        if (isYouTubeVideoUrl(link.href)) {
            link.replaceWith(link.href);
        }
    });

    return clone.textContent;
}

function scrapeVideo(videoId) {
    if (document.querySelector('ytd-watch-flexy')?.getAttribute('video-id') !== videoId) {
        return null;
    }

    const title = document.querySelector('ytd-watch-metadata #title h1')?.textContent?.trim();
    const description = document.querySelector('ytd-watch-metadata #description-inline-expander yt-attributed-string');

    if (!title || !description) {
        return null;
    }

    return {
        title,
        description: getDescriptionText(description),
    };
}

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
            const video = await retryFind(() => scrapeVideo(videoId), 1000, 15).catch(() => null);

            if (cancelled || !video || !hasOtherVideoLink(video.description, videoId)) {
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
