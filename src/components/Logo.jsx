import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/16/solid';
import { useTranslation } from 'react-i18next';
import logoDark from '~/assets/Logo-Dark-400.png';
import logoWhite from '~/assets/Logo-Light-400.png';
import logoStyles from './Logo.module.css';
import { useAppStore } from '~/entries/contentScript/state';

function Logo({
    size,
    onClick,
    sws,
    isTrackingVideos,
}) {
    const imageUrlDark = new URL(logoDark, import.meta.url).href;
    const imageUrlLight = new URL(logoWhite, import.meta.url).href;

    const { t } = useTranslation();
    const compact = useAppStore((storeState) => storeState.isCompact);

    const computedSize = compact ? 'small' : size;
    const logoClassNames = computedSize === 'default' ? 'size-9' : 'size-6';

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
                className={classNames(
                    computedSize === 'default' ? 'gap-4' : 'gap-3',
                    'flex items-center',
                )}
            >
                <img
                    src={imageUrlDark}
                    className={classNames(logoClassNames, 'block dark:hidden')}
                    alt="Logo"
                />
                <img
                    src={imageUrlLight}
                    className={classNames(logoClassNames, 'hidden dark:block')}
                    alt="Logo"
                />
                <div className={classNames(
                    computedSize === 'default' ? 'text-4xl' : 'text-2xl',
                    'font-semibold',
                )}
                >
                    Streamfinity Buddy
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
    size: PropTypes.oneOf([
        'default',
        'small',
    ]),
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
