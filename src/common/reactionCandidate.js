// Same pattern as ReactionDetection::matchesYouTubeUrl in the backend
const YOUTUBE_VIDEO_URL = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.?be)\/(?:watch\?v=)?([\w-]{11})/g;

export function hasOtherVideoLink(description, videoId) {
    if (!description) {
        return false;
    }

    return [...description.matchAll(YOUTUBE_VIDEO_URL)].some((match) => match[1] !== videoId);
}

export function isYouTubeVideoUrl(url) {
    return new RegExp(YOUTUBE_VIDEO_URL.source).test(url);
}

// Line breaks are <br> elements and YouTube may render links to other videos as chips showing the video title.
// The backend needs both lines and urls to detect "original video: <url>".
function getDescriptionText(element) {
    const clone = element.cloneNode(true);

    clone.querySelectorAll('br').forEach((br) => br.replaceWith('\n'));

    clone.querySelectorAll('a').forEach((link) => {
        if (isYouTubeVideoUrl(link.href)) {
            link.replaceWith(link.href);
        }
    });

    return clone.textContent;
}

export function scrapeVideo(doc, videoId) {
    const metadata = doc.querySelector('ytd-watch-metadata');

    if (metadata?.getAttribute('video-id') !== videoId) {
        return null;
    }

    const title = metadata.querySelector('#title h1 yt-formatted-string')?.textContent?.trim();

    // #expanded holds an empty element until the user expands the description, the snippet holds the full text
    const description = metadata.querySelector('#description-inline-expander #attributed-snippet-text');

    if (!title || !description) {
        return null;
    }

    return {
        title,
        description: getDescriptionText(description),
    };
}
