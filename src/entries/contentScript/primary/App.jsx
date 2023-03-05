import './App.css';
import browser from 'webextension-polyfill';
import { useEffect, useState } from 'react';
import { createLogger } from '~/common/log';
import { GET_STATUS, DEBUG_DUMP_STORAGE } from '~/messages';

const log = createLogger('Content-Script');

function App() {
    const dev = import.meta.env.DEV;
    log.debug('content script react', { dev });

    async function checkStatus() {
        const status = await browser.runtime.sendMessage({ type: GET_STATUS });

        log.debug('status', status);
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
                    <div className="flex items-center bg-yt-button-light font-medium rounded-full px-4 h-[36px]">
                        Content Rating
                    </div>
                    <div className="flex items-center bg-yt-button-light font-medium rounded-full px-4 h-[36px]">
                        Mark as reaction
                    </div>
                    <div className="flex items-center bg-yt-button-light font-medium rounded-full px-4 h-[36px]">
                        Submit as suggestion
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="flex items-center font-medium rounded-full px-4 h-[36px] bg-red-500">
                        LIVE
                    </div>
                    <button
                        type="button"
                        onClick={checkStatus}
                        className="flex items-center bg-yt-button-light font-medium rounded-full px-4 h-[36px]"
                    >
                        Streamfinity
                    </button>
                </div>
            </div>

            {dev && (
                <div className="relative p-2 pt-6 mt-6 mb-2 border-2 border-red-600 rounded-md overflow-hidden">
                    <div className="absolute left-0 top-0 px-2 text-sm bg-red-600 text-white font-medium uppercase rounded-br-md leading-normal">
                        Streamfinity Dev Tools
                    </div>
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
