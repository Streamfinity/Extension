import './app.css';
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import useAuth from '~/hooks/useAuth';
import SubmitSuggestionModal from '~/entries/contentScript/primary/components/submit-suggestion-modal';
import H2Header from '~/entries/contentScript/primary/components/h2-header';
import Button from '~/entries/contentScript/primary/components/button';
import DevTools from '~/entries/contentScript/primary/components/dev-tools';
import Overlay from '~/entries/contentScript/primary/components/overlay';
import MarkReactionModal from '~/entries/contentScript/primary/components/mark-reaction-modal';
import { createLogger } from '~/common/log';
import { useAppStore } from '~/entries/contentScript/primary/state';
import ReactionPolicyNotice from '~/entries/contentScript/primary/components/reaction-policy-notice';
import { buildFrontendUrl } from '~/common/utility';
import ContentRatingNotice from '~/entries/contentScript/primary/components/content-rating-notice';
import { childrenShape } from '~/shapes';
import { WINDOW_NAVIGATE } from '~/events';
import Card from '~/entries/contentScript/primary/components/card';
import { why } from '~/common/pretty';
import LiveStatusNotice from '~/entries/contentScript/primary/components/live-status-notice';

const log = createLogger('App');
const dev = import.meta.env.DEV;

function AppContainer({ children, user }) {
    const { appError, setAppError } = useAppStore();

    return (
        <div className="relative mb-6 text-base rounded-[10px] p-[12px] overflow-y-auto
                        flex flex-col gap-4
                        bg-black/[0.05] dark:bg-neutral-800/30 dark:border dark:border-neutral-700
                        text-gray-900 dark:text-white
                        dark:shadow-lg dark:shadow-white/5"
        >
            <div className="flex justify-between items-center mb-4">
                <div className="text-4xl font-semibold">
                    Streamfinity
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
        user, refreshUserData, loading: loadingStatus, hasData, isLive, login, logout,
    } = useAuth();

    const { setCurrentUrl } = useAppStore();

    const [showMarkReactionModal, setShowMarkReactionModal] = useState(false);
    const [showSubmitSuggestionModal, setShowSubmitSuggestionModal] = useState(false);

    // Location navigation listener

    useEffect(() => {
        const statusInterval = setInterval(refreshUserData, 5 * 1000);

        setCurrentUrl(window.location.href);

        /** @param {CustomEvent} event */
        function onChangePage(event) {
            setCurrentUrl(event.detail.currentUrl);
        }

        window.addEventListener(WINDOW_NAVIGATE, onChangePage);

        return () => {
            clearInterval(statusInterval);
            window.removeEventListener(WINDOW_NAVIGATE, onChangePage);
        };
    }, []);

    // Initial user data loading

    useEffect(() => {
        refreshUserData();
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

                    <ContentRatingNotice />

                    <p className="text-sm text-gray-500">
                        Get started by logging in with your YouTube account!
                    </p>

                    <button
                        type="button"
                        onClick={login}
                        disabled={loadingStatus}
                        className={classNames(
                            loadingStatus && 'opacity-50',
                            'w-full font-medium rounded-full px-6 h-[36px] bg-primary-500 hover:bg-primary-600 transition-colors text-center text-white',
                        )}
                    >
                        {loadingStatus ? 'Loading...' : 'Login with Streamfinity'}
                    </button>

                    <p className="text-sm text-gray-500">
                        By logging in you aggree to our Terms of Service and Privacy Policy.
                    </p>

                </div>
            </AppContainer>
        );
    }

    return (
        <AppContainer user={(
            <button
                onClick={onClickLogout}
                type="button"
            >
                <Card className="relative flex gap-4 px-4 py-2 rounded-full overflow-hidden cursor-pointer">
                    {toggleLogout && (
                        <div className="absolute left-0 top-0 w-full h-full flex items-center justify-center">
                            Logout
                        </div>
                    )}
                    <div className={classNames(toggleLogout && 'invisible')}>
                        {user.display_name}
                    </div>
                </Card>
            </button>
        )}
        >

            {hasData && (
                <LiveStatusNotice isLive={isLive} />
            )}

            <ReactionPolicyNotice />

            <ContentRatingNotice />

            {user && (
                <>

                    <H2Header>
                        Content Rating
                    </H2Header>

                    <Button color="gray">
                        Add Rating
                    </Button>

                    <H2Header>
                        Actions
                    </H2Header>

                    <div className="flex gap-4">
                        <Button
                            color="gray"
                            onClick={() => setShowMarkReactionModal(true)}
                        >
                            Mark as reaction
                        </Button>
                        <Button
                            color="gray"
                            onClick={() => setShowSubmitSuggestionModal(true)}
                        >
                            Submit as suggestion
                        </Button>
                    </div>

                </>
            )}

            {hasData && (
                <a
                    href={buildFrontendUrl('/dashboard')}
                    target="_blank"
                    rel="noreferrer"
                >
                    <Card rounded>
                        Your Streamfinity Dashboard
                    </Card>
                </a>
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
