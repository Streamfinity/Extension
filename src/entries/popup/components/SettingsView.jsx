import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useShallow } from 'zustand/react/shallow';
import { Button } from '@streamfinity/streamfinity-branding';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import useAuth from '~/hooks/useAuth';
import { storageGetSettingVisible } from '~/entries/background/common/storage';
import { settingsUpdateVisible, toggleIncognitoMode } from '~/common/bridge';
import { useAppStore } from '~/entries/contentScript/state';
import { Switch } from '~/components/Ui/Switch';
import Card from '~/entries/contentScript/components/Card';
import { getApiUrl } from '~/config';

function SettingsView() {
    const { t } = useTranslation();
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

    // check if "extension_invisible_until" is not in past using momentjs
    const isIncognito = useMemo(() => !!user?.extension_invisible_until && moment(user.extension_invisible_until).isAfter(moment.utc()), [user]);

    const [expandIncognito, setExpandIncognito] = useState(false);

    const isIncognitoToggleActive = useMemo(() => expandIncognito || isIncognito, [expandIncognito, isIncognito]);

    const incognitoAvailableLengths = ['15m', '30m', '1h', '3h', '6h'];

    async function localToggleIncognitoMode(length) {
        await toggleIncognitoMode({
            length,
        });

        await refreshStatusData();
        setExpandIncognito(false);
    }

    async function localToggleIncognito() {
        if (isIncognito) {
            localToggleIncognitoMode(null);
        } else if (!expandIncognito) {
            setExpandIncognito(true);
        } else if (expandIncognito) {
            setExpandIncognito(false);
        }
    }

    const endpoint = new URL(getApiUrl());

    return (
        <div className="flex h-full flex-col justify-between gap-6">
            <Card
                title={t('settings.title')}
                color="primary"
            >
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <Switch
                            id="visibility"
                            checked={isVisible}
                            onCheckedChange={() => localToggleVisible(!isVisible)}
                        />
                        <label htmlFor="visibility">
                            {t('settings.showExtension')}
                        </label>
                    </div>

                    <div>
                        <div className="mb-1 font-semibold">
                            {t('settings.incognito')}
                        </div>

                        <div className="flex items-center gap-2">
                            <Switch
                                id="incognito"
                                checked={isIncognitoToggleActive}
                                onCheckedChange={() => localToggleIncognito()}
                            />
                            <label htmlFor="incognito">
                                {isIncognito
                                    ? (t('settings.incognitoDisable', { date: moment(user.extension_invisible_until).format('HH:mm') }))
                                    : t('settings.incognitoEnable')}
                            </label>
                        </div>

                        {expandIncognito && (
                            <div className="mt-2 flex gap-2">
                                {incognitoAvailableLengths.map((length) => (
                                    <button
                                        key={length}
                                        onClick={() => localToggleIncognitoMode(length)}
                                        type="button"
                                        className="rounded bg-white/20 px-2 text-white transition-colors hover:bg-white/30"
                                    >
                                        {length}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </Card>
            <div>
                <div className="pb-2 text-xs text-gray-300">
                    Environment:
                    {' '}
                    {endpoint.hostname}
                </div>
                <Button
                    color="secondary"
                    disabled={loadingLogout}
                    onClick={logout}
                    usePx={false}
                    className="w-full"
                    sm
                >
                    {t('actions.logout')}
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
