import moment from 'moment';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { why } from '~/common/pretty';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

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

/**
 * @param callback
 * @param {number} intervalMs
 * @param {number} maxTries
 * @returns {(Promise<HTMLElement>|function)[]}
 */
export function retryFindWithClearFn(callback, intervalMs = 300, maxTries = 300) {
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

/**
 * @param callback
 * @param {number} intervalMs
 * @param {number} maxTries
 * @returns {Promise<HTMLElement>}
 */
export async function retryFind(callback, intervalMs = 300, maxTries = 300) {
    const [findFn] = retryFindWithClearFn(callback, intervalMs, maxTries);

    const found = await findFn();
    return found;
}

// Get elements on page

export function getYouTubePlayer() {
    return document.querySelector('video.video-stream.html5-main-video');
}

export function getYouTubePlayerProgressBar() {
    return document.querySelector('.ytp-progress-bar-container .ytp-progress-bar .ytp-timed-markers-container');
}

export function getCurrentVideoPublishDate() {
    const metaPublish = document.querySelector('meta[itemprop="datePublished"]');
    if (metaPublish) {
        return moment(metaPublish.content);
    }

    return null;
}

// Retry find elements on page

export function findYouTubePlayer(interval = 300, maxTries = 300) {
    return retryFind(
        () => getYouTubePlayer(),
        interval,
        maxTries,
    );
}

export function findVideoPlayerBar(interval = 300, maxTries = 300) {
    return retryFindWithClearFn(
        () => document.querySelector('.ytp-progress-bar-container .ytp-progress-bar .ytp-progress-list'),
        interval,
        maxTries,
    );
}

// Toaster

export function toastSuccess(message, options) {
    toast.success(message, {
        ...(options || {}),
    });
}

export function toastWarn(warning, options) {
    toast(warning, {
        ...options || {},
        duration: 5 * 1000,
        className: 'rounded-xl gap-2 bg-yellow-600 text-white flex',
        icon: '⚠️',
    });
}

export function toastError(error, options) {
    toast.error(() => why(error), {
        ...(options || {}),
        icon: '❕',
        className: 'rounded-xl bg-red-500 text-white flex gap-2',
        duration: 6 * 1000,
    });
}
