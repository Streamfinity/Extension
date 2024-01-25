import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from '~/styles/loading-spinner.module.css';

/**
 * Renders a loading spinner component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.className - The additional CSS class name for the spinner.
 * @param {boolean} props.centered - Whether to center the spinner on the screen.
 * @param {boolean} props.sm - Whether to render a small-sized spinner.
 * @returns {JSX.Element} The loading spinner component.
 */
function LoadingSpinner({
    className, centered, sm,
}) {
    return (
        <div className={classNames(
            styles.spinnyboy,
            className,
            centered && 'absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]',
            sm && styles.sm,
            'transform',
        )}
        />
    );
}

LoadingSpinner.propTypes = {
    className: PropTypes.string,
    centered: PropTypes.bool,
    sm: PropTypes.bool,
};

LoadingSpinner.defaultProps = {
    className: null,
    centered: true,
    sm: false,
};

export default LoadingSpinner;
