# Streamfinity Extension

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

# Credits

Based on [samrum/vite-plugin-web-extension](https://github.com/samrum/vite-plugin-web-extension).
