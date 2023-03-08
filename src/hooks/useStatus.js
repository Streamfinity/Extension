import browser from 'webextension-polyfill';
import { useState, useMemo } from 'react';
import { GET_STATUS } from '~/messages';

export function useStatus() {
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(null);
    const [user, setUser] = useState(null);

    const hasData = useMemo(() => !loading && user, [loading, user]);

    const refresh = async () => {
        const response = await browser.runtime.sendMessage({ type: GET_STATUS });

        setStatus(response?.status);
        setUser(response?.user);
        setLoading(false);
    };

    return {
        user, status, refresh, hasData,
    };
}
