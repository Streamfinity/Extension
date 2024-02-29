import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { childrenShape } from '~/shapes';

function CardTitleComponent({ children }) {
    return (
        <div className="mb-2 text-lg font-bold">
            {children}
        </div>
    );
}

CardTitleComponent.propTypes = {
    children: childrenShape.isRequired,
};

export const CardTitle = CardTitleComponent;

function Card({
    children, color, className,
}) {
    const colorClassName = {
        default: 'bg-gray-300/30 dark:bg-neutral-700/30',
        'primary-gradient': 'bg-gradient-to-r from-primary-gradient-from to-primary-gradient-to',
        // Colors
        green: 'bg-positive-400',
        red: 'bg-negative-400',
        yellow: 'bg-warning-400 text-gray-900',
        // Brand
        'brand-viewer': 'bg-gradient-to-r from-brand-viewer-gradient-from to-brand-viewer-gradient-to',
    }[color];

    const innerColorClassName = {
        // Colors
        green: 'bg-white/90 dark:bg-black/90',
        red: 'bg-white/90 dark:bg-black/90',
        yellow: 'bg-white/90 dark:bg-black/90',
        // Brand
        'brand-viewer': 'bg-white/90 dark:bg-black/90',
    }[color];

    const hasInner = !!innerColorClassName;

    if (hasInner) {
        return (
            <div className={classNames(colorClassName, 'rounded-[12px] p-[2px]')}>
                <div className={classNames(className, innerColorClassName, 'rounded-[10px] p-4')}>
                    {children}
                </div>
            </div>
        );
    }

    return (
        <div className={classNames(
            'p-4 rounded-[12px]',
            className,
            colorClassName,
        )}
        >
            {children}
        </div>
    );
}

Card.propTypes = {
    className: PropTypes.string,
    color: PropTypes.oneOf([
        'default',
        'green',
        'red',
        'yellow',
        'brand-viewer',
        'primary-gradient',
    ]),
    children: childrenShape.isRequired,
};

Card.defaultProps = {
    className: null,
    color: 'default',
};

export default Card;
