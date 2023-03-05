import browser from 'webextension-polyfill';

function retryFindContainer() {
    return new Promise((resolve) => {
        let found = false;
        const findInterval = setInterval(() => {
            if (found) {
                return;
            }

            const container = document.querySelector('#above-the-fold');
            const containerChildPointer = container.querySelector('#bottom-row');

            if (container && containerChildPointer) {
                found = true;
                clearInterval(findInterval);
            }

            const injectedContainer = document.createElement('div');
            injectedContainer.id = 'streamfinity';

            container.insertBefore(injectedContainer, containerChildPointer);

            resolve(injectedContainer);
        }, 1000);
    });
}

export default async function renderContent(
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
