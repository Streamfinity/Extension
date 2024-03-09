import pkg from '../package.json';

export const browserTargets = {
    chrome: 'chrome',
    firefox: 'firefox',
};

const browserAction = {
    default_icon: {
        16: 'icons/16.png',
        32: 'icons/32.png',
        48: 'icons/48.png',
        128: 'icons/128.png',
    },
    default_popup: 'src/entries/popup/index.html',
};

/**
 *
 * @param {number} manifestVersion
 * @param {string} browserTarget
 * @param {Record<string, string>} env
 * @returns {object}
 */
export function getManifest(manifestVersion, browserTarget, env) {
    const inProduction = process.env.NODE_ENV === 'production';

    if (!Object.values(browserTargets).includes(browserTarget)) {
        throw new Error(`Invalid browser target: ${browserTarget}`);
    }

    if (![2, 3].includes(manifestVersion)) {
        throw new Error(`Invalid manifest version: ${manifestVersion}`);
    }

    const hostMatches = {
        youtube: '*://*.youtube.com/*',
        twitch: '*://*.twitch.tv/*',
        frontend: env.MANIFEST_HOST_FRONTEND,
        api: env.MANIFEST_HOST_API,
    };

    const manifest = {
        author: pkg.author,
        description: pkg.description,
        name: pkg.displayName ?? pkg.name,
        version: pkg.version,
        manifest_version: manifestVersion,
        content_scripts: [
            {
                js: [`src/entries/contentScript/${inProduction ? 'main.jsx' : 'main.dev.jsx'}`],
                matches: [
                    hostMatches.youtube,
                    hostMatches.twitch,
                ],
            },
            {
                js: [`src/entries/contentScriptInternal/${inProduction ? 'main.jsx' : 'main.dev.jsx'}`],
                matches: [
                    hostMatches.frontend,
                ],
            },
        ],
        icons: {
            16: 'icons/16.png',
            32: 'icons/32.png',
            48: 'icons/48.png',
            128: 'icons/128.png',
        },
        permissions: [
            'storage',
            'identity',
        ],
    };

    if (manifestVersion === 2) {
        const manifestVersion2 = {
            ...manifest,
            background: {
                scripts: ['src/entries/background/script.js'],
                persistent: false,
            },
            browser_action: browserAction,
            permissions: [
                ...manifest.permissions,
            ],
        };

        if (browserTarget === browserTargets.chrome) {
            return manifestVersion2;
        }

        return {
            ...manifestVersion2,
            browser_specific_settings: {
                gecko: {
                    id: 'extension-firefox@streamfinity.tv',
                    strict_min_version: '57.0',
                },
            },
        };
    }

    if (manifestVersion === 3) {
        const manifestVersion3 = {
            ...manifest,
            action: browserAction,
            host_permissions: [
                hostMatches.youtube,
                hostMatches.twitch,
                hostMatches.api,
                hostMatches.frontend,
            ],
        };

        // Firefox supported event driven background pages in MV3
        // https://extensionworkshop.com/documentation/develop/manifest-v3-migration-guide/
        if (browserTarget === browserTargets.firefox) {
            return {
                ...manifestVersion3,
                background: {
                    scripts: ['src/entries/background/script.js'],
                },
            };
        }

        // Chrome require ServiceWorkers for background scripts in MV3
        return {
            ...manifestVersion3,
            background: {
                service_worker: 'src/entries/background/serviceWorker.js',
            },
        };
    }

    throw new Error(
        `Missing manifest definition for manifestVersion ${manifestVersion}`,
    );
}
