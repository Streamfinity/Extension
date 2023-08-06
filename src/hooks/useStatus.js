import browser from 'webextension-polyfill';
import { useMemo } from 'react';
import { GET_STATUS } from '~/messages';
import { createLogger } from '~/common/log';
import { useContentStore } from '~/entries/contentScript/primary/state';

const log = createLogger('useStatus');

export function useStatus() {
    const {
        user, setUser,
        status, setStatus,
        loading, setLoading,
    } = useContentStore();

    const hasData = useMemo(() => !loading && user, [loading, user]);
    const isLive = useMemo(() => status?.live_streams?.length > 0, [status]);

    const refresh = async () => {
        const response = await browser.runtime.sendMessage({ type: GET_STATUS });

        log.debug('refreshing', response);

        setStatus(response?.status);
        setUser(response?.user);
        setLoading(false);
    };

    return {
        user, status, refresh, hasData, isLive, loading,
    };
}
