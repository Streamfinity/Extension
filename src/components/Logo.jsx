import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
    EyeIcon, EyeSlashIcon, ChevronUpIcon, ChevronDownIcon, BellIcon,
} from '@heroicons/react/16/solid';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import wordmarkDark from '~/assets/Wordmark-Dark-Logo.png';
import wordmarkLight from '~/assets/Wordmark-Light-Logo.png';
import logoStyles from './Logo.module.css';
import { useAppStore } from '~/entries/contentScript/state';

function TopButton({
    children,
    className = '',
    popup = null,
    onClick,
}) {
    return (
        <button
            className={classNames(
                'group/button relative rounded-lg bg-gray-100 px-4 py-[.2rem] dark:bg-gray-800 transition-colors',
                onClick ? 'cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700' : 'cursor-default',
                className,
            )}
            onClick={onClick}
            type="button"
        >
            {children}

            {popup && (
                <div className="invisible absolute bottom-0 right-0 z-20 flex w-[20rem] translate-y-full justify-end group-hover/button:visible">
                    <div className="mt-2 rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-white shadow dark:border-gray-200 dark:bg-gray-100">
                        {popup}
                    </div>
                </div>
            )}
        </button>
    );
}

TopButton.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    popup: PropTypes.string,
    onClick: PropTypes.func,
};

function Logo({
    onClick,
    sws,
    isTrackingVideos,
}) {
    const wordmarkUrlDark = new URL(wordmarkDark, import.meta.url).href;
    const wordmarkUrlLight = new URL(wordmarkLight, import.meta.url).href;

    const { t } = useTranslation();

    const [isMinimized, setIsMinimized] = useAppStore(
        useShallow((storeState) => ([storeState.isMinimized, storeState.setIsMinimized])),
    );

    const logoClassNames = 'h-9';

    const container = useRef();

    function resetAnimation() {
        container.current.classList.remove(logoStyles.active);
        setTimeout(() => {
            container.current.classList.add(logoStyles.active);
        }, 0);
    }

    return (
        <div className="flex w-full select-none items-center justify-between">
            <div
                ref={container}
                onClick={() => {
                    if (sws) {
                        onClick();
                        resetAnimation();
                    }
                }}
                className="flex items-center gap-2"
            >
                <img
                    src={wordmarkUrlDark}
                    className={classNames(logoClassNames, 'block dark:hidden')}
                    alt="Streamfinity"
                />
                <img
                    src={wordmarkUrlLight}
                    className={classNames(logoClassNames, 'hidden dark:block')}
                    alt="Streamfinity"
                />
                <div className="text-2xl font-semibold">
                    Buddy
                </div>
            </div>

            <div className="flex items-center gap-2">
                {isMinimized && (
                    <TopButton>
                        <div className="absolute left-0 top-0 flex size-7 -translate-x-1/2 -translate-y-2 items-center justify-center rounded-full bg-red-500 text-xs leading-none text-white">
                            5
                        </div>
                        <BellIcon className="size-7 text-gray-500" />
                    </TopButton>
                )}
                {isTrackingVideos !== undefined && (
                    <TopButton popup={isTrackingVideos ? t('status.trackingEnabled') : t('status.trackingDisabled')}>
                        {isTrackingVideos ? (
                            <EyeIcon className="size-7 text-red-500" />
                        ) : (
                            <EyeSlashIcon className="size-7 text-gray-500" />
                        )}
                    </TopButton>
                )}

                <TopButton
                    onClick={() => setIsMinimized(!isMinimized)}
                    popup={isMinimized ? 'Maximize' : 'Minimize'}
                >
                    {isMinimized ? (
                        <ChevronDownIcon className="size-7 text-gray-500" />
                    ) : (
                        <ChevronUpIcon className="size-7 text-gray-500" />
                    )}
                </TopButton>
            </div>
        </div>
    );
}

Logo.propTypes = {
    sws: PropTypes.bool,
    onClick: PropTypes.func,
    isTrackingVideos: PropTypes.bool,
};

Logo.defaultProps = {
    sws: false,
    size: 'default',
    onClick: () => {},
    isTrackingVideos: undefined,
};

export default Logo;
