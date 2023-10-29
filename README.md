# Streamfinity Extension

## Download

- [**Manual .zip Download**](https://github.com/Streamfinity/Extension/releases/latest)
- [Chrome Web Store](https://chrome.google.com/webstore/detail/mkaledojmamkljdldoeefpabbgfdkack)
- [Firefox Add-On](https://addons.mozilla.org/en-US/firefox/addon/streamfinity)

## Setup

```sh
bun install
```

### Create local env file

```sh
MANIFEST_VERSION=3
MANIFEST_HOST_API=*://*.streamfinity.code/*

VITE_API_URL=http://streamfinity.code
VITE_FRONTEND_URL=http://localhost:3000

VITE_OAUTH_CLIENT_ID=
```

## Commands

### Build

#### Development, HMR

Hot Module Reloading is used to load changes inline without requiring extension rebuilds and extension/page reloads
Currently only works in Chromium based browsers.
```sh
bun run dev
```

#### Development, Watch

Rebuilds extension on file changes. Requires a reload of the extension (and page reload if using content scripts)
```sh
bun run watch
```

#### Production

Minifies and optimizes extension build
```sh
bun run build
```

### Load extension in browser

Loads the contents of the dist directory into the specified browser
```sh
bun run serve:chrome
```

```sh
bun run serve:firefox
```

## Installation

- Download the `artifact.zip` files from the [latest release](https://github.com/Streamfinity/Extension/releases/latest)
- Unzip file
- Select `manifest.json` file when loading the extension as temporary add-on (see below)

### Firefox

#### Option 1: Install via unpacked .zip

- [Download](https://github.com/Streamfinity/Extension/releases) & Unpack extension
- Open [`about:debugging`](https://developer.mozilla.org/en-US/docs/Tools/about:debugging) page
- Navigate to "**This Firefox**" tab
- Click "**Load Temporary Add-on...**"
- Select the [manifest.json](dist/manifest.json) file 

#### Option 3: Install signed .xpi

- [Download](https://github.com/Streamfinity/Extension/releases) the `Firefox_X.X.X_mv2_signed.xpi` version
- Firefox will prompt you to install the extension

#### Option 3: Install unsigned .xpi

_This is only possible if you are on Firefox Developer or Nightly Edition._

- Navigate to `about:config`
- Search for `xpinstall.signatures.required` and double click until the value shows `false`
- [Download](https://github.com/Streamfinity/Extension/releases) the `Firefox_X.X.X_mv2.xpi` version
- Firefox will prompt you to install the extension

### Chrome

- Open `chrome://extensions/` page
- Toggle "**Developmer mode**" in the top right corner
- Drag the `.zip` file into the browser window or select the extracted the parent folder via "Load unpacked"

## Known Issues

- HMR is not available in Chromium based browsers: [vite-plugin-web-extension#85](https://github.com/samrum/vite-plugin-web-extension/issues/85)
- Firefox is not yet supporting service workers: [stackoverflow.com](https://stackoverflow.com/questions/73440104/failing-to-export-to-background-js-from-a-common-script-under-firefox-with-mv3)
- Can not use dynamically imported module from localhost URL in Firefox [vite-plugin-web-extension#87](https://github.com/samrum/vite-plugin-web-extension/issues/87)

## Authors

- [Roman Zipp](https://ich.wtf)

## Credits

Based on [samrum/vite-plugin-web-extension](https://github.com/samrum/vite-plugin-web-extension) (via [create-vite-plugin-web-extension](https://github.com/samrum/create-vite-plugin-web-extension)).
