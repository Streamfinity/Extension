import './App.css';
import browser from 'webextension-polyfill';
import { useEffect, useState, useMemo } from 'react';
import { createLogger } from '~/common/log';
import { GET_STATUS, DEBUG_DUMP_STORAGE } from '~/messages';

const dev = import.meta.env.DEV;
const log = createLogger('Content-Script');

function App() {
    const [status, setStatus] = useState([]);
    const [loadingStatus, setLoadingStatus] = useState(true);
    const [user, setUser] = useState(null);

    const isLive = useMemo(() => status?.live_streams?.length > 0, []);

    async function checkStatus() {
        const response = await browser.runtime.sendMessage({ type: GET_STATUS });

        log.debug('status', response);

        setStatus(response.status);
        setUser(response.user);

        setLoadingStatus(false);
    }

    const [debugStorage, setDebugStorage] = useState({});

    useEffect(() => {
        const interval = setInterval(async () => {
            setDebugStorage(
                await browser.runtime.sendMessage({ type: DEBUG_DUMP_STORAGE }),
            );
        }, 2000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <div className="mt-4 text-base">

            <div className="flex justify-between">
                <div className="flex gap-4">
                    <div className="flex items-center font-medium rounded-full px-4 h-[36px] bg-yt-button-light">
                        Content Rating
                    </div>
                    <div className="flex items-center font-medium rounded-full px-4 h-[36px] bg-yt-button-light">
                        Mark as reaction
                    </div>
                    <div className="flex items-center font-medium rounded-full px-4 h-[36px] bg-yt-button-light">
                        Submit as suggestion
                    </div>
                </div>
                <div className="flex gap-2">
                    {isLive ? (
                        <div className="flex items-center font-medium rounded-full px-4 h-[36px] bg-red-500 text-white">
                            LIVE
                        </div>
                    ) : (
                        <div className="flex items-center font-medium rounded-full px-4 h-[36px] bg-yt-button-light">
                            Offline
                        </div>
                    )}

                    {loadingStatus && (
                        <button
                            type="button"
                            onClick={checkStatus}
                            className="flex items-center font-medium rounded-full px-4 h-[36px] bg-yt-button-light"
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
                            <div>{`  - ${a.name} (${a.id})`}</div>
                        ))}
                    </div>
                    <hr />
                    <div>
                        <b>Live:</b>
                        {' '}
                        {status?.live_streams?.map((a) => (
                            <div>{`  - ${a.title} (${a.id})`}</div>
                        ))}
                    </div>
                    <hr />
                    <textarea
                        value={JSON.stringify(debugStorage, null, 4)}
                        readOnly
                        rows={15}
                        className="w-full font-mono"
                    />
                </div>
            )}

        </div>
    );
}

export default App;
