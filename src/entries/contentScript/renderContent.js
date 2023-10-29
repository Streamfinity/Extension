import browser from 'webextension-polyfill';
import { createLogger } from '~/common/log';
import { INTERVAL_SEND_PLAYER_PROGRESS, INTERVAL_WATCHED_REACTIONS_FIND } from '~/config';
import { getWatchedReactions, sendPlayerProgress } from '~/common/bridge';
import { getIdFromLink, retryFind } from '~/common/utility';
import { WINDOW_NAVIGATE } from '~/events';

const log = createLogger('Content-Script');

function bindWindowEvents() {
    let currentUrl = window.location.href;

    setInterval(() => {
        if (currentUrl !== window.location.href) {
            log.debug('navigated', `${currentUrl} -> ${window.location.href}`);

            currentUrl = window.location.href;

            window.dispatchEvent(new CustomEvent(WINDOW_NAVIGATE, {
                detail: {
                    currentUrl,
                },
            }));
        }
    }, 1000);
}

async function appendShadowRootToDom(appContainer) {
    const [findParentFunc] = retryFind(
        () => {
            const el = document.querySelector('#related');
            return (el?.firstChild) ? el : null;
        },
        300,
        100,
    );

    const parent = await findParentFunc();

    if (!parent.querySelector('#streamfinity')) {
        parent.prepend(appContainer);

        log.debug('injected', parent);
    }
}

export async function renderContent(
    cssPaths,
    render = (_appRoot) => {},
) {
    const appContainer = document.createElement('div');
    appContainer.id = 'streamfinity';

    // appRoot is in shadow root
    const appRoot = document.createElement('section');
    const shadowRoot = appContainer.attachShadow({
        mode: import.meta.env.DEV ? 'open' : 'closed',
    });

    if (import.meta.hot) {
        const { addViteStyleTarget } = await import(
            '@samrum/vite-plugin-web-extension/client'
        );

        await addViteStyleTarget(shadowRoot);
    } else {
        cssPaths.forEach((cssPath) => {
            const styleEl = document.createElement('link');
            styleEl.setAttribute('rel', 'stylesheet');
            styleEl.setAttribute('href', browser.runtime.getURL(cssPath));
            shadowRoot.appendChild(styleEl);
        });
    }

    bindWindowEvents();

    shadowRoot.appendChild(appRoot);

    render(appRoot);

    setInterval(async () => {
        await appendShadowRootToDom(appContainer);
    }, 2000);
}

export async function markVideosWatched() {
    const watchedVideos = await getWatchedReactions();

    function markElements() {
        let countFound = 0;
        const mediaElements = document.querySelectorAll('ytd-rich-grid-media,ytd-playlist-video-renderer');

        mediaElements.forEach((mediaElement) => {
            const thumbnail = mediaElement.querySelector('ytd-thumbnail #thumbnail');
            if (!thumbnail) {
                return;
            }

            const id = getIdFromLink(thumbnail.href);
            if (!id) {
                return;
            }

            const watched = watchedVideos?.find((video) => video.service_video_id === id);
            if (!watched) {
                return;
            }

            // eslint-disable-next-line no-param-reassign
            mediaElement.style.transition = 'opacity 200ms';
            // eslint-disable-next-line no-param-reassign
            mediaElement.style.opacity = '40%';

            countFound += 1;
        });

        log.debug('find watched reaction elements', countFound);
    }

    window.addEventListener(WINDOW_NAVIGATE, () => {
        markElements();
    });

    markElements();

    setInterval(markElements, INTERVAL_WATCHED_REACTIONS_FIND);
}

export async function listenPlayerEvents() {
    let boundEvents = false;

    const playerAttributes = {
        playbackRate: null, // player.playbackRate,
        paused: null, // player.paused,
        ended: null, // player.ended,
        timestamp: null, // player.currentTime,
        url: window.location.href,
        date: (new Date()).toISOString(),
    };

    setInterval(async () => {
        if (!playerAttributes.timestamp) {
            return;
        }

        log.debug('player', playerAttributes);

        await sendPlayerProgress(playerAttributes);
    }, INTERVAL_SEND_PLAYER_PROGRESS);

    function bindEvents(player) {
        player.addEventListener('play', () => {
            playerAttributes.paused = false;
        });

        player.addEventListener('pause', () => {
            playerAttributes.paused = true;
        });

        player.addEventListener('ended', () => {
            playerAttributes.ended = true;
        });

        player.addEventListener('timeupdate', () => {
            playerAttributes.timestamp = player.currentTime;
            playerAttributes.url = window.location.href;
            playerAttributes.date = (new Date()).toISOString();
        });
    }

    const findPlayerInterval = setInterval(() => {
        const player = document.querySelector('video.video-stream');
        if (!player || boundEvents) {
            return;
        }

        bindEvents(player);
        boundEvents = true;

        clearInterval(findPlayerInterval);
    }, 2000);
}
