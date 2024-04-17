<h1 align="center">

![](img/streamfinity-wordmark-dark.png#gh-light-mode-only)    ![](img/streamfinity-wordmark-light.png#gh-dark-mode-only)

</h1>

<p align="center">
    <a href="https://github.com/Streamfinity/Extension/actions/workflows/build.yml">
        <img src="https://github.com/Streamfinity/Extension/actions/workflows/build.yml/badge.svg" alt="Build">
    </a>
    <a href="https://github.com/Streamfinity/Extension/actions/workflows/lint.yml">
        <img src="https://github.com/Streamfinity/Extension/actions/workflows/lint.yml/badge.svg" alt="Lint">
    </a>
    <img src="https://img.shields.io/chrome-web-store/v/mkaledojmamkljdldoeefpabbgfdkack?label=Chrome" alt="Chrome Web Store Version">
    <img src="https://img.shields.io/amo/v/streamfinity?label=Firefox" alt="Mozilla Add-on Version">
    <img src="https://img.shields.io/github/license/Streamfinity/Extension?label=License" alt="GitHub License">
</p>

<p align="center">
<a href="https://chromewebstore.google.com/detail/streamfinity/mkaledojmamkljdldoeefpabbgfdkack"><img src="img/chrome.png" /></a>
<a href="https://addons.mozilla.org/en-US/firefox/addon/streamfinity/"><img src="img/amo.png" /></a>
<a href="https://microsoftedge.microsoft.com/addons/detail/streamfinity/oodabmjmfenpggjpfnnegmkdkkmenple"><img src="img/edge.jpg" /></a>
</p>

***

## Download

- [**Manual .zip Download**](https://github.com/Streamfinity/Extension/releases/latest)
- [**Chrome** Web Store](https://chrome.google.com/webstore/detail/mkaledojmamkljdldoeefpabbgfdkack)
- [**Firefox** Add-On](https://addons.mozilla.org/en-US/firefox/addon/streamfinity)
- [**Microsoft** Edge Store](https://microsoftedge.microsoft.com/addons/detail/streamfinity/oodabmjmfenpggjpfnnegmkdkkmenple)

## Contributing

> [!NOTE]  
> This project is provided as-is and we are not actively promoting contributions. However, if you wish to contribute to this repository, you will have to sign a Contributor License Agreement (**CLA**) in order for you PRs to be considered for merging.

### Adding a new language

1. Create a new JSON file `locales/{locale}.json` with the according ISO 639 2-letter language code based on the default [`en.json`](locales/en.json).
2. Import the new JSON file in the [`i18n.js`](i18n.js) file.

## Setup

```sh
npm install
```

### Create local env file

```sh
MANIFEST_VERSION=3     # available: 3, 2
BROWSER_TARGET=chrome  # available: chrome, firefox

MANIFEST_HOST_API=*://*.streamfinity.code/*
MANIFEST_HOST_FRONTEND=*://localhost:3000/*

VITE_API_URL=http://streamfinity.code
VITE_FRONTEND_URL=http://localhost:3000

VITE_OAUTH_CLIENT_ID=
```

## Commands

### Development

#### Firefox

Rebuilds extension on file changes. Requires a reload of the extension (and page reload if using content scripts).

```sh
npm run dev:firefox
```

#### Chrome

Hot Module Reloading is used to load changes inline without requiring extension rebuilds and extension/page reloads. Currently **only works in Chromium based browsers**.

```sh
npm run dev:chrome
```

### Production

Minifies and optimizes extension build.

> [!IMPORTANT]  
> You need to explicitly prepend the `MANIFEST_VERSION` and `BROWSER_TARGET` variables if not specified in a `.env.local` file.

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

![](img/pipeline-light.jpg#gh-light-mode-only)
![](img/pipeline-dark.jpg#gh-dark-mode-only)

## Known Issues

- Popup Script not working in Chrome due to injected inline JS
- Firefox is not yet supporting service workers: [stackoverflow.com](https://stackoverflow.com/questions/73440104/failing-to-export-to-background-js-from-a-common-script-under-firefox-with-mv3)
- **HMR** not available in **Firefox**:
  - See issue [vite-plugin-web-extension#87](https://github.com/samrum/vite-plugin-web-extension/issues/87)
  - We can not load the transpiled JS bundle from `localhost` since Firefox only allows loading content scripts from `moz-extension` URLs. (*WebExtension content scripts may only load modules with moz-extension URLs and not: “http://localhost:5173/@vite/client”.*)

## Authors

- [Roman Zipp](https://ich.wtf)

## License

CC BY-ND 4.0 Deed. Please see the [License File](LICENSE.txt) for more information.

[Third Party Licenses](licenses/licenses.txt)

## Credits

Based on [samrum/vite-plugin-web-extension](https://github.com/samrum/vite-plugin-web-extension) (via [create-vite-plugin-web-extension](https://github.com/samrum/create-vite-plugin-web-extension)).
