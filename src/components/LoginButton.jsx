import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@streamfinity/streamfinity-branding';
import { useTranslation } from 'react-i18next';

function LoginButton({ onClick, loading }) {
    const { t } = useTranslation();

    return (
        <Button
            type="button"
            color="primary"
            onClick={onClick}
            disabled={loading}
            usePx={false}
            className="w-full"
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
