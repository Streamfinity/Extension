import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useAppStore, MESSAGE_ERROR, MESSAGE_SUCCESS } from '~/entries/contentScript/state';
import { useBackgroundEvents } from '~/entries/contentScript/hooks/useBackgroundEvents';
import Logo from '~/components/logo';
import { why } from '~/common/pretty';
import DevTools from '~/entries/contentScript/components/dev-tools';
import { childrenShape } from '~/shapes';
import { STATE_DEFAULT, STATE_LIVE, STATE_OWN_VIDEO } from '~/hooks/useAuth';

const dev = import.meta.env.DEV;

function AppContainer({
    children, dark, user, state,
}) {
    const { appMessage, isVisible, setAppMessage } = useAppStore();

    useBackgroundEvents();

    return (
        <div className={classNames(
            !isVisible && 'hidden',
            dark && 'dark',
        )}
        >
            <div className={classNames(
                'mb-6 overflow-y-auto rounded-[12px] bg-gradient-to-br p-[2px]',
                state === STATE_DEFAULT && 'from-primary-gradient-from to-primary-gradient-to',
                state === STATE_LIVE && 'from-brand-streamer-gradient-from to-brand-streamer-gradient-to',
                state === STATE_LIVE && 'from-brand-creator-gradient-from to-brand-creator-gradient-to',
            )}
            >
                <div className="relative flex flex-col gap-4
                        rounded-[10px] bg-white p-[16px]
                        text-base text-gray-900
                        dark:bg-black dark:text-white
                        dark:shadow-lg dark:shadow-white/5"
                >
                    <div className="mb-4 flex items-center justify-between">
                        <Logo />
                        {user}
                    </div>

                    {appMessage && (
                        <div className={classNames(
                            'rounded-xl border px-4 py-2 text-sm',
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
    dark: PropTypes.bool,
    state: PropTypes.oneOf([
        STATE_DEFAULT,
        STATE_LIVE,
        STATE_OWN_VIDEO,
    ]),
};

AppContainer.defaultProps = {
    user: null,
    dark: false,
    state: STATE_DEFAULT,
};

export default AppContainer;
