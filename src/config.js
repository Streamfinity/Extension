/**
 * Constants and functions related to embedding content on specific hosts and managing playback progress.
 */
import moment from 'moment/moment';

export const EMBEDS_ON_HOSTS = [
    'youtube.com',
    'www.youtube.com',
    'm.youtube.com',
    'youtube-nocookie.com',
    'www.youtube-nocookie.com',
    'm.youtube-nocookie.com',
];

// interval in seconds to wait before checking URL for change
export const URL_CHANGE_INTERVAL_SECONDS = 1;

// milliseconds to wait before retrying to mount content script
export const MOUNT_CONTENT_SCRIPT_RETRY_MS = 300;

// number of retries to mount content script
export const MOUNT_CONTENT_SCRIPT_RETRY_COUNT = 100;

// seconds to wait before sending playback progress to backend
export const PLAYBACK_PROGRESS_SEND_INTERVAL_SECONDS = 60;

// minimum of watched video seconds to send playback progress
export const PLAYBACK_PROGRESS_MIN_VIDEO_SECONDS = 8;

// minimum of seconds being present after submitting for playback (only since page visit, not playback time)
export const PLAYBACK_PROGRESS_MIN_SECONDS_PRESENT = 10;

// interval in seconds to mark videos on youtube.com as watched
export const MARK_WATCHED_REACTIONS_INTERVAL = 5;

export function getApiUrl() {
    if (moment.utc().unix() >= 1717192800) {
        return 'https://cyber.streamfinity.tv';
    }

    return import.meta.env.VITE_API_URL;
}
