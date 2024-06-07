import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Toaster } from 'react-hot-toast';
import { useAppStore } from '~/entries/contentScript/state';
import Logo from '~/components/Logo';
import DevTools from '~/entries/contentScript/components/DevTools';
import { childrenShape } from '~/shapes';
import { STATE_DEFAULT, STATE_LIVE, STATE_OWN_VIDEO } from '~/hooks/useAuth';
import SubwaySurfer from '~/entries/contentScript/components/SubwaySurfer';

const dev = import.meta.env.DEV;

function AppContainer({
    children,
    dark,
    user,
    state,
    isTrackingVideos = undefined,
}) {
    const isVisible = useAppStore((storeState) => storeState.isVisible);
    const compact = useAppStore((storeState) => storeState.isCompact);

    const [clickedCount, setClickedCount] = useState(0);

    useEffect(() => {
        const clearClicks = setTimeout(() => {
            if (clickedCount < 5) {
                setClickedCount(0);
            }
        }, 5000);

        return () => {
            clearTimeout(clearClicks);
        };
    }, [clickedCount]);

    return (
        <main className={classNames(
            !isVisible && 'hidden',
            dark && 'dark',
            'font-sans',
        )}
        >
            <div className={classNames(
                'mb-4 overflow-y-auto',
                compact ? 'bg-transparent' : 'bg-gradient-to-br rounded-[12px] p-[2px]',
                state === STATE_DEFAULT && 'from-primary-gradient-from to-primary-gradient-to',
                state === STATE_LIVE && 'from-brand-streamer-gradient-from to-brand-streamer-gradient-to',
                state === STATE_OWN_VIDEO && 'from-brand-creator-gradient-from to-brand-creator-gradient-to',
            )}
            >
                <div className={classNames(
                    'relative flex flex-col gap-4 text-base text-gray-900 dark:text-white',
                    !compact && 'p-[16px] rounded-[10px] bg-white dark:bg-black dark:shadow-lg dark:shadow-white/5',
                )}
                >
                    <div className="mb-2 flex items-center justify-between">
                        <Logo
                            onClick={() => setClickedCount((prev) => prev + 1)}
                            isTrackingVideos={isTrackingVideos}
                            sws
                        />
                        {user}
                    </div>

                    {clickedCount >= 5 && (
                        <SubwaySurfer onClose={() => setClickedCount(0)} />
                    )}

                    {children}

                    <Toaster
                        containerStyle={{ position: 'absolute' }}
                        toastOptions={{
                            position: 'top-center',
                            className: 'bg-blue-500',
                            style: {
                                padding: '.75rem 1.25rem',
                            },
                            success: {
                                duration: 4000,
                                className: '!bg-green-600 !text-white rounded-xl',
                                iconTheme: {
                                    primary: 'white',
                                    secondary: 'green',
                                },
                            },
                            error: {
                                duration: 6500,
                                className: '!bg-red-600 !text-white rounded-xl',
                                iconTheme: {
                                    primary: 'white',
                                    secondary: 'red',
                                },
                            },
                        }}
                    />

                </div>
            </div>

            {dev && (
                <DevTools />
            )}
        </main>
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
    isTrackingVideos: PropTypes.bool,
};

AppContainer.defaultProps = {
    user: null,
    dark: false,
    state: STATE_DEFAULT,
};

export default AppContainer;
