import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

function LoginButton({ onClick, loading }) {
    return (

        <button
            type="button"
            onClick={onClick}
            disabled={loading}
            className={classNames(
                loading && 'opacity-50',
                'w-full font-medium rounded-full px-6 h-[36px] bg-gradient-to-r from-primary-gradient-from to-primary-gradient-to hover:bg-primary-600 transition-colors text-center text-black',
            )}
        >
            {loading ? 'Loading...' : 'Login with Streamfinity'}
        </button>
    );
}

LoginButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
};

LoginButton.defaultProps = {};

export default LoginButton;