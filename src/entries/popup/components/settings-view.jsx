import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import useAuth from '~/hooks/useAuth';
import { storageGetSettingVisible } from '~/entries/background/common/storage';
import { settingsUpdateVisible } from '~/common/bridge';

import { useAppStore } from '~/entries/contentScript/state';
import Button from '~/entries/contentScript/components/button';

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

    async function toggleSettingVisible(value) {
        await settingsUpdateVisible({ visible: value });

        setIsVisible(value);
    }

    return (
        <div className="flex h-full flex-col justify-between">
            <div>
                <h2 className="mb-2 text-lg font-semibold">
                    Settings
                </h2>

                <div className="flex items-center gap-2">
                    <input
                        id="visibility"
                        type="checkbox"
                        className="accent-primary-500"
                        checked={isVisible}
                        onChange={() => toggleSettingVisible(!isVisible)}
                    />
                    <label htmlFor="visibility">
                        Show Extension on Web Pages
                    </label>
                </div>
            </div>
            <div>
                <Button
                    color="primary-secondary"
                    disabled={loadingLogout}
                    onClick={logout}
                    className="w-full"
                    sm
                >
                    Logout
                </Button>
            </div>
        </div>
    );
}

SettingsView.propTypes = {
    user: PropTypes.shape({
        display_name: PropTypes.string,
    }).isRequired,
};

export default SettingsView;
