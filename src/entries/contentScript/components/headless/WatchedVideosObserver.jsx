/* eslint-disable no-param-reassign */

import { useEffect, useState } from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { getIdFromLink } from '~/common/utility';
import { getWatchedReactions } from '~/common/bridge';
import { createLogger } from '~/common/log';
import useAuth from '~/hooks/useAuth';
import { useAppStore } from '~/entries/contentScript/state';
import { MARK_WATCHED_REACTIONS_INTERVAL } from '~/config';

const log = createLogger('WatchedReactions');

/**
 * Marks elements as watched based on the provided list of watched videos.
 * 
 * @param {Array} watchedVideos - List of watched videos to compare against.
 * @param {Function} t - Translation function for i18n support.
 * @returns {void}
 */
function markElements(watchedVideos, t) {
    if (!watchedVideos) {
        return;
    }

    // The function is called from the resize event, which leads to videos being shifted around and
    // wrong videos now being marked as watched. This is a workaround to clear the previous badges

    document
        .querySelectorAll('.streamfinity-watched-badge')
        .forEach((badge) => {
            badge.remove();
        });

    document
        .querySelectorAll('[data-streamfinity-watched]')
        .forEach((element) => {
            element.removeAttribute('data-streamfinity-watched');
            element.style.opacity = '100%';
        });

    // eslint-disable-next-line no-unused-vars
    let countFound = 0;

    // Home:     <ytd-rich-grid-media />
    // Search:   <ytd-video-renderer />
    // Playlist: <ytd-playlist-video-renderer />
    const mediaElements = document.querySelectorAll('ytd-rich-grid-media,ytd-playlist-video-renderer,ytd-video-renderer');

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
            mediaElement.querySelector('ytd-thumbnail yt-image'),
            mediaElement.querySelector('#details'),
        ];

        fadeOutElements.filter((e) => !!e).forEach((element) => {
            element.setAttribute('data-streamfinity-watched', 'true');

            element.style.transition = 'opacity 200ms';
            element.style.opacity = '40%';
        });

        const badgeParent = mediaElement.querySelector('#thumbnail');

        if (badgeParent && !mediaElement.querySelector('.streamfinity-watched-badge')) {
            const infoBadge = document.createElement('div');
            infoBadge.classList.add('streamfinity-watched-badge');
            infoBadge.style.padding = '.4rem .6rem';
            infoBadge.style.backgroundColor = '#14B8A6';
            infoBadge.style.position = 'absolute';
            infoBadge.style.width = 'calc(100% - (.6rem * 2))';
            infoBadge.style.top = '0';
            infoBadge.style.left = '0';
            infoBadge.style.margin = '0';
            infoBadge.style.borderTopLeftRadius = '4px';
            infoBadge.style.borderTopRightRadius = '4px';
            infoBadge.style.color = 'white';
            infoBadge.style.fontWeight = '500';
            infoBadge.style.textAlign = 'center';
            infoBadge.style.fontSize = '12px';
            infoBadge.innerText = t('watchedReactions.badgeTitle', { date: moment(watched.reaction_start_date).fromNow() });

            badgeParent.append(infoBadge);
        }

        countFound += 1;
    });

}

/**
 * Function component for observing watched videos.
 * 
 * This component sets up an observer to mark watched videos based on user interactions.
 * It fetches watched videos data, listens for resize events, and periodically updates the watched status.
 * 
 * @returns {null} Returns null as the component does not render any UI elements.
 */
function WatchedVideosObserver() {
    const { t } = useTranslation();
    const currentUrl = useAppStore((state) => state.currentUrl);
    const { user } = useAuth();

    const [watchedVideos, setWatchedVideos] = useState(null);

    useEffect(() => {
        let intervalId = null;
        let resizeTmeout = null;

        function onResize() {
            resizeTmeout = setTimeout(() => {
                markElements(watchedVideos, t);
            }, 500);
        }

        window.addEventListener('resize', onResize);

        (async () => {
            if (!user) {
                return;
            }

            setWatchedVideos(
                await getWatchedReactions({ userId: user.id }),
            );

            markElements(watchedVideos, t);

            intervalId = setInterval(() => {
                markElements(watchedVideos, t);
            }, MARK_WATCHED_REACTIONS_INTERVAL * 1000);

            log.debug('watched videos observer started');
        })();

        return () => {
            clearInterval(intervalId);
            clearTimeout(resizeTmeout);
            window.removeEventListener('resize', onResize);
            log.debug('watched videos observer stopped');
        };
    }, [currentUrl, user?.id]);

    return null;
}

WatchedVideosObserver.propTypes = {};

WatchedVideosObserver.defaultProps = {};

export default WatchedVideosObserver;
