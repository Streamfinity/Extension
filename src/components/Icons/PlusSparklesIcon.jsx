import React from 'react';
import PropTypes from 'prop-types';

function PlusSparkles({ className = '', width = 20, height = 20 }) {
    return (
        <svg
            width={width}
            height={height}
            className={className}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                opacity="0.9"
                d="M15.4405 7V0L17.5595 0V7H15.4405ZM13 4.55946V2.44054H20V4.55946H13Z"
                fill="currentColor"
            />
            <path
                opacity="0.9"
                d="M4.88108 17V3H9.11892V17H4.88108ZM0 12.1189L0 7.88108H14V12.1189H0Z"
                fill="currentColor"
            />
            <path
                opacity="0.9"
                d="M14.0919 20V14H15.9081V20H14.0919ZM12 17.9081V16.0919H18V17.9081H12Z"
                fill="currentColor"
            />
        </svg>
    );
}

PlusSparkles.propTypes = {
    className: PropTypes.string,
    height: PropTypes.number,
    width: PropTypes.number,
};

export default PlusSparkles;
