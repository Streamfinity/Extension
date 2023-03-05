# Streamfinity Extension

## Download

- [**Manual .zip Download**](https://github.com/Streamfinity/Extension/releases/latest)
- [Chrome Web Store](https://chrome.google.com/webstore)
- [Firefox Add-On](https://addons.mozilla.org/en-US/firefox/)

## Setup

```sh
yarn install
```

## Commands

### Build

#### Development, HMR

Hot Module Reloading is used to load changes inline without requiring extension rebuilds and extension/page reloads
Currently only works in Chromium based browsers.
```sh
yarn dev
```

#### Development, Watch

Rebuilds extension on file changes. Requires a reload of the extension (and page reload if using content scripts)
```sh
yarn watch
```

#### Production

Minifies and optimizes extension build
```sh
yarn build
```

### Load extension in browser

Loads the contents of the dist directory into the specified browser
```sh
yarn serve:chrome
```

```sh
yarn serve:firefox
```

## Installation

- Download the `artifact.zip` files from the [latest release](https://github.com/Streamfinity/Extension/releases/latest)
- Unzip file
- Select `manifest.json` file when loading the extension as temporary add-on (see below)

### Firefox

- Open [**about:debugging**](https://developer.mozilla.org/en-US/docs/Tools/about:debugging) page
- Navigate to "**This Firefox**" tab
- Select the [dist/manifest.json](dist/manifest.json) from "Load Temporary Add-on..."

### Chrome

- Open **chrome://extensions/** page
- Toggle "**Developmer mode**" in the top right corner
- Drag the `.zip` file into the browser window or select the extracted the parent folder via "Load unpacked"

## Authors

- [Roman Zipp](https://ich.wtf)

## Credits

Based on [samrum/vite-plugin-web-extension](https://github.com/samrum/vite-plugin-web-extension).
