import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/16/solid';
import { useTranslation } from 'react-i18next';
import wordmarkDark from '~/assets/Wordmark-Dark-Logo.png';
import wordmarkLight from '~/assets/Wordmark-Light-Logo.png';
import logoStyles from './Logo.module.css';

function Logo({
    onClick,
    sws,
    isTrackingVideos,
}) {
    const wordmarkUrlDark = new URL(wordmarkDark, import.meta.url).href;
    const wordmarkUrlLight = new URL(wordmarkLight, import.meta.url).href;

    const { t } = useTranslation();

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

            {isTrackingVideos !== undefined && (
                <div className="group/tracking relative rounded-lg bg-gray-100 px-5 py-[.2rem] dark:bg-gray-800">
                    {isTrackingVideos ? (
                        <EyeIcon className="size-8 text-red-500" />
                    ) : (
                        <EyeSlashIcon className="size-8 text-gray-500" />
                    )}

                    <div className="invisible absolute bottom-0 right-0 z-20 flex w-[25rem] translate-y-full justify-end group-hover/tracking:visible">
                        <div className="mt-2 rounded-md border border-gray-200 bg-gray-100 px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-800">
                            {isTrackingVideos ? t('status.trackingEnabled') : t('status.trackingDisabled')}
                        </div>
                    </div>
                </div>
            )}
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
