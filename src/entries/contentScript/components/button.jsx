/* eslint-disable react/button-has-type */

import React, { useMemo } from 'react';
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
    inverted,
}) {
    const styles = useMemo(() => {
        if (!hslaColor) {
            return {};
        }

        const computedStyles = {};

        const [hue, saturation, brightness] = hslaColor.split(',');

        if (inverted) {
            computedStyles.backgroundColor = `hsla(${hue}deg, ${saturation}%, 100%, var(--tw-bg-opacity))`;
            computedStyles.color = `hsla(${hue}deg, ${saturation}%, ${brightness}%, 1.0)`;
        } else {
            computedStyles.backgroundColor = `hsla(${hue}deg, ${saturation}%, ${brightness}%, var(--tw-bg-opacity))`;
            computedStyles.color = `hsla(${hue}deg, ${saturation}%, 100%, 1.0)`;
        }

        computedStyles['--tw-shadow-color'] = `hsla(${hue}deg, ${saturation}%, ${brightness}%, .3)`;
        computedStyles['--tw-shadow'] = 'var(--tw-shadow-colored)';

        return computedStyles;
    }, [hslaColor]);

    const colorClassName = {
        white: ['dark:bg-white', 'dark:text-gray-800', 'bg-white', 'text-gray-800'],
        black: ['dark:bg-white', 'dark:text-gray-800', 'bg-black', 'text-white'],
        gray: ['dark:bg-gray-500', 'dark:text-gray-100', 'bg-gray-500', 'text-gray-50'],
        premium: ['dark:text-premium-100', 'text-black-900'],
        secondary: ['border border-gray-800/20 dark:border-gray-200/20 hover:border-gray-800/40 hover:bg-gray-800/5 dark:hover:border-gray-200/50 dark:hover:bg-gray-200/5'],

        primary: ['bg-gradient-to-r from-primary-gradient-lc-from to-primary-gradient-lc-to', 'text-primary-950'],
        'primary-secondary': ['dark:bg-primary-500 dark:bg-opacity-60', 'dark:text-primary-50', 'bg-primary-100', 'bg-opacity-50', 'text-primary-800'],
        'brand-streamer': ['dark:bg-brand-streamer-500', 'dark:text-brand-streamer-100', 'bg-brand-streamer-500', 'text-brand-streamer-50'],
        'brand-creator': ['dark:bg-brand-creator-500', 'dark:text-brand-creator-100', 'bg-brand-creator-500', 'text-brand-creator-50'],
        'brand-viewer': ['bg-gradient-to-r from-brand-viewer-gradient-lc-from to-brand-viewer-gradient-lc-to', 'text-brand-viewer-950'],

        green: ['dark:bg-green-500', 'dark:text-green-100', 'bg-green-500', 'text-green-50'],
        red: ['dark:bg-red-500', 'dark:text-red-100', 'bg-red-500', 'text-red-50'],
        'red-secondary': ['dark:bg-red-900', 'dark:text-red-100', 'bg-red-100 hover:bg-red-200', 'text-red-800'],
        indigo: ['dark:bg-indigo-500', 'dark:text-indigo-100', 'bg-indigo-500', 'text-indigo-50'],
        purple: ['dark:bg-purple-500', 'dark:text-purple-100', 'bg-purple-500', 'text-purple-50'],
        pink: ['dark:bg-pink-500', 'dark:text-pink-100', 'bg-pink-500', 'text-pink-50'],
    }[color] || [];

    const innerColorClassName = {
        premium: ['bg-white', 'dark:bg-gray-800'],
        primary: ['bg-gradient-to-r from-primary-gradient-from to-primary-gradient-to'],
        'brand-viewer': ['bg-gradient-to-r from-brand-viewer-gradient-from to-brand-viewer-gradient-to'],
    }[color] || null;

    const paddingClassName = sm ? ['px-4', 'py-1'] : ['px-6', 'py-3'];

    const sizeClassName = sm ? ['leading-loose', 'text-xs'] : ['leading-normal', 'text-sm'];

    const loadingSpinnerClassName = {
        white: 'border-gray-800',
        'primary-secondary': 'border-primary-600',
    }[color] || 'border-white';

    // Compute class name

    const hasInner = !!innerColorClassName;

    const innerClassName = classNames(
        hasInner && [paddingClassName, innerColorClassName, 'rounded-[5px]'],
    );

    const outerClassName = classNames(
        className,
        !hasInner ? paddingClassName : 'p-[3px]',
        ...colorClassName,
        ...sizeClassName,
        ...(loading || disabled)
            ? ['opacity-60', 'cursor-not-allowed']
            : ['hover:bg-opacity-100', 'dark:hover:bg-opacity-70 cursor-pointer'],
        loading && ['!text-transparent'],
        icon && ['flex items-center gap-2'],
        !colorClassName.filter((c) => c.includes('bg-opacity-')) && 'bg-opacity-80 dark:bg-opacity-20',
        'relative inline-block rounded-[8px] font-medium transition-colors duration-100 text-center whitespace-nowrap',
    );

    // Component creation

    let innerContent = (
        <>
            {(icon && iconDir === 'left') && icon}
            {children}
            {(icon && iconDir === 'right') && icon}
            {loading && (
                <LoadingSpinner
                    className={classNames(loadingSpinnerClassName, 'size-6')}
                    sm
                />
            )}
        </>
    );

    if (hasInner) {
        innerContent = (
            <div className={innerClassName}>
                {innerContent}
            </div>
        );
    }

    return href ? (
        <a
            href={href}
            className={outerClassName}
            onClick={onClick}
            style={styles}
            target={target}
        >
            {innerContent}
        </a>
    ) : (
        <button
            className={outerClassName}
            onClick={onClick}
            style={styles}
            type={type}
        >
            {innerContent}
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
        'secondary',
        'green',
        'red',
        'red-secondary',
        'gray',
        'white',
        'black',
        'brand-streamer',
        'brand-creator',
        'brand-viewer',
        'premium',
        'indigo',
        'purple',
        'pink',
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
    inverted: PropTypes.bool,
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
    inverted: false,
};

export default Button;
