import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { childrenShape } from '~/shapes';

/**
 * Renders the title component for a card.
 *
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The content to be rendered inside the title component.
 * @returns {JSX.Element} The rendered title component.
 */
function CardTitleComponent({ children }) {
    return (
        <div className="mb-2 text-base font-medium">
            {children}
        </div>
    );
}

CardTitleComponent.propTypes = {
    children: childrenShape.isRequired,
};

export const CardTitle = CardTitleComponent;

/**
 * Renders a card component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The content of the card.
 * @param {string} props.color - The color of the card. Possible values: 'default', 'green', 'red', 'yellow', 'primary-gradient'.
 * @param {boolean} props.rounded - Determines if the card should have rounded corners.
 * @param {string} props.className - Additional CSS class names for the card.
 * @returns {JSX.Element} The rendered card component.
 */
function Card({
    children, color, rounded, className,
}) {
    const colorClassName = {
        default: 'bg-gray-300/30 dark:bg-neutral-700/30 border border-gray-400/20 dark:border-neutral-700',
        green: 'border border-positive-500 bg-positive-400/10',
        red: 'border border-negative-500 bg-negative-400/10',
        yellow: 'border border-warning-500 bg-warning-400/[0.15] text-gray-900',
        'primary-gradient': 'bg-gradient-to-r from-primary-gradient-from to-primary-gradient-to',
    }[color];

    return (
        <div className={classNames(
            rounded ? 'py-1 rounded-full text-center' : 'p-4 rounded-2xl',
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
        'primary-gradient',
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
