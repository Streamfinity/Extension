import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Toaster } from 'react-hot-toast';
import { useAppStore } from '~/entries/contentScript/state';
import Logo from '~/components/Logo';
import DevTools from '~/entries/contentScript/components/DevTools';
import { childrenShape, streamShape } from '~/shapes';
import { STATE_DEFAULT, STATE_LIVE, STATE_OWN_VIDEO } from '~/hooks/useAuth';
import SubwaySurfer from '~/entries/contentScript/components/SubwaySurfer';
import Footer from '~/entries/contentScript/components/Footer';

const dev = import.meta.env.DEV;

function AppContainer({
    children,
    dark,
    user,
    state,
    liveStream = null,
    isTrackingVideos = undefined,
}) {
    const isVisible = useAppStore((storeState) => storeState.isVisible);
    const compact = useAppStore((storeState) => storeState.isCompact);

    const [isNewLayout, setIsNewLayout] = useState(false);
    const [clickedCount, setClickedCount] = useState(0);

    useEffect(() => {
        setIsNewLayout(
            !!document.querySelector('#streamfinity')?.dataset.newLayout,
        );

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
            '@container font-sans',
        )}
        >
            <div className={classNames(
                'mb-4 overflow-y-auto rounded-[12px]',
                !isNewLayout && (compact ? 'bg-gray-300 dark:bg-gray-700' : 'bg-gradient-to-br'),
                isNewLayout ? 'p-px bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.1)]' : 'p-[2px]',
                state === STATE_DEFAULT && 'from-primary-gradient-from to-primary-gradient-to',
                state === STATE_LIVE && 'from-brand-streamer-gradient-from to-brand-streamer-gradient-to',
                state === STATE_OWN_VIDEO && 'from-brand-creator-gradient-from to-brand-creator-gradient-to',
            )}
            >
                <div className={classNames(
                    compact ? 'p-[12px]' : 'p-[16px]',
                    !isNewLayout && 'bg-white dark:bg-black',
                    'relative flex flex-col gap-4 rounded-[10px] text-base text-gray-900 dark:text-white dark:shadow-lg dark:shadow-white/5',
                )}
                >
                    <div className="mb-4 flex items-center justify-between">
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

                    <div className="grid auto-cols-fr items-start gap-4 @[800px]:grid-flow-col">
                        {children}
                    </div>

                    <Footer
                        liveStream={liveStream}
                        state={state}
                    />

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
    liveStream: streamShape,
    isTrackingVideos: PropTypes.bool,
};

AppContainer.defaultProps = {
    user: null,
    dark: false,
    state: STATE_DEFAULT,
};

export default AppContainer;
