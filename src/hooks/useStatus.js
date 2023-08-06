import { useMemo } from 'react';
import { createLogger } from '~/common/log';
import { useContentStore } from '~/entries/contentScript/primary/state';
import { getStatus } from '~/common/bridge';

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
        const { status: statusResponse, user: userResponse } = await getStatus();

        log.debug('refreshing', { status, user });

        setStatus(statusResponse);
        setUser(userResponse);
        setLoading(false);
    };

    return {
        user, status, refresh, hasData, isLive, loading,
    };
}
