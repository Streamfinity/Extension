import { useState, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { logout, login, useStatus } from '~/common/bridge';
import { useAppStore } from '~/entries/contentScript/state';
import { createLogger } from '~/common/log';
import { accountServices } from '~/enums';
import { toastError } from '~/common/utility';

const log = createLogger('useAuth');

export const STATE_DEFAULT = 'default';
export const STATE_LIVE = 'live';
export const STATE_OWN_VIDEO = 'own-video';

export default function useAuth() {
    const [
        overrideState, setOverrideState, currentChannel,
    ] = useAppStore(
        useShallow((state) => [state.overrideState, state.setOverrideState, state.currentChannel]),
    );

    const {
        data: statusData,
        refetch: refreshStatusData,
        isLoading: loadingAuth,
    } = useStatus();

    const [user, accounts, liveStreams] = useMemo(
        () => [statusData?.user, statusData?.accounts, statusData?.live_streams],
        [statusData],
    );

    const [loadingLogin, setLoadingLogin] = useState(false);
    const [loadingLogout, setLoadingLogout] = useState(false);

    const liveStream = useMemo(() => liveStreams?.find(() => true), [liveStreams]);
    const isLive = useMemo(() => !!liveStream, [liveStream]);
    const isIncognito = useMemo(() => !!user?.extension_invisible_until, [user]);

    const isOwnVideo = useMemo(() => {
        if (!currentChannel?.handle) {
            return false;
        }

        const ownedAccounts = accounts?.filter((account) => account.user_pivot.is_initial);

        return !!ownedAccounts?.find((account) => account.service.id === accountServices.YOUTUBE && account.service_user_name.toLowerCase() === currentChannel.handle.toLowerCase());
    }, [currentChannel, accounts]);

    const state = useMemo(() => {
        if (overrideState !== null) {
            return overrideState;
        }

        // ++++++++++++ DEBUG ++++++++++++
        // return STATE_OWN_VIDEO;
        // ++++++++++++ DEBUG ++++++++++++

        if (isLive) {
            return STATE_LIVE;
        }

        if (isOwnVideo) {
            return STATE_OWN_VIDEO;
        }

        return STATE_DEFAULT;
    }, [isLive, isOwnVideo, overrideState]);

    async function performLogout() {
        setLoadingLogout(true);

        await logout();
        await refreshStatusData();

        setLoadingLogout(false);
    }

    async function performLogin() {
        setLoadingLogin(true);

        try {
            const response = await login();

            log.debug('login response', response);

            if (response?.error) {
                toastError(response.error);
                return;
            }

            await refreshStatusData();
        } catch (err) {
            toastError(err);
        }

        setLoadingLogin(false);
    }

    return {
        // User state
        user,
        accounts,
        liveStreams,
        liveStream,
        isLive,
        isOwnVideo,
        isIncognito,
        loadingAuth,
        // Status
        state,
        setOverrideState,
        // Query
        refreshStatusData,
        // Login
        loadingLogin,
        login: performLogin,
        // Logout
        loadingLogout,
        logout: performLogout,
    };
}
