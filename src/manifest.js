import * as dotenv from 'dotenv';
import pkg from '../package.json';

dotenv.config({
    path: '.env.local',
});

const hostMatches = {
    youtube: '*://*.youtube.com/*',
    api: process.env.MANIFEST_HOST_API,
};

const sharedManifest = {
    content_scripts: [
        {
            js: [`src/entries/contentScript/${process.env.NODE_ENV === 'production' ? 'main.jsx' : 'main.dev.jsx'}`],
            matches: [
                hostMatches.youtube,
            ],
        },
    ],
    icons: {
        16: 'icons/16.png',
        32: 'icons/32.png',
        48: 'icons/48.png',
        64: 'icons/64.png',
        128: 'icons/128.png',
        256: 'icons/256.png',
        512: 'icons/512.png',
    },
    options_ui: {
        page: 'src/entries/options/index.html',
        open_in_tab: true,
    },
    permissions: [
        'storage',
        'identity',
    ],
    // content_security_policy: {
    //     extension_pages: "script-src 'unsafe-inline' 'self' http://localhost:5173 ; object-src 'self'",
    // },
    browser_specific_settings: {
        gecko: {
            id: 'extension@streamfinity.tv',
            strict_min_version: '42.0',
        },
    },
};

const browserAction = {
    default_icon: {
        16: 'icons/16.png',
        32: 'icons/32.png',
        48: 'icons/48.png',
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
    options_ui: {
        ...sharedManifest.options_ui,
        chrome_style: false,
    },
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
