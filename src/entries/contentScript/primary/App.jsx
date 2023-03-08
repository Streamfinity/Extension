import './App.css';
import React, { useEffect, useState, useMemo } from 'react';
import browser from 'webextension-polyfill';
import { createLogger } from '~/common/log';
import { DEBUG_DUMP_STORAGE } from '~/messages';
import { useStatus } from '~/hooks/useStatus';

const dev = import.meta.env.DEV;
const log = createLogger('Content-Script');

function App() {
    const {
        user, status, refresh: refreshStatus, loading: loadingStatus,
    } = useStatus();

    log.debug('started');

    const [debugStorage, setDebugStorage] = useState({});

    const isLive = useMemo(() => status?.live_streams?.length > 0, [status]);

    async function checkStorage() {
        setDebugStorage(
            await browser.runtime.sendMessage({ type: DEBUG_DUMP_STORAGE }),
        );
    }

    useEffect(() => {
        const storageInterval = setInterval(checkStorage, 5 * 1000);
        const statusInterval = setInterval(refreshStatus, 30 * 1000);

        return () => {
            clearInterval(storageInterval);
            clearInterval(statusInterval);
        };
    }, []);

    useEffect(() => {
        refreshStatus();
        checkStorage();
    }, []);

    return (
        <div className="mt-4 text-base">

            <div className="flex justify-between">
                <div className="flex gap-4">
                    <div className="flex items-center font-medium rounded-full px-6 h-[36px] bg-yt-button-light">
                        Content Rating
                    </div>
                    <div className="flex items-center font-medium rounded-full px-6 h-[36px] bg-yt-button-light">
                        Mark as reaction
                    </div>
                    <div className="flex items-center font-medium rounded-full px-6 h-[36px] bg-yt-button-light">
                        Submit as suggestion
                    </div>
                </div>
                <div className="flex gap-2">
                    {isLive ? (
                        <div className="flex items-center font-medium rounded-full px-6 h-[36px] bg-red-500 text-white">
                            LIVE
                        </div>
                    ) : (
                        <div className="flex items-center font-medium rounded-full px-6 h-[36px] bg-yt-button-light">
                            Offline
                        </div>
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
                        {user ? (`${user.display_name} (${user.id}})`) : (<span>...</span>)}
                    </div>
                    <hr />
                    <div>
                        <b>Accounts:</b>
                        {' '}
                        {status?.accounts?.map((a) => (
                            <div key={a.id}>{`  - ${a.name} (${a.id})`}</div>
                        ))}
                    </div>
                    <hr />
                    <div>
                        <b>Live:</b>
                        {' '}
                        {status?.live_streams?.map((a) => (
                            <div key={a.id}>{`  - ${a.title} (${a.id})`}</div>
                        ))}
                    </div>
                    <hr />
                    <textarea
                        value={JSON.stringify(debugStorage, null, 4)}
                        readOnly
                        rows={15}
                        className="w-full text-base font-mono"
                    />
                </div>
            )}

        </div>
    );
}

export default App;
