import { useEffect, useState } from 'react';
import { getReactionPolicyForVideo } from '~/common/bridge';
import { findCurrentVideoChannel } from '~/common/utility';
import { useAppStore } from '~/entries/contentScript/primary/state';
import { createLogger } from '~/common/log';

const log = createLogger('useReactinonPolicy');

export default function useReactionPolicy() {
    const [loading, setLoading] = useState(true);
    const { currentUrl, setReactionPolicy, reactionPolicy } = useAppStore();

    useEffect(() => {
        async function fetchPolicy() {
            setLoading(true);

            try {
                const { data: policy } = await getReactionPolicyForVideo({
                    videoUrl: currentUrl,
                    channelUrl: findCurrentVideoChannel(),
                });

                setReactionPolicy(policy);
                log.debug('reaction policy', policy);
            } catch (err) {
                log.warn('error fetching reaction policy', err);
                setReactionPolicy(null);
            }

            setLoading(false);
        }

        if (currentUrl) {
            fetchPolicy();
        }
    }, [currentUrl]);

    return {
        loading,
        policy: reactionPolicy,
    };
}
