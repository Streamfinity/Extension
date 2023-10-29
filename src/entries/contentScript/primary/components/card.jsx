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

function Card({ children, color, className }) {
    const colorClassName = {
        default: 'bg-gray-300/30 dark:bg-neutral-700/30 border border-gray-400/20 dark:border-neutral-700',
        green: 'border-green-700 bg-green-700/30',
        red: 'border-red-700 bg-red-700/30',
        yellow: 'border-yellow-500/50 bg-yellow-700/10 dark:border-yellow-800/80 dark:bg-yellow-700/10 text-gray-900',
    }[color];

    return (
        <div className={classNames(
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
    children: childrenShape.isRequired,
};

Card.defaultProps = {
    className: null,
    color: 'default',
};

export default Card;
