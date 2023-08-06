export function getIdFromLink(link) {
    const match = link.match(/watch(.*)v=(?<id>[A-Za-z0-9\-_]+)/);

    if (!match || !match.groups || !match.groups.id) {
        return null;
    }

    return match.groups.id;
}

export function getYouTubePlayer() {
    return document.querySelector('video.video-stream.html5-main-video');
}
