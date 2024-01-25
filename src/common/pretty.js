import moment from 'moment';
import { createLogger } from '~/common/log';

/**
 * Formats a number with thousands separators.
 *
 * @param {number} number - The number to be formatted.
 * @returns {string} The formatted number.
 */
export function prettyNumber(number) {
    return new Intl.NumberFormat('en-US').format(number);
}

/**
 * Formats a number into a short and readable representation.
 *
 * @param {number} number - The number to be formatted.
 * @returns {string} The formatted number.
 */
export function prettyShortNumber(number) {
    return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(number);
}

/**
 * Formats a number as a pretty price.
 * 
 * @param {number} number - The number to format.
 * @returns {string} The formatted pretty price.
 */
export function prettyPrice(number) {
    return new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
    }).format(number);
}

/**
 * Formats a number as a pretty currency string.
 * 
 * @param {number} number - The number to format.
 * @param {string} [currency='EUR'] - The currency code to use (default: 'EUR').
 * @returns {string} The formatted currency string.
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
 * Formats the given duration in seconds into a pretty string representation.
 * If the duration is greater than or equal to 3600 seconds (1 hour), it will be formatted as 'hh:mm:ss'.
 * Otherwise, it will be formatted as 'mm:ss'.
 *
 * @param {number} seconds - The duration in seconds.
 * @returns {string} The formatted duration string.
 */
export function prettyDuration(seconds) {
    if (seconds >= 3600) {
        return moment.unix(seconds).format('hh:mm:ss');
    }

    return moment.unix(seconds).format('mm:ss');
}

/**
 * Capitalizes the first letter of a string.
 * 
 * @param {string} string - The input string.
 * @returns {string} The input string with the first letter capitalized.
 */
export function ucfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Limits the length of a string and adds ellipsis if necessary.
 * @param {string} text - The input string.
 * @param {number} [count=25] - The maximum length of the string.
 * @returns {string} - The truncated string.
 */
export function strLimit(text, count = 25) {
    const parts = [...text];

    if (parts.length > count) {
        return `${parts.slice(0, count).join('')}...`;
    }

    return text;
}

/**
 * Converts a string to a slug format.
 *
 * @param {string} text - The input string to be converted.
 * @returns {string} - The converted slug string.
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
 * Converts a duration string to seconds.
 *
 * @param {string} duration - The duration string in the format "HH:mm" or "mm:ss".
 * @returns {number} The duration in seconds.
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
 * Extracts the error message from an error object or string.
 * 
 * @param {Error|string} e - The error object or string.
 * @returns {string} - The extracted error message.
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
