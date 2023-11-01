import moment from 'moment';
import { createLogger } from '~/common/log';

export function prettyNumber(number) {
    return new Intl.NumberFormat('en-US').format(number);
}

export function prettyShortNumber(number) {
    return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(number);
}

export function prettyPrice(number) {
    return new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
    }).format(number);
}

export function prettyCurrency(number, currency = 'EUR') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
    }).format(number);
}

export function prettyDuration(seconds) {
    if (seconds >= 3600) {
        return moment.unix(seconds).format('hh:mm:ss');
    }

    return moment.unix(seconds).format('mm:ss');
}

export function ucfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function strLimit(text, count = 25) {
    const parts = [...text];

    if (parts.length > count) {
        return `${parts.slice(0, count).join('')}...`;
    }

    return text;
}

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

export function durationToSeconds(duration) {
    let modifiedDuration = duration;
    // is in format "00:00", moment assumes that last segment is minutes
    if (duration.length === 5) {
        modifiedDuration = `00:${duration}`;
    }

    return moment.duration(modifiedDuration).asSeconds();
}

const log = createLogger('why');

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
