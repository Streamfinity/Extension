import React, { useState } from 'react';
import PropTypes from 'prop-types';
import browser from 'webextension-polyfill';
import { LOGOUT } from '~/messages';

function SettingsView({ user, refreshStatus }) {
    const [loading, setLoading] = useState(false);

    async function logout() {
        setLoading(true);
        const response = await browser.runtime.sendMessage({ type: LOGOUT });
        console.log(response);
        await refreshStatus();
        setLoading(false);
    }

    return (
        <div>
            <button
                type="submit"
                disabled={loading}
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
    refreshStatus: PropTypes.func.isRequired,
};

export default SettingsView;
