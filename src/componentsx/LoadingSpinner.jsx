import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from '~/styles/loading-spinner.module.css';

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
