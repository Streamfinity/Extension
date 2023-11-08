import React from 'react';
import PropTypes from 'prop-types';
import useAuth from '~/hooks/useAuth';

function SettingsView({ user }) {
    const { logout, loadingLogout } = useAuth();

    return (
        <div>
            <button
                type="submit"
                disabled={loadingLogout}
                onClick={logout}
            >
                Logout
            </button>
        </div>
    );
}

SettingsView.propTypes = {
    user: PropTypes.shape({
        display_name: PropTypes.string,
    }).isRequired,
};

export default SettingsView;
