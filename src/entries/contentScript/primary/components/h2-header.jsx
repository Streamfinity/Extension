import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { childrenShape } from '~/shapes';

/**
 * Renders an h2 header with the specified children.
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The content to be rendered inside the h2 header.
 * @param {string} props.mt - The margin-top CSS value for the h2 header.
 * @param {string} props.mb - The margin-bottom CSS value for the h2 header.
 * @returns {JSX.Element} The rendered h2 header component.
 */
function H2Header({ children, mt, mb }) {
    return (
        <h2 className={classNames(mt, mb, 'text-3xl font-semibold')}>
            {children}
        </h2>
    );
}

H2Header.propTypes = {
    children: childrenShape.isRequired,
    mt: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string,
    ]),
    mb: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string,
    ]),
};

H2Header.defaultProps = {
    mt: 'mt-6',
    mb: 'mb-4',
};

export default H2Header;
