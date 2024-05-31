import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { childrenShape } from '~/shapes';

/**
 * Function that renders a card title with the provided children.
 * 
 * @param {Object} props - The props object containing the children to be rendered.
 * @param {Node | Element | Array} props.children - The children elements to be displayed in the card title.
 * 
 * @returns {JSX.Element} A div element representing the card title with the provided children.
 */
function CardTitle({ children }) {
    return (
        <div className="mb-2 text-base font-bold">
            {children}
        </div>
    );
}

CardTitle.propTypes = {
    children: childrenShape.isRequired,
};

/**
 * Function that defines a Card component in React.
 * 
 * @param {Object} props - The props for the Card component.
 * @param {string} props.className - The class name for styling the Card.
 * @param {string} props.color - The color theme for the Card.
 * @param {node} props.children - The content to be displayed inside the Card.
 * @param {string} props.title - The title of the Card.
 * @param {string} props.titleCompact - The compact title of the Card.
 * @param {string} props.preview - The preview content of the Card.
 * @param {boolean} props.compact - Flag to determine if the Card should be displayed in compact mode.
 * 
 * @returns {JSX.Element} A React component representing a Card.
 */
function Card({
    children,
    title,
    titleCompact = null,
    preview = null,
    color,
    className,
    compact = false,
}) {
    const [isExpanded, setIsExpanded] = useState(false);

    const colorClassName = {
        default: 'bg-gray-300/30 dark:bg-neutral-700/30',
        // Colors
        green: 'bg-[#01FF94]', // TODO
        red: 'bg-[#FF5C00]',
        yellow: 'bg-[#FFA800]',
        dashed: 'border-2 border-dashed border-gray-200 dark:border-gray-600',
        // Brand
        primary: 'bg-gradient-to-r from-primary-gradient-from to-primary-gradient-to',
        'brand-viewer': 'bg-gradient-to-r from-brand-viewer-gradient-from to-brand-viewer-gradient-to',
        'brand-creator': 'bg-gradient-to-r from-brand-creator-gradient-from to-brand-creator-gradient-to',
    }[color];

    const hasInner = color !== 'default';

    if (compact) {
        return (
            <div className={classNames(
                colorClassName,
                'p-[1px] rounded-[8px]',
            )}
            >
                <div className={classNames(
                    'flex flex-col gap-2 rounded-[7px] px-3 py-[0.25rem] text-sm bg-white/90 dark:bg-black/90',
                )}
                >
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        type="button"
                        className="flex items-center justify-between"
                    >
                        <div className="font-semibold opacity-85">
                            {titleCompact || title}
                        </div>
                        <div className="flex">
                            {preview && (
                                <div className="mr-2 rounded-md px-2 text-xs font-medium dark:bg-white/20">
                                    {preview}
                                </div>
                            )}
                            <div>
                                <ChevronDownIcon className={classNames(isExpanded && 'rotate-180', 'size-6 transition-transform opacity-70')} />
                            </div>
                        </div>
                    </button>

                    {isExpanded && (
                        <div className="p-2 pb-4">
                            {children}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const inner = (
        <>
            <CardTitle>
                {title}
            </CardTitle>

            {children}
        </>
    );

    if (hasInner) {
        return (
            <div className={classNames(colorClassName, 'rounded-[12px] p-[2px]')}>
                <div className={classNames(className, 'rounded-[10px] p-4 bg-white/90 dark:bg-black/90')}>
                    {inner}
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
            {inner}
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
        'dashed',
        'brand-viewer',
        'brand-creator',
        'primary',
    ]),
    children: childrenShape.isRequired,
    title: PropTypes.string.isRequired,
    titleCompact: PropTypes.string,
    preview: PropTypes.string,
    compact: PropTypes.bool,
};

Card.defaultProps = {
    className: null,
    color: 'default',
};

export default Card;
