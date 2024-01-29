import browser from 'webextension-polyfill';
import { createLogger } from '~/common/log';
import { retryFind } from '~/common/utility';
import { WINDOW_NAVIGATE } from '~/events';

const log = createLogger('Content-Script');

/**
 * Binds window events and dispatches a custom event when the URL changes.
 */
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

/**
 * Appends the shadow root to the DOM.
 *
 * @param {HTMLElement} appContainer - The container element for the shadow root.
 * @returns {Promise<void>} - A promise that resolves when the shadow root is appended to the DOM.
 */
async function appendShadowRootToDom(appContainer) {
    const parent = await retryFind(
        () => {
            const el = document.querySelector('#related');
            return (el?.firstChild) ? el : null;
        },
        300,
        100,
    );

    if (!parent.querySelector('#streamfinity')) {
        parent.prepend(appContainer);

        log.debug('injected', parent);
    }
}

/**
 * Renders the content of the application.
 *
 * @param {string[]} cssPaths - An array of CSS file paths.
 * @param {Function} render - A function that renders the application content.
 * @returns {Promise<void>} - A promise that resolves when the content is rendered.
 */
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
