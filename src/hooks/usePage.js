import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '~/entries/contentScript/state';
import { createLogger } from '~/common/log';

const log = createLogger('usePage');

export function usePage() {
    const [
        currentUrl, setCurrentUrl,
        currentChannel, setCurrentChannel,
        isDarkMode, setIsDarkMode,
        isDeviceDarkMode, setIsDeviceDarkMode,
    ] = useAppStore(
        useShallow((state) => [
            state.currentUrl,
            state.setCurrentUrl,
            state.currentChannel,
            state.setCurrentChannel,
            state.isDarkMode,
            state.setIsDarkMode,
            state.isDeviceDarkMode,
            state.setIsDeviceDarkMode,
        ]),
    );

    function scrape() {
        let hasUrl = false;
        let hasChannel = false;

        if (window?.location && window.location.href !== currentUrl) {
            hasUrl = true;

            log.debug('-> new url', window.location.href);
            setCurrentUrl(window.location.href);
        }

        const channelUrlFull = document.querySelector('#above-the-fold ytd-channel-name yt-formatted-string a')?.href
                || document.querySelector('span[itemprop="name"] link[itemprop="url"]')?.href;

        if (channelUrlFull) {
            hasChannel = true;

            const channelUrl = new URL(channelUrlFull);

            const channelInfo = {
                handle: null,
                id: null,
                url: channelUrl.href,
            };

            if (channelUrl.pathname.startsWith('/@')) {
                channelInfo.handle = channelUrl.pathname.replace('/@', '');
            }

            if (JSON.stringify(channelInfo) !== JSON.stringify(currentChannel)) {
                log.debug('-> new channel', channelInfo, currentChannel);
                setCurrentChannel(channelInfo);
            }
        }

        if (!hasChannel) {
            setCurrentChannel({ handle: null, id: null, url: null });
        }

        // Update content script dark mode

        const html = document.querySelector('html');
        if (html) {
            const detectedDark = html.hasAttribute('dark');

            if (detectedDark !== isDarkMode) {
                setIsDarkMode(detectedDark);
            }
        }

        // Device dark mode, used to update popup icon color

        const detectedDeviceDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (detectedDeviceDark !== isDeviceDarkMode) {
            setIsDeviceDarkMode(detectedDeviceDark);
        }

        log.debug('scrape()', { hasUrl, hasChannel });

        return hasUrl && hasChannel;
    }

    useEffect(() => {
        let scrapeInterval = null;

        function onNavigateFinish() {
            log.debug('+++++++++++++++++ onNavigateEnd');

            scrapeInterval = setInterval(() => {
                const ok = scrape();

                if (ok) {
                    clearInterval(scrapeInterval);
                }
            }, 1000);
        }

        function onNavigateStart() {
            log.debug('+++++++++++++++++ onNavigateStart');
        }

        window.addEventListener('yt-navigate-start', onNavigateStart);
        window.addEventListener('yt-navigate-finish', onNavigateFinish);

        scrape();

        return () => {
            window.removeEventListener('yt-navigate-start', onNavigateStart);
            window.removeEventListener('yt-navigate-finish', onNavigateFinish);

            clearInterval(scrapeInterval);
        };
    }, []);

    return {
        currentUrl,
    };
}
