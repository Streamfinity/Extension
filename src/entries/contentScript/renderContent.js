import browser from 'webextension-polyfill';
import { createLogger } from '~/common/log';
import { PLAYER_PROGRESS } from '~/messages';
import { INTERVAL_SEND_PLAYER_PROGRESS } from '~/config';

const log = createLogger('Content-Script');

function retryFindContainer() {
    return new Promise((resolve) => {
        let found = false;
        const findInterval = setInterval(() => {
            if (found) {
                return;
            }

            const container = document.querySelector('#above-the-fold');
            const containerChildPointer = container.querySelector('#bottom-row');

            if (!container || !containerChildPointer) {
                log.debug('injected', 'not found');
                return;
            }

            found = true;

            const injectedContainer = document.createElement('div');
            injectedContainer.id = 'streamfinity';

            container.insertBefore(injectedContainer, containerChildPointer);

            log.debug('injected', { injectedContainer });

            resolve(injectedContainer);
            clearInterval(findInterval);
        }, 1000);
    });
}

export async function renderContent(
    cssPaths,
    render = (_appRoot) => {},
) {
    const appContainer = await retryFindContainer();

    const shadowRoot = appContainer.attachShadow({
        mode: import.meta.env.DEV ? 'open' : 'closed',
    });
    const appRoot = document.createElement('div');

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

    shadowRoot.appendChild(appRoot);

    render(appRoot);
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

        await browser.runtime.sendMessage({
            type: PLAYER_PROGRESS,
            data: playerAttributes,
        });
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
