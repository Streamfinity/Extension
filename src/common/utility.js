import moment from 'moment';

export function buildFrontendUrl(path) {
    return `${import.meta.env.VITE_FRONTEND_URL}${path}`;
}

export function getIdFromLink(link) {
    const match = link.match(/watch(.*)v=(?<id>[A-Za-z0-9\-_]+)/);

    if (!match || !match.groups || !match.groups.id) {
        return null;
    }

    return match.groups.id;
}

export function getYouTubePlayer() {
    return document.querySelector('video.video-stream.html5-main-video');
}

export function findCurrentVideoChannel() {
    const channelNameElement = document.querySelector('ytd-channel-name#channel-name a[href]');
    if (channelNameElement) {
        return channelNameElement.href;
    }

    const channelAvatarElement = document.querySelector('ytd-video-owner-renderer > a[href]');
    if (channelAvatarElement) {
        return channelAvatarElement.href;
    }

    return null;
}

export function findCurrentVideoPublishDate() {
    const metaPublish = document.querySelector('meta[itemprop="datePublished"]');
    if (metaPublish) {
        return moment(metaPublish.content);
    }

    return null;
}

/**
 * @param callback
 * @param {number} intervalMs
 * @param {number} maxTries
 * @returns {(Promise<HTMLElement>|function)[]}
 */
export function retryFind(callback, intervalMs = 300, maxTries = 300) {
    let intervalId;
    let tries = 0;

    function clear() {
        clearInterval(intervalId);
    }

    const findPromise = new Promise((resolve, reject) => {
        intervalId = setInterval(() => {
            const element = callback();
            tries += 1;

            if (element) {
                clear();
                resolve(element);
            }

            if (tries >= maxTries) {
                reject();
                clear();
            }
        }, intervalMs);
    });

    return [
        async () => findPromise,
        clear,
    ];
}

export function findVideoPlayerBar(interval = 300, maxTries = 300) {
    return retryFind(
        () => document.querySelector('.ytp-progress-bar-container .ytp-progress-bar .ytp-progress-list'),
        interval,
        maxTries,
    );
}
