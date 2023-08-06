/* eslint-disable react/button-has-type */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import LoadingSpinner from '~/components/loading-spinner';
import { childrenShape } from '~/shapes';

function Button({
    children,
    icon,
    iconDir,
    color,
    sm,
    loading,
    disabled,
    href,
    target,
    hslaColor,
    onClick,
    className,
    type,
}) {
    const colorClasses = {
        primary: ['dark:bg-primary-500', 'dark:text-primary-100', 'bg-primary-500 hover:bg-primary-600', 'text-primary-50'],
        'primary-secondary': ['dark:bg-primary-500 dark:bg-opacity-60', 'dark:text-primary-50', 'bg-primary-100', 'bg-opacity-50', 'text-primary-800'],
        green: ['dark:bg-green-500', 'dark:text-green-100', 'bg-green-500', 'text-green-50'],
        red: ['dark:bg-red-500', 'dark:text-red-100', 'bg-red-500', 'text-red-50'],
        gray: ['dark:bg-gray-500', 'dark:text-gray-100', 'bg-gray-500', 'text-gray-50'],
        white: ['dark:bg-white', 'dark:text-gray-800', 'bg-white', 'text-gray-800'],
        black: ['dark:bg-white', 'dark:text-gray-800', 'bg-black', 'text-white'],
        'brand-streamer': ['dark:bg-brand-streamer-500', 'dark:text-brand-streamer-100', 'bg-brand-streamer-500', 'text-brand-streamer-50'],
        'brand-creator': ['dark:bg-brand-creator-500', 'dark:text-brand-creator-100', 'bg-brand-creator-500', 'text-brand-creator-50'],
        'brand-viewer': ['dark:bg-brand-viewer-500', 'dark:text-brand-viewer-100', 'bg-brand-viewer-500', 'text-brand-viewer-50'],
    }[color] || [];

    const sizeClasses = sm
        ? ['px-4', 'py-1', 'leading-loose', 'rounded', 'text-xs']
        : ['px-6', 'py-3', 'leading-normal', 'rounded', 'text-sm'];

    const styles = {};

    if (hslaColor) {
        const [hue, saturation, brightness] = hslaColor.split(',');
        styles.backgroundColor = `hsla(${hue}deg, ${saturation}%, ${brightness}%, var(--tw-bg-opacity))`;
        styles.color = `hsla(${hue}deg, ${saturation}%, 95%, 1.0)`;
        styles['--tw-shadow-color'] = `hsla(${hue}deg, ${saturation}%, ${brightness}%, .3)`;
        styles['--tw-shadow'] = 'var(--tw-shadow-colored)';
    }

    const computedClasses = classNames(
        className,
        ...colorClasses,
        ...sizeClasses,
        ...(loading || disabled)
            ? ['opacity-60', 'cursor-not-allowed']
            : ['hover:bg-opacity-100', 'dark:hover:bg-opacity-50'],
        loading && ['!text-transparent'],
        icon && ['flex items-center gap-2'],
        !colorClasses.filter((c) => c.includes('bg-opacity-')) && 'bg-opacity-80 dark:bg-opacity-20',
        'relative inline-block font-medium transition-colors duration-100 cursor-pointer text-center',
    );

    const loadingSpinnerClasses = {
        white: 'border-gray-800',
        'primary-secondary': 'border-primary-600',
    }[color] || 'border-white';

    if (href) {
        return (
            <a
                href={href}
                className={computedClasses}
                style={styles}
                target={target}
            >
                {(icon && iconDir === 'left') && icon}
                {children}
                {(icon && iconDir === 'right') && icon}
                {loading && (
                    <LoadingSpinner
                        className={classNames(loadingSpinnerClasses, 'h-6 w-6')}
                        sm
                    />
                )}
            </a>
        );
    }

    return (
        <button
            className={computedClasses}
            onClick={onClick}
            style={styles}
            type={type}
        >
            {(icon && iconDir === 'left') && icon}
            {children}
            {(icon && iconDir === 'right') && icon}
            {loading && (
                <LoadingSpinner
                    className={classNames(loadingSpinnerClasses, 'h-6 w-6')}
                    sm
                />
            )}
        </button>
    );
}

Button.propTypes = {
    className: PropTypes.string,
    children: childrenShape.isRequired,
    icon: childrenShape,
    iconDir: PropTypes.oneOf([
        'left',
        'right',
    ]),
    color: PropTypes.oneOf([
        'primary',
        'primary-secondary',
        'green',
        'red',
        'gray',
        'white',
        'black',
        'brand-streamer',
        'brand-creator',
        'brand-viewer',
    ]),
    sm: PropTypes.bool,
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    href: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
            pathname: PropTypes.string,
            // eslint-disable-next-line react/forbid-prop-types
            query: PropTypes.object,
        }),
    ]),
    target: PropTypes.oneOf(['_blank']),
    hslaColor: PropTypes.string,
    type: PropTypes.oneOf([
        'button',
        'submit',
    ]),
    onClick: PropTypes.func,
};

Button.defaultProps = {
    className: null,
    icon: null,
    iconDir: 'left',
    color: null,
    sm: null,
    loading: null,
    disabled: null,
    href: null,
    target: null,
    hslaColor: null,
    type: 'button',
    onClick: () => {},
};

export default Button;
