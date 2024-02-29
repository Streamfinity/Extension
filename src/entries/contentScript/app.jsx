import './app.css';
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import useAuth from '~/hooks/useAuth';
import SubmitSuggestionModal from '~/entries/contentScript/components/submit-suggestion-modal';
import DevTools from '~/entries/contentScript/components/dev-tools';
import Overlay from '~/entries/contentScript/components/overlay';
import MarkReactionModal from '~/entries/contentScript/components/mark-reaction-modal';
import { createLogger } from '~/common/log';
import { useAppStore } from '~/entries/contentScript/state';
import ReactionPolicyNotice from '~/entries/contentScript/components/reaction-policy-notice';
import { buildFrontendUrl } from '~/common/utility';
import { childrenShape } from '~/shapes';
import { WINDOW_NAVIGATE } from '~/events';
import { why } from '~/common/pretty';
import LiveStatusNotice from '~/entries/contentScript/components/live-status-notice';
import ReactionsNotice from '~/entries/contentScript/components/reactions-notice';
import WatchedVideosHeadless from '~/entries/contentScript/components/watched-videos-headless';
import PlayerProgressListenerHeadless from '~/entries/contentScript/components/player-progress-listener-headless';
import { useBackgroundEvents } from '~/entries/contentScript/hooks/useBackgroundEvents';
import Logo from '~/components/logo';
import { openSettings, setTheme } from '~/common/bridge';
import LoginButton from '~/components/login-button';
import SubmitSuggestionNotice from '~/entries/contentScript/components/submit-suggestion-notice';
import MarkReactionNotice from '~/entries/contentScript/components/mark-reaction-notice';
import OriginalVideoNotice from '~/entries/contentScript/components/original-video-notice';

const log = createLogger('App');
const dev = import.meta.env.DEV;

function AppContainer({ children, user }) {
    const { appError, isVisible, setAppError } = useAppStore();

    useBackgroundEvents();

    return (
        <div className={classNames(
            !isVisible && 'hidden',
        )}
        >
            <div className="mb-6 overflow-y-auto rounded-[12px] bg-gradient-to-br from-primary-gradient-from to-primary-gradient-to p-[2px]">
                <div className="relative flex flex-col gap-4
                        rounded-[10px] bg-white p-[16px]
                        text-base text-gray-900
                        dark:bg-black dark:text-white
                        dark:shadow-lg dark:shadow-white/5"
                >
                    <div className="mb-4 flex items-center justify-between">
                        <Logo />
                        {user}
                    </div>

                    {appError && (
                        <div className="rounded-xl border border-red-200 bg-red-100 px-4 py-2 text-sm text-red-950">
                            <div className="flex">
                                <div className="grow">
                                    Error:
                                    {' '}
                                    {why(appError)}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setAppError(null)}
                                    className="shrink pl-2 font-bold"
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    )}

                    {children}

                </div>
            </div>

            {dev && (
                <DevTools />
            )}
        </div>
    );
}

AppContainer.propTypes = {
    children: childrenShape.isRequired,
    user: childrenShape,
};

AppContainer.defaultProps = {
    user: null,
};

function App() {
    const {
        user, loadingAuth, liveStream, isLive, login, logout,
    } = useAuth();

    const { setCurrentUrl } = useAppStore();

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

        window.matchMedia('(prefers-color-scheme: dark)')?.addEventListener('change', onChangeScheme);
        window.addEventListener(WINDOW_NAVIGATE, onChangePage);

        return () => {
            window.removeEventListener(WINDOW_NAVIGATE, onChangePage);
            window.matchMedia('(prefers-color-scheme: dark)')?.removeEventListener('change', onChangeScheme);
        };
    }, []);

    // Modals

    function onSuggestionSubmitted() {
        setShowSubmitSuggestionModal(false);
    }

    // User item

    const [toggleLogout, setToggleLogout] = useState(false);

    async function onClickLogout() {
        if (toggleLogout) {
            await logout();
        } else {
            setToggleLogout(true);
        }
    }

    async function onClickSettings() {
        await openSettings();
    }

    useEffect(() => {
        const countdown = setTimeout(() => setToggleLogout(false), 5000);

        return () => {
            clearTimeout(countdown);
        };
    }, [toggleLogout]);

    if (!user) {
        return (
            <AppContainer>
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
        <AppContainer>

            {user && (
                <LiveStatusNotice
                    liveStream={liveStream}
                    isLive={isLive}
                />
            )}

            <SubmitSuggestionNotice onClick={() => setShowSubmitSuggestionModal(true)} />

            <ReactionPolicyNotice />

            <ReactionsNotice />

            <WatchedVideosHeadless />

            <OriginalVideoNotice />

            <MarkReactionNotice onClick={() => setShowMarkReactionModal(true)} />

            <PlayerProgressListenerHeadless />

            {user && (
                <div className="flex gap-4 text-sm font-medium text-gray-500">
                    <a
                        href={buildFrontendUrl('/dashboard')}
                        target="_blank"
                        rel="noreferrer"
                        className="grow"
                    >
                        Your Streamfinity Dashboard
                    </a>
                    <button
                        onClick={onClickSettings}
                        type="button"
                    >
                        Settings
                    </button>
                    <button
                        onClick={onClickLogout}
                        type="button"
                    >
                        <div className="relative flex cursor-pointer overflow-hidden">
                            {toggleLogout && (
                                <div className="absolute left-0 top-0 flex size-full items-center justify-center">
                                    Logout
                                </div>
                            )}
                            <div className={classNames(toggleLogout && 'invisible')}>
                                {user.display_name}
                            </div>
                        </div>
                    </button>
                </div>
            )}

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
