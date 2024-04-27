import { useEffect } from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { getIdFromLink } from '~/common/utility';
import { getWatchedReactions } from '~/common/bridge';
import { createLogger } from '~/common/log';
import useAuth from '~/hooks/useAuth';
import { useAppStore } from '~/entries/contentScript/state';

const log = createLogger('WatchedReactions');

function markElements(watchedVideos, t) {
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

        const fadeOutElements = [
            mediaElement.querySelector('ytd-thumbnail'),
            mediaElement.querySelector('#details'),
        ];

        fadeOutElements.filter((e) => !!e).forEach((element) => {
            // eslint-disable-next-line no-param-reassign
            element.style.transition = 'opacity 200ms';
            // eslint-disable-next-line no-param-reassign
            element.style.opacity = '40%';
        });

        const badgeParent = mediaElement.querySelector('#thumbnail');

        if (badgeParent && !mediaElement.querySelector('.streamfinity-watched-badge')) {
            const infoBadge = document.createElement('div');
            infoBadge.classList.add('streamfinity-watched-badge');
            infoBadge.style.padding = '.4rem .6rem';
            infoBadge.style.backgroundColor = 'red';
            infoBadge.style.color = 'white';
            infoBadge.style.fontWeight = '600';
            infoBadge.style.position = 'absolute';
            infoBadge.style.top = '0';
            infoBadge.style.left = '0';
            infoBadge.style.margin = '1rem';
            infoBadge.style.borderRadius = '4px';
            infoBadge.innerText = t('watchedReactions.badgeTitle', { date: moment(watched.reaction_start_date).fromNow() });

            badgeParent.append(infoBadge);
        }

        countFound += 1;
    });

    log.debug('find watched reaction elements', countFound);
}

function WatchedVideosObserver() {
    const { t } = useTranslation();
    const currentUrl = useAppStore((state) => state.currentUrl);
    const { user } = useAuth();

    useEffect(() => {
        (async () => {
            if (!user) {
                return;
            }

            const watchedVideos = await getWatchedReactions({ userId: user.id });
            markElements(watchedVideos, t);
        })();
    }, [currentUrl, user]);

    return null;
}

WatchedVideosObserver.propTypes = {};

WatchedVideosObserver.defaultProps = {};

export default WatchedVideosObserver;