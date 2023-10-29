import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { childrenShape } from '~/shapes';

function Card({ children, color, className }) {
    const colorClassName = {
        default: 'bg-gray-300 dark:bg-neutral-700/30 border border-gray-400/30 dark:border-neutral-700',
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
    ]),
    children: childrenShape.isRequired,
};

Card.defaultProps = {
    className: null,
    color: 'default',
};

export default Card;
