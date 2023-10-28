import './app.css';
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useStatus } from '~/hooks/useStatus';
import { loginUrl, buildUrl } from '~/hooks/useAuth';
import SubmitSuggestionModal from '~/entries/contentScript/primary/components/submit-suggestion-modal';
import H2Header from '~/entries/contentScript/primary/components/h2-header';
import Button from '~/entries/contentScript/primary/components/button';
import DevTools from '~/entries/contentScript/primary/components/dev-tools';
import Overlay from '~/entries/contentScript/primary/components/overlay';
import MarkReactionModal from '~/entries/contentScript/primary/components/mark-reaction-modal';
import { createLogger } from '~/common/log';
import { useAppStore } from '~/entries/contentScript/primary/state';
import { getReactionPolicyForVideo } from '~/common/bridge';
import { reactionPolicyEnum } from '~/enums';
import ReactionPolicyNotice from '~/entries/contentScript/primary/components/reaction-policy-notice';

const log = createLogger('App');
const dev = import.meta.env.DEV;

function App() {
    const {
        user, refresh: refreshStatus, loading: loadingStatus, hasData, isLive,
    } = useStatus();

    const {
        setCurrentUrl, currentUrl, setReactionPolicy, reactionPolicy,
    } = useAppStore();

    const [showMarkReactionModal, setShowMarkReactionModal] = useState(false);
    const [showSubmitSuggestionModal, setShowSubmitSuggestionModal] = useState(false);

    useEffect(() => {
        const statusInterval = setInterval(refreshStatus, 5 * 1000);

        /** @param {CustomEvent} event */
        function onChangePage(event) {
            setCurrentUrl(event.detail.currentUrl);
        }

        window.addEventListener('pushstate', onChangePage);

        return () => {
            clearInterval(statusInterval);
            window.removeEventListener('pushstate', onChangePage);
        };
    }, []);

    useEffect(() => {
        async function fetchPolicy() {
            try {
                const { data: policy } = await getReactionPolicyForVideo(currentUrl);

                setReactionPolicy(policy);
                log.debug('reaction-policy', policy);
            } catch (err) {
                log.warn('error fetching reaction policy', err);
                setReactionPolicy(null);
            }
        }

        if (currentUrl) {
            fetchPolicy();
        }
    }, [currentUrl]);

    useEffect(() => {
        refreshStatus();
        setCurrentUrl(window.location.href);
    }, []);

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

    console.log(reactionPolicy);

    return (
        <div className="relative mb-6 text-base border border-neutral-700 bg-neutral-800/30 rounded-[10px] p-[12px] text-white shadow-lg shadow-white/5 overflow-y-auto">

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

            <div className="flex justify-between items-center mb-4">
                <div className="text-4xl font-semibold">
                    Streamfinity
                </div>
                {user && (
                    <div
                        onClick={() => setToggleLogout(true)}
                        className="relative flex gap-4 border border-neutral-700 bg-neutral-700/30 px-4 rounded-full py-2 overflow-hidden cursor-pointer"
                    >
                        {toggleLogout && (
                            <button
                                type="button"
                                className="absolute left-0 top-0 w-full h-full  flex items-center justify-center bg-gray-700"
                            >
                                Logout
                            </button>
                        )}
                        <div className="h-6 w-6 bg-gray-600 rounded-full" />
                        {user.display_name}
                    </div>
                )}
            </div>

            {hasData && (
                <div>
                    {isLive ? (
                        <div>
                            <a
                                href={buildUrl('/dashboard/streams')}
                                target="_blank"
                                className="flex items-center font-medium rounded-full px-6 h-[36px] bg-red-500 text-white"
                                rel="noreferrer"
                            >
                                LIVE
                            </a>
                        </div>
                    ) : (
                        <div className="py-1 rounded-full border border-neutral-700 bg-neutral-700/30 text-center text-sm text-white/60">
                            You are currently offline
                        </div>
                    )}
                </div>
            )}

            {reactionPolicy && (
                <ReactionPolicyNotice policy={reactionPolicy} />
            )}

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

            <div className="flex justify-between">
                <div className="flex gap-2">
                    {(!loadingStatus && !user) && (
                        <a
                            href={loginUrl}
                            target="_blank"
                            className="flex items-center font-medium rounded-full px-6 h-[36px] bg-primary-500 text-white"
                            rel="noreferrer"
                        >
                            Login with Streamfinity
                        </a>
                    )}

                    {loadingStatus && (
                        <button
                            type="button"
                            onClick={refreshStatus}
                            className="flex items-center font-medium rounded-full px-6 h-[36px] bg-yt-button-light"
                        >
                            Loading...
                        </button>
                    )}
                </div>
            </div>

            {dev && (
                <DevTools />
            )}

        </div>
    );
}

export default App;
