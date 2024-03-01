import { useState, useEffect } from 'react';
import { useYouTubePlayer } from '~/hooks/useYouTubePlayer';
import { usePage } from '~/hooks/usePage';
import { INTERVAL_SEND_PLAYER_PROGRESS } from '~/config';
import { createLogger } from '~/common/log';
import { sendPlayerProgress } from '~/common/bridge';

const log = createLogger('PlayerProgress');

function PlayerProgressListenerHeadless() {
    const { element: playerElement, progress: playerProgress } = useYouTubePlayer();
    const { currentUrl } = usePage();

    const [lastProgress, setLastProgress] = useState(null);
    const [lastSent, setLastSent] = useState(null);

    async function send(progress) {
        if (progress === null || !playerElement) {
            return;
        }

        const now = +new Date();

        if (lastSent !== null && (now - lastSent) < INTERVAL_SEND_PLAYER_PROGRESS) {
            log.debug('on cooldown');
            return;
        }

        if (progress === lastProgress) {
            log.debug('same progress');
            return;
        }

        setLastProgress(progress);
        setLastSent(now);

        const playerAttributes = {
            playbackRate: playerElement.playbackRate, // player.playbackRate,
            paused: playerElement.paused, // player.paused,
            ended: playerElement.ended, // player.ended,
            timestamp: progress, // player.currentTime,
            url: currentUrl,
            date: (new Date()).toISOString(),
        };

        log.debug('send', playerAttributes);

        await sendPlayerProgress(playerAttributes);
    }

    useEffect(() => {
        setLastSent(null);
        setLastProgress(null);
    }, [currentUrl]);

    useEffect(() => {
        send(playerProgress);
    }, [playerProgress]);

    return null;
}

PlayerProgressListenerHeadless.propTypes = {

};

PlayerProgressListenerHeadless.defaultProps = {};

export default PlayerProgressListenerHeadless;
