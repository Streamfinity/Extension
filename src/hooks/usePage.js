import { useEffect } from 'react';
import { useAppStore } from '~/entries/contentScript/state';
import { createLogger } from '~/common/log';
import { THEME_CHANGE } from '~/events';

const log = createLogger('usePage');

export function usePage() {
    const {
        currentUrl, setCurrentUrl,
        currentChannel, setCurrentChannel,
        isDarkMode, setIsDarkMode,
        isDeviceDarkMode, setIsDeviceDarkMode,
    } = useAppStore();

    useEffect(() => {
        function scrape() {
            if (window?.location && window.location.href !== currentUrl) {
                log.debug('settings new url', window.location.href);
                setCurrentUrl(window.location.href);
            }

            const channelInfoElement = document.querySelector('ytd-channel-name yt-formatted-string a');

            if (channelInfoElement) {
                const channelInfo = {
                    handle: null,
                    id: null,
                    url: channelInfoElement.href,
                };

                const href = channelInfoElement.getAttribute('href');

                if (href && href.startsWith('/@')) {
                    channelInfo.handle = href.replace('/@', '');
                }

                if (currentChannel.handle !== channelInfo.handle || currentChannel.id !== channelInfo.id || currentChannel.url !== channelInfo.url) {
                    log.debug('setting new channel', channelInfo);
                    setCurrentChannel(channelInfo);
                }
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
        }

        const currentUrlIntervalId = setInterval(() => {
            scrape();
        }, 1500);

        scrape();

        return () => {
            clearInterval(currentUrlIntervalId);
        };
    }, [currentUrl, currentChannel, isDarkMode, isDeviceDarkMode]);

    return {
        currentUrl,
    };
}
