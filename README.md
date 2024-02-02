<h1 align="center">
![](img/streamfinity-dark-32.png#gh-light-mode-only)
![](img/streamfinity-light-32.png#gh-dark-mode-only)
Streamfinity Extension
</h1>

***

<p align="center">

[![](img/chrome.png)](https://chromewebstore.google.com/detail/streamfinity/mkaledojmamkljdldoeefpabbgfdkack)
[![](img/amo.png)](https://addons.mozilla.org/en-US/firefox/addon/streamfinity/)

</p>

***

## Download

- [**Manual .zip Download**](https://github.com/Streamfinity/Extension/releases/latest)
- [Chrome Web Store](https://chrome.google.com/webstore/detail/mkaledojmamkljdldoeefpabbgfdkack)
- [Firefox Add-On](https://addons.mozilla.org/en-US/firefox/addon/streamfinity)

## Setup

```sh
npm install
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
Currently **only works in Chromium based browsers**.
```sh
npm run dev
```

#### Development, Watch

Rebuilds extension on file changes. Requires a reload of the extension (and page reload if using content scripts).
```sh
npm run watch
```

#### Production

Minifies and optimizes extension build
```sh
npm run build
```

## Load Extension in Browser

### Firefox

- Open [`about:debugging`](https://developer.mozilla.org/en-US/docs/Tools/about:debugging) page
- Navigate to "**This Firefox**" tab
- Click the "**Load Temporary Add-on...**" button
- Navigate to the `dist/` folder of this repository

### Chrome

- Open `chrome://extensions/` page
- Toggle "**Developmer mode**" in the top right corner
- Click the "**Load unpacked**" button
- Navigate to the `dist/` folder of this repository

## Installation

### Firefox

#### Option 1: Install signed .xpi

- [Download](https://github.com/Streamfinity/Extension/releases) the `Firefox_X.X.X_mv2_signed.xpi` version
- Firefox will prompt you to install the extension

#### Option 2: Install via unpacked .zip

- [Download](https://github.com/Streamfinity/Extension/releases) & Unpack extension
- Open [`about:debugging`](https://developer.mozilla.org/en-US/docs/Tools/about:debugging) page
- Navigate to "**This Firefox**" tab
- Click "**Load Temporary Add-on...**"
- Select the [manifest.json](dist/manifest.json) file 

#### Option 3: Install unsigned .xpi

_This is only possible if you are on Firefox Developer or Nightly Edition._

- Navigate to `about:config`
- Search for `xpinstall.signatures.required` and double click until the value shows `false`
- [Download](https://github.com/Streamfinity/Extension/releases) the `Firefox_X.X.X_mv2.xpi` version
- Firefox will prompt you to install the extension

### Chrome

- [Download](https://github.com/Streamfinity/Extension/releases) extension (`*_mv3.zip`)
- Open `chrome://extensions/` page
- Toggle "**Developmer mode**" in the top right corner
- Drag the `.zip` file into the browser window (or select the extracted the parent folder via "Load unpacked")

## Deployment & Publishing

By tagging a commit, the Extension will be built and sent to the **Chrome Web Store** (Manifest 3) & **Mozilla AMO** platform (Manifest 2).

- Commits tagged with `-dev` (eg. `0.0.1-dev.1`) will only be signed (Mozilla AMO) or uploaded in _unlisted_ (Chrome Web Store).
- Commits without development tags will be published instantly (eg. `0.0.1`)
- The **core version prefix must be unique** across all tags. There can not be a `0.0.1` and `0.0.1-dev.1` (or `0.0.1-dev.2` etc.) at the same time because the Extensions Manifest requires all versions to be in a `{int}.{int}.{int}` format. Thus the specific version prefix will also be unique on the Chrome Web Store and Mozilla AMO platform.

## Known Issues

- HMR is not available in Chromium based browsers: [vite-plugin-web-extension#85](https://github.com/samrum/vite-plugin-web-extension/issues/85)
- Firefox is not yet supporting service workers: [stackoverflow.com](https://stackoverflow.com/questions/73440104/failing-to-export-to-background-js-from-a-common-script-under-firefox-with-mv3)
- Can not use dynamically imported module from localhost URL in Firefox [vite-plugin-web-extension#87](https://github.com/samrum/vite-plugin-web-extension/issues/87)

## Authors

- [Roman Zipp](https://ich.wtf)

## License

CC BY-ND 4.0 Deed. Please see the [License File](LICENSE.txt) for more information.

## Credits

Based on [samrum/vite-plugin-web-extension](https://github.com/samrum/vite-plugin-web-extension) (via [create-vite-plugin-web-extension](https://github.com/samrum/create-vite-plugin-web-extension)).
