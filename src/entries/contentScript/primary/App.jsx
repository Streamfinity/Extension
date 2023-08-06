import './App.css';
import React, { useEffect, useState, useMemo } from 'react';
import browser from 'webextension-polyfill';
import { DEBUG_DUMP_STORAGE } from '~/messages';
import { useStatus } from '~/hooks/useStatus';
import { loginUrl, buildUrl } from '~/hooks/useAuth';
import SubmitSuggestionModal from '~/entries/contentScript/primary/components/SubmitSuggestionModal';
import { childrenShape } from '~/shapes';

const dev = import.meta.env.DEV;

function Card({ children }) {
    return (
        <div className="p-4 bg-gray-700 rounded-md">
            {children}
        </div>
    );
}

Card.propTypes = {
    children: childrenShape.isRequired,
};

function App() {
    const {
        user, status, refresh: refreshStatus, loading: loadingStatus, hasData,
    } = useStatus();

    const [showDebugStorage, setShowDebugStorage] = useState(false);
    const [debugStorage, setDebugStorage] = useState({});

    const [showSubmitSuggestionModal, setShowSubmitSuggestionModal] = useState(false);

    const isLive = useMemo(() => status?.live_streams?.length > 0, [status]);

    async function checkStorage() {
        setDebugStorage(
            await browser.runtime.sendMessage({ type: DEBUG_DUMP_STORAGE }),
        );
    }

    useEffect(() => {
        const storageInterval = setInterval(checkStorage, 5 * 1000);
        const statusInterval = setInterval(refreshStatus, 5 * 1000);

        return () => {
            clearInterval(storageInterval);
            clearInterval(statusInterval);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        refreshStatus();
        checkStorage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function onSuggestionSubmitted() {
        setShowSubmitSuggestionModal(false);
    }

    return (
        <div className="mb-6 text-base bg-gray-800 rounded-[10px] p-[12px] text-white shadow-md">

            {showSubmitSuggestionModal && (
                <SubmitSuggestionModal onSubmit={() => onSuggestionSubmitted()} />
            )}

            <div className="flex justify-between">
                <div className="text-4xl font-semibold mb-4">
                    Streamfinity
                </div>
                <div>
                    logged
                </div>
            </div>

            <Card>
                asd
            </Card>

            <div className="flex justify-between">
                <div className="flex gap-4">
                    <div className="flex items-center font-medium rounded-full px-6 h-[36px] bg-yt-button-light">
                        Content Rating
                    </div>
                    <div className="flex items-center font-medium rounded-full px-6 h-[36px] bg-yt-button-light">
                        Mark as reaction
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowSubmitSuggestionModal(true)}
                        className="flex items-center font-medium rounded-full px-6 h-[36px] bg-yt-button-light"
                    >
                        Submit as suggestion
                    </button>
                </div>
                <div className="flex gap-2">
                    {hasData && (
                        <>
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

                            {!isLive && (
                                <div className="flex items-center font-medium rounded-full px-6 h-[36px] bg-yt-button-light">
                                    Offline
                                </div>
                            )}
                        </>
                    )}

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
                <div className="relative p-2 pt-6 mt-6 mb-2 border-2 border-red-600 rounded-md overflow-hidden">
                    <div className="absolute left-0 top-0 px-2 text-sm bg-red-600 text-white font-medium uppercase rounded-br-md leading-normal">
                        Streamfinity Dev Tools
                    </div>
                    <div>
                        <b>Logged in as:</b>
                        {' '}
                        {user ? (
                            <>
                                <span>{user.display_name}</span>
                                {' '}
                                <span className="opacity-50">{`(${user.id})`}</span>
                            </>
                        ) : (<span>...</span>)}
                    </div>
                    <hr />
                    <div>
                        <b>Accounts:</b>
                        {' '}
                        {status?.accounts?.map((a) => (
                            <div key={a.id}>
                                {`  - ${a.name}`}
                                {' '}
                                <span className="opacity-50">{`(${a.id})`}</span>
                            </div>
                        ))}
                    </div>
                    <hr />
                    <div>
                        <b>Live:</b>
                        {' '}
                        {!isLive && 'not live'}
                        {status?.live_streams?.map((a) => (
                            <div key={a.id}>{`  - ${a.title} (${a.id})`}</div>
                        ))}
                    </div>
                    <hr />
                    {showDebugStorage ? (
                        <textarea
                            value={JSON.stringify(debugStorage, null, 4)}
                            readOnly
                            rows={15}
                            className="w-full text-base font-mono"
                        />
                    ) : (
                        <button
                            type="button"
                            onClick={() => setShowDebugStorage(true)}
                            className="underline"
                        >
                            Show storage debug
                        </button>
                    )}
                </div>
            )}

        </div>
    );
}

export default App;
