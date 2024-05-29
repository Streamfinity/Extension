import moment from 'moment';
import { createLogger } from '~/common/log';

/**
 * Format a number into a pretty representation with the 'en-US' locale.
 *
 * @param {number} number - The number to be formatted.
 * @returns {string} The formatted number as a string.
 */
export function prettyNumber(number) {
    return new Intl.NumberFormat('en-US').format(number);
}

/**
 * Format a number into a compact representation with the 'en-US' locale.
 *
 * @param {number} number - The number to be formatted.
 * @returns {string} The compact formatted number as a string.
 */
export function prettyShortNumber(number) {
    return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(number);
}

/**
 * Format a number into a price representation with the 'en-US' locale.
 *
 * @param {number} number - The number to be formatted as a price.
 * @returns {string} The formatted price as a string with 2 decimal places.
 */
export function prettyPrice(number) {
    return new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
    }).format(number);
}

/**
 * Format a number into a currency representation with the specified currency and the 'en-US' locale.
 *
 * @param {number} number - The number to be formatted as currency.
 * @param {string} [currency='EUR'] - The currency code to be used for formatting (default is 'EUR').
 * @returns {string} The formatted currency as a string with 2 decimal places.
 */
export function prettyCurrency(number, currency = 'EUR') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
    }).format(number);
}

/**
 * Format a duration in seconds into a human-readable time format.
 *
 * If the duration is greater than or equal to 1 hour (3600 seconds), it will be formatted as 'hh:mm:ss'.
 * Otherwise, it will be formatted as 'mm:ss'.
 *
 * @param {number} seconds - The duration in seconds to be formatted.
 * @returns {string} The formatted duration as a string in the 'hh:mm:ss' or 'mm:ss' format.
 */
export function prettyDuration(seconds) {
    if (seconds >= 3600) {
        return moment.unix(seconds).format('hh:mm:ss');
    }

    return moment.unix(seconds).format('mm:ss');
}

/**
 * Capitalizes the first letter of a given string.
 *
 * @param {string} string - The input string to capitalize.
 * @returns {string} The input string with the first letter capitalized.
 */
export function ucfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Limit the length of a text by a specified count.
 *
 * @param {string} text - The text to be limited.
 * @param {number} [count=25] - The maximum number of characters to keep in the text (default is 25).
 * @returns {string} The limited text with ellipsis (...) if it exceeds the count.
 */
export function strLimit(text, count = 25) {
    const parts = [...text];

    if (parts.length > count) {
        return `${parts.slice(0, count).join('')}...`;
    }

    return text;
}

/**
 * Generate a slug from the given text by converting it to lowercase, removing diacritics, trimming, replacing spaces with hyphens,
 * removing non-word characters except hyphens, and collapsing multiple hyphens into a single one.
 *
 * @param {string} text - The text to generate a slug from.
 * @returns {string} The generated slug from the text.
 */
export function strSlug(text) {
    return text
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
}

/**
 * Convert a duration in the format 'mm:ss' or 'hh:mm:ss' to seconds.
 *
 * If the duration is in the format 'mm:ss', it will be converted directly to seconds.
 * If the duration is in the format 'hh:mm:ss', it will be converted to total seconds.
 *
 * @param {string} duration - The duration string in the format 'mm:ss' or 'hh:mm:ss'.
 * @returns {number} The total duration in seconds.
 */
export function durationToSeconds(duration) {
    let modifiedDuration = duration;
    // is in format "00:00", moment assumes that last segment is minutes
    if (duration.length === 5) {
        modifiedDuration = `00:${duration}`;
    }

    return moment.duration(modifiedDuration).asSeconds();
}

const log = createLogger('why');

/**
 * Function: why
 * Description: This function takes an error object as input and extracts the error message from it. If the error is a string, it directly assigns it as the message. If the error is an object, it checks for various properties like 'message', 'response.data', 'response._data', 'data.errors', 'data.messages', 'data.error', and 'data.message' to determine the message. If the error is neither a string nor an object, it converts it to a string and assigns it as the message. Finally, it returns the extracted message.
 * 
 * @param {any} e - The error object from which to extract the message
 * @returns {string} - The extracted error message
 */
export function why(e) {
    let message;

    log.debug('error', { type: typeof e, name: e?.name, err: e });

    if (typeof e === 'string') {
        message = e;
    } else if (typeof e === 'object') {
        if (e.message) {
            message = e.message;
            // eslint-disable-next-line no-underscore-dangle
        } else if (e.response && (e.response.data || e.response._data)) {
            // eslint-disable-next-line no-underscore-dangle
            const data = e.response.data || e.response._data;

            if (typeof data.errors === 'object' && Object.values(data.errors).length > 0) {
                [[message]] = Object.values(data.errors);
            } else if (typeof data.messages === 'object' && Object.values(data.messages).length > 0) {
                [[message]] = Object.values(data.messages);
            } else if (typeof data.error === 'string') {
                message = data.error;
            } else if (typeof data.message === 'string') {
                message = data.message;
            }
        }
    } else {
        message = `${e}`;
    }

    return message;
}

/**
 * Function: getVideoUrlWithTimestamp
 * Description: This function generates a URL for a video with an optional timestamp parameter. If the timestamp is provided, it appends it to the video's external tracking URL as a query parameter. If no timestamp is provided, it returns the video's external tracking URL as is.
 * 
 * @param {Object} video - The video object for which the URL is generated.
 * @param {number} ts - The optional timestamp in seconds to be added as a query parameter (default is null).
 * @returns {string} - The URL of the video with an optional timestamp query parameter.
 */
function getVideoUrlWithTimestamp(video, ts) {
    if (!ts) {
        return video.external_tracking_url;
    }

    return `${video.external_tracking_url}?t=${ts}`;
}

/**
 * Function that builds a reaction URL based on the provided reaction object.
 * If the reaction is from a video, it appends the timestamp to the video URL.
 * If the reaction is from a stream, it finds the corresponding video and appends the timestamp.
 * If none of the above, it returns the service external URL from the reaction info.
 *
 * @param {Object} reaction - The reaction object containing information about the reaction source.
 * @returns {string} The URL with timestamp or service external URL based on the reaction type.
 */
export function buildReactionFromUrl(reaction) {
    if (reaction.from_video) {
        return getVideoUrlWithTimestamp(reaction.from_video, reaction.video_seconds_from);
    }

    if (reaction.from_stream) {
        const vodVideo = reaction.from_stream?.vods?.find((v) => !!v)?.video;

        if (vodVideo) {
            return getVideoUrlWithTimestamp(vodVideo, reaction.vod_seconds_from);
        }
    }

    return reaction.from_info?.service_external_url;
}
