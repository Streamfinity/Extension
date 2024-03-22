import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useYouTubePlayer } from '~/hooks/useYouTubePlayer';
import { INTERVAL_SEND_PLAYER_PROGRESS } from '~/config';
import { createLogger } from '~/common/log';
import { sendPlayerProgress } from '~/common/bridge';
import { useAppStore } from '~/entries/contentScript/state';

const log = createLogger('PlayerProgress');

function PlayerProgressListenerHeadless({ active }) {
    const { element: playerElement, progress: playerProgress } = useYouTubePlayer();
    const { currentUrl } = useAppStore();

    const [lastProgress, setLastProgress] = useState(null);
    const [lastSent, setLastSent] = useState(null);

    async function send(progress) {
        if (!active || progress === null || !playerElement) {
            return;
        }

        const now = +new Date();

        if (lastSent !== null && (now - lastSent) < INTERVAL_SEND_PLAYER_PROGRESS) {
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
    active: PropTypes.bool.isRequired,
};

PlayerProgressListenerHeadless.defaultProps = {};

export default PlayerProgressListenerHeadless;
