import React, { useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
    EyeIcon, EyeSlashIcon, ChevronUpIcon, ChevronDownIcon, BellIcon,
} from '@heroicons/react/16/solid';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import logoDark from '~/assets/Logo-Dark-400.png';
import logoWhite from '~/assets/Logo-Light-400.png';
import logoStyles from './Logo.module.css';
import { useAppStore } from '~/entries/contentScript/state';
import { reactionPolicyEnum } from '~/enums';

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

function Header({
    onClick,
    sws,
    isTrackingVideos,
}) {
    const logoUrlDark = new URL(logoDark, import.meta.url).href;
    const logoUrlLight = new URL(logoWhite, import.meta.url).href;

    const { t } = useTranslation();

    const [isMinimized, setIsMinimized, reactionPolicy] = useAppStore(
        useShallow((storeState) => ([storeState.isMinimized, storeState.setIsMinimized, storeState.reactionPolicy])),
    );

    const reactionPolicyClassNames = useMemo(() => ({
        [reactionPolicyEnum.ALLOW]: 'border bg-emerald-500/20 border-emerald-500 text-emerald-900 dark:text-white',
        [reactionPolicyEnum.DENY]: 'border bg-red-500/20 border-red-500 text-red-900 dark:text-white',
        [reactionPolicyEnum.CONDITIONS]: 'border bg-yellow-500/20 border-yellow-500 text-yellow-900 dark:text-white',
    }[reactionPolicy?.policy] || ''), [reactionPolicy]);

    console.log(reactionPolicy, reactionPolicyClassNames);

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
                className="flex items-center gap-3"
            >
                <img
                    src={logoUrlDark}
                    className="block h-8 dark:hidden"
                    alt="Streamfinity"
                />
                <img
                    src={logoUrlLight}
                    className="hidden h-8 dark:block"
                    alt="Streamfinity"
                />
                <div className="-mb-px text-2xl font-bold leading-none">
                    Streamfinity Buddy
                </div>
            </div>

            <div className="flex items-center gap-2">
                {isMinimized && (
                    <TopButton
                        onClick={() => setIsMinimized(false)}
                        className={reactionPolicyClassNames}
                    >
                        <InformationCircleIcon className="size-7" />
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

Header.propTypes = {
    sws: PropTypes.bool,
    onClick: PropTypes.func,
    isTrackingVideos: PropTypes.bool,
};

Header.defaultProps = {
    sws: false,
    size: 'default',
    onClick: () => {},
    isTrackingVideos: undefined,
};

export default Header;
