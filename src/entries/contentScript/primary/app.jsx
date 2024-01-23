import './app.css';
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import useAuth from '~/hooks/useAuth';
import SubmitSuggestionModal from '~/entries/contentScript/primary/components/submit-suggestion-modal';
import Button from '~/entries/contentScript/primary/components/button';
import DevTools from '~/entries/contentScript/primary/components/dev-tools';
import Overlay from '~/entries/contentScript/primary/components/overlay';
import MarkReactionModal from '~/entries/contentScript/primary/components/mark-reaction-modal';
import { createLogger } from '~/common/log';
import { useAppStore } from '~/entries/contentScript/primary/state';
import ReactionPolicyNotice from '~/entries/contentScript/primary/components/reaction-policy-notice';
import { buildFrontendUrl } from '~/common/utility';
import { childrenShape } from '~/shapes';
import { WINDOW_NAVIGATE } from '~/events';
import Card from '~/entries/contentScript/primary/components/card';
import { why } from '~/common/pretty';
import LiveStatusNotice from '~/entries/contentScript/primary/components/live-status-notice';
import ReactionsNotice from '~/entries/contentScript/primary/components/reactions-notice';
import WatchedVideosHeadless from '~/entries/contentScript/primary/components/watched-videos-headless';
import PlayerProgressListenerHeadless from '~/entries/contentScript/primary/components/player-progress-listener-headless';
import logo from '~/assets/Logo-Dark-400.png';

const log = createLogger('App');
const dev = import.meta.env.DEV;

function AppContainer({ children, user }) {
    const { appError, setAppError } = useAppStore();
    const imageUrl = new URL(logo, import.meta.url).href;

    return (
        <div>
            <div className="p-[2px] mb-6 rounded-[12px] overflow-y-auto bg-gradient-to-br from-primary-gradient-from to-primary-gradient-to">
                <div className="relative text-base rounded-[10px] p-[16px]
                        flex flex-col gap-4
                        bg-white dark:bg-neutral-800/30 dark:border dark:border-neutral-700
                        text-gray-900 dark:text-white
                        dark:shadow-lg dark:shadow-white/5"
                >
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-4">
                            <img
                                src={imageUrl}
                                className="h-9 w-9"
                                alt="Logo"
                            />
                            <div className="text-4xl font-semibold">
                                Streamfinity Copilot
                            </div>
                        </div>
                        {user}
                    </div>

                    {appError && (
                        <div className="px-4 py-2 bg-red-100 border border-red-200 rounded-xl text-sm text-red-950">
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

                    <button
                        type="button"
                        onClick={login}
                        disabled={loadingAuth}
                        className={classNames(
                            loadingAuth && 'opacity-50',
                            'w-full font-medium rounded-full px-6 h-[36px] bg-gradient-to-r from-primary-gradient-from to-primary-gradient-to hover:bg-primary-600 transition-colors text-center text-black',
                        )}
                    >
                        {loadingAuth ? 'Loading...' : 'Login with Streamfinity'}
                    </button>

                    <p className="text-sm text-gray-500">
                        By logging in you aggree to our Terms of Service and Privacy Policy.
                    </p>

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

            <ReactionPolicyNotice />

            <ReactionsNotice />

            <WatchedVideosHeadless />

            <PlayerProgressListenerHeadless />

            {user && (
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <Card className="flex flex-col gap-4">
                        <h3 className="text-base font-medium">
                            Reaction
                        </h3>
                        <p>
                            If this video is a reaction to another type of content, you can help use by
                            providing information.
                        </p>
                        <div className="flex grow items-end">
                            <Button
                                color="gray"
                                className="w-full"
                                onClick={() => setShowMarkReactionModal(true)}
                            >
                                Mark as Reaction
                            </Button>
                        </div>
                    </Card>
                    <Card className="flex flex-col gap-4">
                        <h3 className="text-base font-medium">
                            Suggestion
                        </h3>
                        <p>
                            You can submit this video as a suggestion to your favorite streamers.
                        </p>
                        <div className="flex grow items-end">
                            <Button
                                color="gray"
                                className="w-full"
                                onClick={() => setShowSubmitSuggestionModal(true)}
                            >
                                Submit as Suggestion
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            {user && (
                <div className="flex gap-4 text-sm text-gray-500 font-medium">
                    <a
                        href={buildFrontendUrl('/dashboard')}
                        target="_blank"
                        rel="noreferrer"
                        className="grow"
                    >
                        Your Streamfinity Dashboard
                    </a>
                    <button
                        onClick={onClickLogout}
                        type="button"
                    >
                        <div className="relative flex overflow-hidden cursor-pointer">
                            {toggleLogout && (
                                <div className="absolute left-0 top-0 w-full h-full flex items-center justify-center">
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
