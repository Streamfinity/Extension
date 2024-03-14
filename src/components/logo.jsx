import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import logoDark from '~/assets/Logo-Dark-400.png';
import logoWhite from '~/assets/Logo-Light-400.png';
import logoStyles from './logo.module.css';

function Logo({ size, onClick }) {
    const imageUrlDark = new URL(logoDark, import.meta.url).href;
    const imageUrlLight = new URL(logoWhite, import.meta.url).href;

    const logoClassNames = size === 'default' ? 'size-9' : 'size-6';

    const container = useRef();

    function resetAnimation() {
        container.current.classList.remove(logoStyles.active);
        setTimeout(() => {
            container.current.classList.add(logoStyles.active);
        }, 0);
    }

    return (
        <div
            ref={container}
            onClick={() => {
                onClick();
                resetAnimation();
            }}
            className={classNames(
                size === 'default' ? 'gap-4' : 'gap-2',
                'flex items-center select-none',
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
                size === 'default' ? 'text-4xl' : 'text-xl',
                'font-semibold',
            )}
            >
                Streamfinity Buddy
            </div>
        </div>
    );
}

Logo.propTypes = {
    size: PropTypes.oneOf([
        'default',
        'small',
    ]),
    onClick: PropTypes.func,
};

Logo.defaultProps = {
    size: 'default',
    onClick: () => {},
};

export default Logo;
