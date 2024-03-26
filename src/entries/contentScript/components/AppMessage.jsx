import React from 'react';
import classNames from 'classnames';
import { useShallow } from 'zustand/react/shallow';
import { useAppStore, MESSAGE_ERROR, MESSAGE_SUCCESS } from '~/entries/contentScript/state';
import { why } from '~/common/pretty';

function AppMessage() {
    const [appMessage, setAppMessage] = useAppStore(
        useShallow((state) => [state.appMessage, state.setAppMessage]),
    );

    if (!appMessage) {
        return null;
    }

    return (
        <div className={classNames(
            'rounded-xl border px-4 py-2 text-sm mb-4',
            appMessage.type === MESSAGE_ERROR && 'border-red-200 bg-red-100 text-red-950',
            appMessage.type === MESSAGE_SUCCESS && 'border-green-200 bg-green-100 text-green-950',
        )}
        >
            <div className="flex">
                <div className="grow">
                    {appMessage.type === MESSAGE_ERROR && (
                        <>
                            Error:
                            {' '}
                        </>
                    )}
                    {why(appMessage.message)}
                </div>
                <button
                    type="button"
                    onClick={() => setAppMessage(null)}
                    className="shrink pl-2 font-bold"
                >
                    OK
                </button>
            </div>
        </div>
    );
}

AppMessage.propTypes = {};

AppMessage.defaultProps = {};

export default AppMessage;
