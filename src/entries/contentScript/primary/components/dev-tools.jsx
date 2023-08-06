import React, { useState, useEffect } from 'react';
import browser from 'webextension-polyfill';
import { DEBUG_DUMP_STORAGE } from '~/messages';
import { useStatus } from '~/hooks/useStatus';

function DevTools() {
    const [showDebugStorage, setShowDebugStorage] = useState(false);
    const [debugStorage, setDebugStorage] = useState({});

    async function checkStorage() {
        setDebugStorage(
            await browser.runtime.sendMessage({ type: DEBUG_DUMP_STORAGE }),
        );
    }

    const {
        user, status, isLive,
    } = useStatus();

    useEffect(() => {
        const storageInterval = setInterval(checkStorage, 5 * 1000);

        return () => {
            clearInterval(storageInterval);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
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
                    className="w-full text-base font-mono text-black"
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
    );
}

DevTools.propTypes = {};

DevTools.defaultProps = {};

export default DevTools;
