import browser from 'webextension-polyfill';
import { createLogger } from '~/common/log';
import { retryFind } from '~/common/utility';
import { WINDOW_NAVIGATE } from '~/events';
import {
    URL_CHANGE_INTERVAL_SECONDS, MOUNT_CONTENT_SCRIPT_RETRY_MS, MOUNT_CONTENT_SCRIPT_RETRY_COUNT, EMBEDS_ON_HOSTS,
} from '~/config';

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
    }, URL_CHANGE_INTERVAL_SECONDS * 1000);
}

async function appendShadowRootToDom(appContainer) {
    const parent = await retryFind(
        () => {
            const el = document.querySelector('#secondary-inner');
            return (el?.firstChild) ? el : null;
        },
        MOUNT_CONTENT_SCRIPT_RETRY_MS,
        MOUNT_CONTENT_SCRIPT_RETRY_COUNT,
    );

    const isNewLayout = !!document.querySelector('#fixed-columns-secondary');

    const existingAppContainer = parent.querySelector('#streamfinity');

    if (existingAppContainer) {
        // log.debug('found parent', parent, existingAppContainer);

        return;
    }

    log.debug('isNewLayout', isNewLayout);

    if (isNewLayout) {
        const insertAfter = parent.querySelector('ytd-comments');

        appContainer.setAttribute('data-new-layout', 1);
        parent.insertBefore(appContainer, insertAfter);
    } else {
        parent.prepend(appContainer);
    }

    log.debug('injected', parent);
}

// <div id="streamfinity">
//   #shadow-root (open)
//     <section>
//        ...
//     </section>
// </div>

export async function renderContent(
    cssPaths,
    render = () => {},
) {
    // Check if extension should be injected into current page
    const { host } = window.location;

    if (!EMBEDS_ON_HOSTS.includes(host)) {
        log.info('not injecting on host', host);
        return;
    }

    // Create elements

    log.info('starting...', { envMode: import.meta.env.MODE, cssPaths });

    const appContainer = document.createElement('div');
    appContainer.id = 'streamfinity';

    if (!import.meta.hot) {
        appContainer.style.display = 'none';
    }

    // Root elements

    const appRoot = document.createElement('section');

    const shadowRoot = appContainer.attachShadow({
        mode: import.meta.env.MODE === 'development' ? 'open' : 'closed',
    });

    // Add styles

    const neededCssAssets = cssPaths ? cssPaths.length : 0;
    let loadedCssAssets = 0;

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
            styleEl.addEventListener('load', () => {
                loadedCssAssets += 1;

                log.debug('loaded css', `${loadedCssAssets}/${neededCssAssets}`, cssPath);

                if (loadedCssAssets >= neededCssAssets) {
                    appContainer.style.display = 'block';
                }
            });
            shadowRoot.appendChild(styleEl);
        });
    }

    // Bind events & Mount container

    bindWindowEvents();

    shadowRoot.appendChild(appRoot);

    render(appRoot);

    await appendShadowRootToDom(appContainer);

    setInterval(async () => {
        await appendShadowRootToDom(appContainer);
    }, 2000);
}
