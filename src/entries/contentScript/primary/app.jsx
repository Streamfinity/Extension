import './app.css';
import React, { useEffect, useState } from 'react';
import { useStatus } from '~/hooks/useStatus';
import { loginUrl, buildUrl } from '~/hooks/useAuth';
import SubmitSuggestionModal from '~/entries/contentScript/primary/components/submit-suggestion-modal';
import Card from '~/entries/contentScript/primary/components/card';
import H2Header from '~/entries/contentScript/primary/components/h2-header';
import Button from '~/entries/contentScript/primary/components/button';
import DevTools from '~/entries/contentScript/primary/components/dev-tools';
import Overlay from '~/entries/contentScript/primary/components/overlay';

const dev = import.meta.env.DEV;

function App() {
    const {
        user, status, refresh: refreshStatus, loading: loadingStatus, hasData, isLive,
    } = useStatus();

    const [showSubmitSuggestionModal, setShowSubmitSuggestionModal] = useState(false);

    useEffect(() => {
        const statusInterval = setInterval(refreshStatus, 5 * 1000);

        return () => {
            clearInterval(statusInterval);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        refreshStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    return (
        <div className="relative mb-6 text-base bg-gray-800 rounded-[10px] p-[12px] text-white shadow-md">

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
                        className="relative flex gap-4 bg-gray-700 px-4 rounded-full py-2 overflow-hidden cursor-pointer"
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
                <Card>
                    Live Status:
                    {' '}
                    {!isLive && (<span className="text-red-500">Offline</span>)}
                    {isLive && (
                        <a
                            href={buildUrl('/dashboard/streams')}
                            target="_blank"
                            className="flex items-center font-medium rounded-full px-6 h-[36px] bg-red-500 text-white"
                            rel="noreferrer"
                        >
                            LIVE
                        </a>
                    )}
                </Card>
            )}

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
                <Button color="gray">
                    Mark as reaction
                </Button>
                <Button
                    color="gray"
                    onClick={() => setShowSubmitSuggestionModal(true)}
                >
                    Submit as suggestion
                </Button>
            </div>

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
