import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { childrenShape } from '~/shapes';

/**
 * Function component for rendering an H2 header with specified margin top and margin bottom.
 * 
 * @param {Object} props - The props for the H2Header component.
 * @param {node} props.children - The children elements to be rendered within the H2 header.
 * @param {string|bool} props.mt - The margin top class name or boolean value.
 * @param {string|bool} props.mb - The margin bottom class name or boolean value.
 * 
 * @returns {JSX.Element} JSX element representing the H2 header with specified styles and children.
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
