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

function CardTitleSubtleComponent({ children }) {
    return (
        <div className="mb-1 font-bold">
            {children}
        </div>
    );
}

CardTitleSubtleComponent.propTypes = {
    children: childrenShape.isRequired,
};

export const CardTitleSubtle = CardTitleSubtleComponent;

function Card({
    children, color, className,
}) {
    const colorClassName = {
        default: 'bg-gray-300/30 dark:bg-neutral-700/30',
        // Colors
        green: 'bg-[#01FF94]', // TODO
        red: 'bg-[#FF5C00]',
        yellow: 'bg-[#FFA800]',
        // Brand
        primary: 'bg-gradient-to-r from-primary-gradient-from to-primary-gradient-to',
        'brand-viewer': 'bg-gradient-to-r from-brand-viewer-gradient-from to-brand-viewer-gradient-to',
        'brand-creator': 'bg-gradient-to-r from-brand-creator-gradient-from to-brand-creator-gradient-to',
    }[color];

    const innerColorClassName = {
        // Colors
        green: 'bg-white/90 dark:bg-black/90',
        red: 'bg-white/90 dark:bg-black/90',
        yellow: 'bg-white/90 dark:bg-black/90',
        // Brand
        primary: 'bg-white/90 dark:bg-black/90',
        'brand-viewer': 'bg-white/90 dark:bg-black/90',
        'brand-creator': 'bg-white/90 dark:bg-black/90',
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
        'brand-creator',
        'primary',
    ]),
    children: childrenShape.isRequired,
};

Card.defaultProps = {
    className: null,
    color: 'default',
};

export default Card;
