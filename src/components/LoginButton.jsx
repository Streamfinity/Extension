import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from '@streamfinity/streamfinity-branding';
import { useTranslation } from 'react-i18next';

function LoginButton({ onClick, loading }) {
    const { t } = useTranslation();

    return (
        <Button
            type="button"
            onClick={onClick}
            disabled={loading}
            className={classNames(
                loading && 'opacity-50',
                'w-full font-medium rounded-full px-6 h-[36px] bg-gradient-to-r from-primary-gradient-from to-primary-gradient-to hover:bg-primary-600 transition-colors text-center text-black',
            )}
        >
            {loading ? t('words.loading') : t('actions.loginWith')}
        </Button>
    );
}

LoginButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
};

LoginButton.defaultProps = {};

export default LoginButton;
