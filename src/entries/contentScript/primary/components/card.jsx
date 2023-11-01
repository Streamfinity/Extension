import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { childrenShape } from '~/shapes';

function CardTitleComponent({ children }) {
    return (
        <div className="mb-2 text-base font-semibold text-center">
            {children}
        </div>
    );
}

CardTitleComponent.propTypes = {
    children: childrenShape.isRequired,
};

export const CardTitle = CardTitleComponent;

function Card({
    children, color, rounded, className,
}) {
    const colorClassName = {
        default: 'bg-gray-300/30 dark:bg-neutral-700/30 border border-gray-400/20 dark:border-neutral-700',
        green: 'border-green-700 bg-green-700/30',
        red: 'border border-red-500/20 bg-red-500/40',
        yellow: 'border-yellow-500/50 bg-yellow-700/10 dark:border-yellow-800/80 dark:bg-yellow-700/10 text-gray-900',
    }[color];

    return (
        <div className={classNames(
            rounded ? 'py-1 rounded-full text-center text-sm' : 'p-4 rounded-xl',
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
    ]),
    rounded: PropTypes.bool,
    children: childrenShape.isRequired,
};

Card.defaultProps = {
    className: null,
    rounded: false,
    color: 'default',
};

export default Card;
