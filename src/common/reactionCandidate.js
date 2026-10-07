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
