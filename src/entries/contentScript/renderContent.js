import browser from 'webextension-polyfill';
import { createLogger } from '~/common/log';
import { retryFind } from '~/common/utility';
import { WINDOW_NAVIGATE } from '~/events';
import { URL_CHANGE_INTERVAL_SECONDS, MOUNT_CONTENT_SCRIPT_RETRY_MS, MOUNT_CONTENT_SCRIPT_RETRY_COUNT } from '~/config';

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

    const existingAppContainer = parent.querySelector('#streamfinity');

    // log.debug('found parent', parent, existingAppContainer);

    if (!existingAppContainer) {
        parent.prepend(appContainer);

        log.debug('injected', parent);
    }
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
    log.info('starting...', {
        envMode: import.meta.env.MODE,
    });

    const appContainer = document.createElement('div');
    appContainer.id = 'streamfinity';

    const appRoot = document.createElement('section');

    const shadowRoot = appContainer.attachShadow({
        mode: import.meta.env.MODE === 'development' ? 'open' : 'closed',
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

    await appendShadowRootToDom(appContainer);

    setInterval(async () => {
        await appendShadowRootToDom(appContainer);
    }, 2000);
}
