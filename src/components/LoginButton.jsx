import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@streamfinity/streamfinity-branding';
import { useTranslation } from 'react-i18next';

/**
 * Function component representing a login button.
 * 
 * @param {Object} props - The props object containing onClick and loading.
 * @param {Function} props.onClick - The function to be called on button click.
 * @param {boolean} props.loading - A boolean indicating if the button is in a loading state.
 * @returns {JSX.Element} A Button component with specified props and text based on loading state.
 */
function LoginButton({ onClick, loading }) {
    const { t } = useTranslation();

    return (
        <Button
            type="button"
            color="primary-gradient"
            onClick={onClick}
            disabled={loading}
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
