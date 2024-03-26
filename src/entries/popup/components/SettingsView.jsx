import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useShallow } from 'zustand/react/shallow';
import useAuth from '~/hooks/useAuth';
import { storageGetSettingVisible } from '~/entries/background/common/storage';
import { settingsUpdateVisible, toggleIncognitoMode } from '~/common/bridge';
import { useAppStore } from '~/entries/contentScript/state';
import Button from '~/entries/contentScript/components/_Button';
import { Switch } from '~/components/ui/switch';
import Card, { CardTitle } from '~/entries/contentScript/components/_Card';

function SettingsView() {
    const {
        logout, loadingLogout, refreshStatusData, user,
    } = useAuth();

    const [isVisible, setIsVisible] = useAppStore(
        useShallow((state) => [state.isVisible, state.setIsVisible]),
    );

    useEffect(() => {
        (async () => {
            setIsVisible(
                await storageGetSettingVisible(),
            );
        })();
    }, []);

    async function localToggleVisible(value) {
        await settingsUpdateVisible({ visible: value });

        setIsVisible(value);
    }

    async function localToggleIncognitoMode(enabled) {
        await toggleIncognitoMode({
            length: enabled ? null : '3h',
        });

        await refreshStatusData();
    }

    const isIncognito = useMemo(() => !!user?.extension_invisible_until, [user]);

    console.log(user);

    return (
        <div className="flex h-full flex-col justify-between">
            <Card color="primary">
                <CardTitle>
                    Settings
                </CardTitle>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <Switch
                            id="visibility"
                            checked={isVisible}
                            onCheckedChange={() => localToggleVisible(!isVisible)}
                        />
                        <label htmlFor="visibility">
                            Show Extension on Web Pages
                        </label>
                    </div>

                    <div className="flex items-center gap-2">
                        <Switch
                            id="incognito"
                            checked={isIncognito}
                            onCheckedChange={() => localToggleIncognitoMode(isIncognito)}
                        />
                        <label htmlFor="incognito">
                            Incognito Mode (don&apos;t track videos)
                        </label>
                    </div>
                </div>
            </Card>
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
