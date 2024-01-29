import moment from 'moment';

/**
 * Builds the frontend URL by appending the given path to the VITE_FRONTEND_URL.
 *
 * @param {string} path - The path to be appended to the frontend URL.
 * @returns {string} The complete frontend URL.
 */
export function buildFrontendUrl(path) {
    return `${import.meta.env.VITE_FRONTEND_URL}${path}`;
}

/**
 * Extracts the ID from a YouTube video link.
 *
 * @param {string} link - The YouTube video link.
 * @returns {string|null} - The ID of the YouTube video, or null if no ID is found.
 */
export function getIdFromLink(link) {
    const match = link.match(/watch(.*)v=(?<id>[A-Za-z0-9\-_]+)/);

    if (!match || !match.groups || !match.groups.id) {
        return null;
    }

    return match.groups.id;
}

/**
 * Retries to find an element using the provided callback function at a specified interval.
 * @param {Function} callback - The callback function to be executed to find the element.
 * @param {number} [intervalMs=300] - The interval in milliseconds at which the callback function is executed.
 * @param {number} [maxTries=300] - The maximum number of tries before giving up.
 * @returns {Array<Function>} - An array containing two functions:
 *   - The first function is an async function that returns a promise which resolves when the element is found.
 *   - The second function is used to clear the interval and stop further retries.
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
 * Retries the specified callback function until a result is found.
 * @param {Function} callback - The callback function to be retried.
 * @param {number} [intervalMs=300] - The interval in milliseconds between each retry.
 * @param {number} [maxTries=300] - The maximum number of retries.
 * @returns {Promise<any>} - A promise that resolves with the result of the callback function.
 */
export async function retryFind(callback, intervalMs = 300, maxTries = 300) {
    const [findFn] = retryFindWithClearFn(callback, intervalMs, maxTries);

    const found = await findFn();
    return found;
}

// Get elements on page

/**
 * Returns the YouTube player element.
 * @returns {Element} The YouTube player element.
 */
export function getYouTubePlayer() {
    return document.querySelector('video.video-stream.html5-main-video');
}

/**
 * Returns the YouTube player progress bar element.
 *
 * @returns {Element} The YouTube player progress bar element.
 */
export function getYouTubePlayerProgressBar() {
    return document.querySelector('.ytp-progress-bar-container .ytp-progress-bar .ytp-timed-markers-container');
}

/**
 * Returns the URL of the current video channel.
 *
 * @returns {string|null} The URL of the current video channel, or null if not found.
 */
export function getCurrentVideoChannel() {
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

/**
 * Retrieves the current video publish date from the document metadata.
 * @returns {moment.Moment|null} The moment object representing the publish date, or null if not found.
 */
export function getCurrentVideoPublishDate() {
    const metaPublish = document.querySelector('meta[itemprop="datePublished"]');
    if (metaPublish) {
        return moment(metaPublish.content);
    }

    return null;
}

// Retry find elements on page

/**
 * Finds the YouTube player by retrying a specified number of times with a given interval.
 * @param {number} interval - The interval in milliseconds between each retry.
 * @param {number} maxTries - The maximum number of retries.
 * @returns {Object} - The YouTube player object.
 */
export function findYouTubePlayer(interval = 300, maxTries = 300) {
    return retryFind(
        () => getYouTubePlayer(),
        interval,
        maxTries,
    );
}

/**
 * Finds the video player bar element.
 *
 * @param {number} interval - The interval in milliseconds between each retry.
 * @param {number} maxTries - The maximum number of retries.
 * @returns {Element|null} - The video player bar element, or null if not found.
 */
export function findVideoPlayerBar(interval = 300, maxTries = 300) {
    return retryFindWithClearFn(
        () => document.querySelector('.ytp-progress-bar-container .ytp-progress-bar .ytp-progress-list'),
        interval,
        maxTries,
    );
}
