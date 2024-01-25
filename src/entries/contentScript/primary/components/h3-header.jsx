import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { childrenShape } from '~/shapes';

/**
 * Renders an h3 header with optional step indicator.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The content to be rendered inside the h3 header.
 * @param {string} props.mt - The margin-top CSS value for the h3 header.
 * @param {string} props.mb - The margin-bottom CSS value for the h3 header.
 * @param {number|null} props.step - The step indicator value. If null, no step indicator will be shown.
 * @returns {JSX.Element} The rendered h3 header component.
 */
function H3Header({
    children, mt, mb, step,
}) {
    return (
        <h3 className={classNames(mt, mb, 'flex items-center text-2xl font-semibold')}>
            {step !== null && (
                <div className="h-7 w-7 mr-3 rounded-full bg-gray-200 dark:bg-gray-300 text-gray-700 flex items-center justify-center text-sm">
                    {step}
                </div>
            )}
            {children}
        </h3>
    );
}

H3Header.propTypes = {
    children: childrenShape.isRequired,
    mt: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string,
    ]),
    mb: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string,
    ]),
    step: PropTypes.number,
};

H3Header.defaultProps = {
    mt: 'mt-6',
    mb: 'mb-4',
    step: null,
};

export default H3Header;
