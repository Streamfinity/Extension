import './app.css';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import useAuth, { STATE_LIVE, STATE_OWN_VIDEO } from '~/hooks/useAuth';
import { useAppStore } from '~/entries/contentScript/state';
import ReactionPolicyNotice from '~/entries/contentScript/components/reaction-policy-notice';
import { WINDOW_NAVIGATE } from '~/events';
import StatusNotice from '~/entries/contentScript/components/status-notice';
import ReactionsHistoryNotice from '~/entries/contentScript/components/reactions-history-notice';
import WatchedVideosHeadless from '~/entries/contentScript/components/watched-videos-headless';
import PlayerProgressListenerHeadless from '~/entries/contentScript/components/player-progress-listener-headless';
import { setTheme } from '~/common/bridge';
import LoginButton from '~/components/login-button';
import SubmitSuggestionNotice from '~/entries/contentScript/components/submit-suggestion-notice';
import MarkReactionNotice from '~/entries/contentScript/components/mark-reaction-notice';
import OriginalVideoNotice from '~/entries/contentScript/components/original-video-notice';
import AppContainer from '~/entries/contentScript/components/app-container';
import StreamerModeNotice from '~/entries/contentScript/components/streamer-mode-notice';
import { usePage } from '~/hooks/usePage';
import { useBackgroundEvents } from '~/entries/contentScript/hooks/useBackgroundEvents';
import AnalyticsNotice from '~/entries/contentScript/components/analytics-notice';

function App() {
    const {
        user, loadingAuth, liveStream, login, state, isIncognito,
    } = useAuth();

    const { setCurrentUrl, isDarkMode, isDeviceDarkMode } = useAppStore();

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
                        Get started by logging in with your YouTube account!
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
        >

            {user && (
                <StatusNotice
                    state={state}
                    liveStream={liveStream}
                />
            )}

            {isIncognito && (
                <div className="text-center text-sm">
                    invislbe mode until
                    {' '}
                    {moment(user.extension_invisible_until).format('HH:mm')}
                </div>
            )}

            {state === STATE_OWN_VIDEO && (
                <AnalyticsNotice />
            )}

            {state !== STATE_LIVE && (
                <SubmitSuggestionNotice />
            )}

            <ReactionPolicyNotice />

            {state !== STATE_LIVE && (
                <ReactionsHistoryNotice />
            )}

            <WatchedVideosHeadless />

            <OriginalVideoNotice />

            {state !== STATE_LIVE && (
                <MarkReactionNotice />
            )}

            {state === STATE_LIVE && (
                <StreamerModeNotice />
            )}

            <PlayerProgressListenerHeadless active={!!liveStream && !isIncognito} />

        </AppContainer>
    );
}

export default App;
