import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { childrenShape } from '~/shapes';

// -------------------------------------------------------------------------------------------------------
// Title
// -------------------------------------------------------------------------------------------------------

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

// -------------------------------------------------------------------------------------------------------
// Card
// -------------------------------------------------------------------------------------------------------

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
                    'flex flex-col gap-2 rounded-[7px] px-3 py-1 text-sm bg-white/90 dark:bg-black/90',
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
                                <div className="mr-2 rounded-md bg-white/20 px-2 text-xs font-medium">
                                    {preview}
                                </div>
                            )}
                            <div>
                                <ChevronDownIcon className="size-6" />
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
