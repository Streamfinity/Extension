import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import useAuth from '~/hooks/useAuth';
import { storageGetSettingVisible } from '~/entries/background/common/storage';
import { settingsUpdateVisible } from '~/common/bridge';

import { useAppStore } from '~/entries/contentScript/primary/state';

function SettingsView({ user }) {
    const { logout, loadingLogout } = useAuth();

    const { isVisible, setIsVisible } = useAppStore();

    useEffect(() => {
        (async () => {
            setIsVisible(
                await storageGetSettingVisible(),
            );
        })();
    }, []);

    async function toggleSettingVisible() {
        const current = await storageGetSettingVisible();

        await settingsUpdateVisible({ visible: !current });

        setIsVisible(!current);
    }

    return (
        <div>
            <div>
                Extension visibility status:
                {' '}
                {' '}
                <button
                    type="button"
                    onClick={toggleSettingVisible}
                    className="text-red-500 underline"
                >
                    {isVisible ? 'visible' : 'INVISIBLE'}
                </button>
            </div>
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
