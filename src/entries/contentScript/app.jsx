import './app.css';
import React, { useEffect, useState } from 'react';
import useAuth, { STATE_LIVE } from '~/hooks/useAuth';
import SubmitSuggestionModal from '~/entries/contentScript/components/submit-suggestion-modal';
import Overlay from '~/entries/contentScript/components/overlay';
import MarkReactionModal from '~/entries/contentScript/components/mark-reaction-modal';
import { createLogger } from '~/common/log';
import { useAppStore } from '~/entries/contentScript/state';
import ReactionPolicyNotice from '~/entries/contentScript/components/reaction-policy-notice';
import { WINDOW_NAVIGATE, THEME_CHANGE } from '~/events';
import StatusNotice from '~/entries/contentScript/components/status-notice';
import ReactionsNotice from '~/entries/contentScript/components/reactions-notice';
import WatchedVideosHeadless from '~/entries/contentScript/components/watched-videos-headless';
import PlayerProgressListenerHeadless from '~/entries/contentScript/components/player-progress-listener-headless';
import { setTheme } from '~/common/bridge';
import LoginButton from '~/components/login-button';
import SubmitSuggestionNotice from '~/entries/contentScript/components/submit-suggestion-notice';
import MarkReactionNotice from '~/entries/contentScript/components/mark-reaction-notice';
import OriginalVideoNotice from '~/entries/contentScript/components/original-video-notice';
import AppContainer from '~/entries/contentScript/components/app-container';

const log = createLogger('App');

function App() {
    const {
        user, loadingAuth, liveStream, login, state,
    } = useAuth();

    const { setCurrentUrl } = useAppStore();

    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [showMarkReactionModal, setShowMarkReactionModal] = useState(false);
    const [showSubmitSuggestionModal, setShowSubmitSuggestionModal] = useState(false);

    // Location navigation listener

    function isDarkMode() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    function onChangeScheme() {
        setTheme({ isDark: isDarkMode() });
    }

    useEffect(() => {
        onChangeScheme();
        setCurrentUrl(window.location.href);

        /** @param {CustomEvent} event */
        function onChangePage(event) {
            setCurrentUrl(event.detail.currentUrl);
        }

        /** @param {CustomEvent} event */
        function onThemeChange(event) {
            setIsDarkTheme(event.detail.dark);
        }

        window.matchMedia('(prefers-color-scheme: dark)')?.addEventListener('change', onChangeScheme);
        window.addEventListener(WINDOW_NAVIGATE, onChangePage);
        window.addEventListener(THEME_CHANGE, onThemeChange);

        return () => {
            window.removeEventListener(WINDOW_NAVIGATE, onChangePage);
            window.removeEventListener(THEME_CHANGE, onThemeChange);
            window.matchMedia('(prefers-color-scheme: dark)')?.removeEventListener('change', onChangeScheme);
        };
    }, []);

    // Modals

    function onSuggestionSubmitted() {
        setShowSubmitSuggestionModal(false);
    }

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
            <AppContainer dark={isDarkTheme}>
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
            dark={isDarkTheme}
            state={state}
        >

            {user && (
                <StatusNotice
                    state={state}
                    liveStream={liveStream}
                />
            )}

            {state !== STATE_LIVE && (
                <SubmitSuggestionNotice onClick={() => setShowSubmitSuggestionModal(true)} />
            )}

            <ReactionPolicyNotice />

            <ReactionsNotice />

            <WatchedVideosHeadless />

            <OriginalVideoNotice />

            {state !== STATE_LIVE && (
                <MarkReactionNotice onClick={() => setShowMarkReactionModal(true)} />
            )}

            <PlayerProgressListenerHeadless />

            {showMarkReactionModal && (
                <Overlay
                    title="Mark Reaction"
                    onHide={() => setShowMarkReactionModal(false)}
                >
                    <MarkReactionModal onSubmitted={() => setShowMarkReactionModal(false)} />
                </Overlay>
            )}

            {showSubmitSuggestionModal && (
                <Overlay
                    title="Submit Suggestion"
                    onHide={() => setShowSubmitSuggestionModal(false)}
                >
                    <SubmitSuggestionModal onSubmit={() => onSuggestionSubmitted()} />
                </Overlay>
            )}

        </AppContainer>
    );
}

export default App;
