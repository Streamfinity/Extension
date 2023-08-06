import moment from 'moment';

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
