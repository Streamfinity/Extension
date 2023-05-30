import { defineConfig, loadEnv } from 'vite';
import webExtension from '@samrum/vite-plugin-web-extension';
import path from 'path';
import eslint from 'vite-plugin-eslint';
import { getManifest } from './src/manifest';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [
            eslint(),
            webExtension({
                manifest: getManifest(Number(env.MANIFEST_VERSION)),
                useDynamicUrlContentScripts: true,
                devHtmlTransform: false,
            }),
        ],
        resolve: {
            alias: {
                '~': path.resolve(__dirname, './src'),
            },
        },
    };
});
