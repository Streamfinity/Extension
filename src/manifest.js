import * as dotenv from 'dotenv';
import pkg from '../package.json';

dotenv.config({
    path: '.env.local',
});

const hostMatches = {
    youtube: '*://*.youtube.com/*',
    twitch: '*://*.twitch.tv/*',
    frontend: process.env.MANIFEST_HOST_FRONTEND,
    api: process.env.MANIFEST_HOST_API,
};

const sharedManifest = {
    content_scripts: [
        {
            js: [`src/entries/contentScript/${process.env.NODE_ENV === 'production' ? 'main.jsx' : 'main.dev.jsx'}`],
            matches: [
                hostMatches.youtube,
                hostMatches.twitch,
            ],
        },
        {
            js: [`src/entries/contentScriptInternal/${process.env.NODE_ENV === 'production' ? 'main.jsx' : 'main.dev.jsx'}`],
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
    // content_security_policy: {
    //     extension_pages: "script-src 'unsafe-inline' 'self' http://localhost:5173 ; object-src 'self'",
    // },
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

const ManifestV2 = {
    ...sharedManifest,
    background: {
        scripts: ['src/entries/background/script.js'],
        persistent: false,
    },
    browser_action: browserAction,
    permissions: [...sharedManifest.permissions],
};

const ManifestV3 = {
    ...sharedManifest,
    action: browserAction,
    background: {
        service_worker: 'src/entries/background/serviceWorker.js',
    },
    host_permissions: [
        hostMatches.youtube,
        hostMatches.twitch,
        hostMatches.api,
    ],
};

export function getManifest(manifestVersion) {
    const manifest = {
        author: pkg.author,
        description: pkg.description,
        name: pkg.displayName ?? pkg.name,
        version: pkg.version,
    };

    if (manifestVersion === 2) {
        return {
            ...manifest,
            ...ManifestV2,
            manifest_version: manifestVersion,
            browser_specific_settings: {
                gecko: {
                    id: 'extension-firefox@streamfinity.tv',
                    strict_min_version: '57.0',
                },
            },
        };
    }

    if (manifestVersion === 3) {
        return {
            ...manifest,
            ...ManifestV3,
            manifest_version: manifestVersion,
        };
    }

    throw new Error(
        `Missing manifest definition for manifestVersion ${manifestVersion}`,
    );
}
