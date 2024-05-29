import moment from 'moment';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { why } from '~/common/pretty';

/**
 * Combines multiple class names into a single string using Tailwind CSS utility classes.
 * 
 * @param {...string} inputs - The class names to be combined.
 * @returns {string} - The combined class names string.
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

/**
 * Builds the frontend URL by combining the VITE_FRONTEND_URL environment variable with the provided path.
 * 
 * @param {string} path - The path to be appended to the frontend URL.
 * @returns {string} - The complete frontend URL.
 */
export function buildFrontendUrl(path) {
    return `${import.meta.env.VITE_FRONTEND_URL}${path}`;
}

/**
 * Extracts the video ID from a YouTube video link.
 * 
 * @param {string} link - The YouTube video link from which to extract the video ID.
 * @returns {string|null} - The extracted video ID if found, otherwise null.
 */
export function getIdFromLink(link) {
    const match = link.match(/watch(.*)v=(?<id>[A-Za-z0-9\-_]+)/);

    if (!match || !match.groups || !match.groups.id) {
        return null;
    }

    return match.groups.id;
}

/**
 * Retries a callback function until a condition is met or a maximum number of tries is reached, clearing the interval on success or failure.
 * 
 * @param {Function} callback - The callback function to be executed on each interval.
 * @param {number} [intervalMs=300] - The interval in milliseconds between each callback execution.
 * @param {number} [maxTries=300] - The maximum number of tries before rejecting the promise.
 * @returns {[Promise<unknown>, Function]} - A promise that resolves when the condition is met, and a function to manually clear the interval.
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
 * Retry finding an element using the provided callback function until the element is found or the maximum number of tries is reached.
 * 
 * @param {Function} callback - The callback function to be executed to find the element.
 * @param {number} [intervalMs=300] - The interval in milliseconds between each try.
 * @param {number} [maxTries=300] - The maximum number of tries before giving up.
 * @returns {Promise} A promise that resolves with the found element or rejects if the element is not found within the maximum tries.
 */
export async function retryFind(callback, intervalMs = 300, maxTries = 300) {
    const [findFn] = retryFindWithClearFn(callback, intervalMs, maxTries);

    const found = await findFn();
    return found;
}

// Get elements on page

/**
 * Returns the YouTube player element on the page.
 * 
 * @returns {Element|null} The YouTube player element if found, otherwise null.
 */
export function getYouTubePlayer() {
    return document.querySelector('video.video-stream.html5-main-video');
}

/**
 * Returns the YouTube player progress bar element on the page.
 * 
 * @returns {Element|null} The YouTube player progress bar element if found, otherwise null.
 */
export function getYouTubePlayerProgressBar() {
    return document.querySelector('.ytp-progress-bar-container .ytp-progress-bar .ytp-timed-markers-container');
}

/**
 * Returns the publish date of the current video element on the page.
 * 
 * @returns {moment|null} The publish date of the current video as a moment object if found, otherwise null.
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
 * Find the YouTube player element by retrying for a specified number of times at a given interval.
 * 
 * @param {number} interval - The interval in milliseconds between each retry (default is 300ms).
 * @param {number} maxTries - The maximum number of retries before giving up (default is 300).
 * @returns {Promise<Element>} - A promise that resolves with the found YouTube player element, or rejects if not found.
 */
export function findYouTubePlayer(interval = 300, maxTries = 300) {
    return retryFind(
        () => getYouTubePlayer(),
        interval,
        maxTries,
    );
}

/**
 * Find the video player bar element by querying the DOM with the specified interval and maximum number of tries.
 *
 * @param {number} interval - The interval in milliseconds to wait between each try.
 * @param {number} maxTries - The maximum number of tries before giving up.
 * @returns {Array<Function>} An array containing an async function that returns a promise to find the element and a function to clear the interval.
 */
export function findVideoPlayerBar(interval = 300, maxTries = 300) {
    return retryFindWithClearFn(
        () => document.querySelector('.ytp-progress-bar-container .ytp-progress-bar .ytp-progress-list'),
        interval,
        maxTries,
    );
}

// Toaster

/**
 * Displays a success toast message using the provided message and options.
 * 
 * @param {string} message - The message to be displayed in the toast.
 * @param {object} [options] - The options for customizing the toast display (optional).
 */
export function toastSuccess(message, options) {
    toast.success(message, {
        ...(options || {}),
    });
}

/**
 * Displays a warning toast message using the provided warning message and options.
 * 
 * @param {string} warning - The warning message to be displayed in the toast.
 * @param {object} [options] - The options for customizing the toast display (optional).
 */
export function toastWarn(warning, options) {
    toast(warning, {
        ...options || {},
        duration: 5 * 1000,
        className: 'rounded-xl gap-2 bg-yellow-600 text-white flex',
        icon: '⚠️',
    });
}

/**
 * Display an error toast message using react-hot-toast with a custom error message generated by the 'why' function.
 * 
 * @param {any} error - The error object or message to display in the toast.
 * @param {object} options - Additional options for customizing the toast display (optional).
 * @returns {void}
 */
export function toastError(error, options) {
    toast.error(() => why(error), {
        ...(options || {}),
        icon: '❕',
        className: 'rounded-xl bg-red-500 text-white flex gap-2',
        duration: 6 * 1000,
    });
}
