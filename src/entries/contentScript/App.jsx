import './App.css';
import '@streamfinity/streamfinity-branding/dist/index.css';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useShallow } from 'zustand/react/shallow';
import { useTranslation } from 'react-i18next';
import useAuth, { STATE_LIVE, STATE_OWN_VIDEO } from '~/hooks/useAuth';
import { useAppStore } from '~/entries/contentScript/state';
import ReactionPolicyNotice from '~/entries/contentScript/components/ReactionPolicyNotice';
import { WINDOW_NAVIGATE } from '~/events';
import StatusNotice from '~/entries/contentScript/components/StatusNotice';
import ReactionsHistoryNotice from '~/entries/contentScript/components/ReactionsHistoryNotice';
import WatchedVideosObserver from '~/entries/contentScript/components/headless/WatchedVideosObserver';
import PlayerProgressListener from '~/entries/contentScript/components/headless/PlayerProgressListener';
import { setTheme } from '~/common/bridge';
import LoginButton from '~/components/LoginButton';
import SubmitSuggestionNotice from '~/entries/contentScript/components/SubmitSuggestionNotice';
import MarkReactionNotice from '~/entries/contentScript/components/MarkReactionNotice';
import OriginalVideoNotice from '~/entries/contentScript/components/OriginalVideoNotice';
import AppContainer from '~/entries/contentScript/components/AppContainer';
import StreamerModeNotice from '~/entries/contentScript/components/StreamerModeNotice';
import { usePage } from '~/hooks/usePage';
import { useBackgroundEvents } from '~/entries/contentScript/hooks/useBackgroundEvents';
import AnalyticsNotice from '~/entries/contentScript/components/AnalyticsNotice';
import { storageGetCompact, storageSetCompact } from '~/entries/background/common/storage';
import CommunityNoteNoticeComingSoon from '~/entries/contentScript/components/CommunityNoteNoticeComingSoon';

function App() {
    const { t, i18n } = useTranslation();
    const {
        user, loadingAuth, liveStream, login, state, isIncognito, isTrackingVideos,
    } = useAuth();

    const [setCurrentUrl, isDarkMode, isDeviceDarkMode, isCompact, setIsCompact] = useAppStore(
        useShallow((storeState) => ([
            storeState.setCurrentUrl,
            storeState.isDarkMode,
            storeState.isDeviceDarkMode,
            storeState.isCompact,
            storeState.setIsCompact,
        ])),
    );

    // Set language

    useEffect(() => {
        if (user?.locale_frontend && i18n.language !== user.locale_frontend) {
            i18n.changeLanguage(user.locale_frontend);
        }
    }, [user, i18n]);

    // Add page effect which collects url + channel info

    usePage();

    // Listen for messages sent by background via browser.tabs.sendMessage

    useBackgroundEvents();

    // Location navigation listener

    useEffect(() => {
        setCurrentUrl(window.location.href);

        /** @param {CustomEvent} event */
        function onChangePage(event) {
            setCurrentUrl(event.detail.currentUrl);
        }

        window.addEventListener(WINDOW_NAVIGATE, onChangePage);

        return () => {
            window.removeEventListener(WINDOW_NAVIGATE, onChangePage);
        };
    }, []);

    // Compact mode

    useEffect(() => {
        (async () => {
            const current = await storageGetCompact();

            if (isCompact === null) {
                setIsCompact(!!current);
            } else if (current !== isCompact) {
                await storageSetCompact(isCompact);
            }
        })();
    }, [isCompact]);

    // Theme listener

    useEffect(() => {
        setTheme({ isDark: isDeviceDarkMode });
    }, [isDeviceDarkMode]);

    // User item

    const [toggleLogout, setToggleLogout] = useState(false);

    useEffect(() => {
        const countdown = setTimeout(() => setToggleLogout(false), 5000);

        return () => {
            clearTimeout(countdown);
        };
    }, [toggleLogout]);

    if (!user) {
        return (
            <AppContainer dark={isDarkMode}>
                <div className="flex flex-col gap-6">

                    <ReactionPolicyNotice />

                    <p className="text-sm text-gray-500">
                        {t('auth.loginDescription')}
                    </p>

                    <LoginButton
                        loading={loadingAuth}
                        onClick={login}
                    />

                </div>
            </AppContainer>
        );
    }

    return (
        <AppContainer
            dark={isDarkMode}
            state={state}
            isTrackingVideos={isTrackingVideos}
            liveStream={liveStream}
        >
            {user && (
                <StatusNotice
                    state={state}
                    liveStream={liveStream}
                />
            )}

            {isIncognito && (
                <div className="text-center text-sm">
                    {t('incognito.title', { time: moment(user.extension_invisible_until).format('HH:mm') })}
                </div>
            )}

            {state === STATE_OWN_VIDEO && (
                <AnalyticsNotice />
            )}

            {state !== STATE_LIVE && (
                <SubmitSuggestionNotice />
            )}

            <ReactionPolicyNotice />

            <CommunityNoteNoticeComingSoon />

            {state !== STATE_LIVE && (
                <ReactionsHistoryNotice />
            )}

            <OriginalVideoNotice />

            {state !== STATE_LIVE && (
                <MarkReactionNotice />
            )}

            {state === STATE_LIVE && (
                <StreamerModeNotice />
            )}

            <PlayerProgressListener active={isTrackingVideos} />
            <WatchedVideosObserver />

        </AppContainer>
    );
}

export default App;
