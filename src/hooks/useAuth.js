import { useState, useMemo, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { logout, login, useStatus } from '~/common/bridge';
import { useAppStore } from '~/entries/contentScript/state';
import { createLogger } from '~/common/log';
import { accountServices } from '~/enums';
import { toastError } from '~/common/utility';
import { why } from '~/common/pretty';

const log = createLogger('useAuth');

export const STATE_DEFAULT = 'default';
export const STATE_LIVE = 'live';
export const STATE_OWN_VIDEO = 'own-video';

/**
 * Custom React hook for handling user authentication logic.
 *
 * This hook manages user authentication state, including login, logout, user status, and user actions.
 * It provides functions to perform login and logout operations, as well as access to user data and status.
 *
 * @returns {{
*  user: object,
*  accounts: array,
*  liveStreams: array,
*  liveStream: object,
*  isLive: boolean,
*  isOwnVideo: boolean,
*  isIncognito: boolean,
*  isTrackingVideos: boolean,
*  loadingAuth: boolean,
*  state: string,
*  setOverrideState: function,
*  refreshStatusData: function,
*  loadingLogin: boolean,
*  login: function,
*  loadingLogout: boolean,
*  logout: function
* }}
*/
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

    const isTrackingVideos = useMemo(() => !!liveStream && !isIncognito, [liveStream, isIncognito]);

    const isOwnVideo = useMemo(() => {
        if (!currentChannel?.handle) {
            return false;
        }

        return !!accounts
            ?.filter((account) => account.user_pivot.is_initial)
            ?.filter((account) => account.service.id === accountServices.YOUTUBE)
            ?.find((account) => account.service_user_name.toLowerCase() === currentChannel.handle.toLowerCase());
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
            // info: the toastError() will be sent from the background via EVENT_NOTICE
            log.warn('login error', why(err));
        }

        setLoadingLogin(false);
    }

    useEffect(() => {
        if (user?.id && (typeof window !== 'undefined')) {
            window.streamfinityUser = user;
        }
    }, [user?.id]);

    return {
        // User state
        user,
        accounts,
        liveStreams,
        liveStream,
        isLive,
        isOwnVideo,
        isIncognito,
        isTrackingVideos,
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
