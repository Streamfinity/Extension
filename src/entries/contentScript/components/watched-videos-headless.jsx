import { useEffect } from 'react';
import { getIdFromLink } from '~/common/utility';
import { usePage } from '~/hooks/usePage';
import { getWatchedReactions } from '~/common/bridge';
import { createLogger } from '~/common/log';
import useAuth from '~/hooks/useAuth';

const log = createLogger('WatchedReactions');

function markElements(watchedVideos) {
    let countFound = 0;
    const mediaElements = document.querySelectorAll('ytd-rich-grid-media,ytd-playlist-video-renderer');

    mediaElements.forEach((mediaElement) => {
        const thumbnail = mediaElement.querySelector('ytd-thumbnail #thumbnail');
        if (!thumbnail) {
            return;
        }

        const id = getIdFromLink(thumbnail.href);
        if (!id) {
            return;
        }

        const watched = watchedVideos?.find((video) => video.service_video_id === id);
        if (!watched) {
            return;
        }

        // eslint-disable-next-line no-param-reassign
        mediaElement.style.transition = 'opacity 200ms';
        // eslint-disable-next-line no-param-reassign
        mediaElement.style.opacity = '40%';

        countFound += 1;
    });

    log.debug('find watched reaction elements', countFound);
}

function WatchedVideosHeadless() {
    const { currentUrl } = usePage();
    const { user } = useAuth();

    useEffect(() => {
        (async () => {
            if (!user) {
                return;
            }

            const watchedVideos = await getWatchedReactions({ userId: user.id });
            markElements(watchedVideos);
        })();
    }, [currentUrl, user]);

    return (
        null
    );
}

WatchedVideosHeadless.propTypes = {};

WatchedVideosHeadless.defaultProps = {};

export default WatchedVideosHeadless;
