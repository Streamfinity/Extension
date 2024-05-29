import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useYouTubePlayer } from '~/hooks/useYouTubePlayer';
import { PLAYBACK_PROGRESS_SEND_INTERVAL_SECONDS, PLAYBACK_PROGRESS_MIN_VIDEO_SECONDS } from '~/config';
import { createLogger } from '~/common/log';
import { sendPlayerProgress } from '~/common/bridge';
import { useAppStore } from '~/entries/contentScript/state';
import { why } from '~/common/pretty';

const log = createLogger('PlayerProgress');

/**
 * Function component for handling player progress updates.
 * 
 * @param {Object} props - The props object containing the 'active' boolean property.
 * @returns {null} - This component does not render any UI elements.
 */
function PlayerProgressListener({ active }) {
    const { element: playerElement, progress: playerProgress } = useYouTubePlayer();
    const currentUrl = useAppStore((state) => state.currentUrl);

    const [lastProgress, setLastProgress] = useState(null);
    const [lastSent, setLastSent] = useState(null);

    async function send(progress) {
        if (!active || progress === null || !playerElement) {
            return;
        }

        const now = +new Date();
        const cooldown = lastSent !== null && (now - lastSent) < (PLAYBACK_PROGRESS_SEND_INTERVAL_SECONDS * 1000);

        // log.debug('send', { cooldown, isLast: progress === lastProgress, tooLow: progress < PLAYBACK_PROGRESS_MIN_VIDEO_SECONDS });

        if (cooldown) {
            // log.debug('cooldown');
            return;
        }

        if (progress === lastProgress) {
            log.debug('same progress');
            return;
        }

        if (progress < PLAYBACK_PROGRESS_MIN_VIDEO_SECONDS) {
            log.debug(`video progress too low (min ${PLAYBACK_PROGRESS_MIN_VIDEO_SECONDS}, got ${progress})`);
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

        try {
            const response = await sendPlayerProgress(playerAttributes);

            log.debug('send OK', response);
        } catch (err) {
            log.error('couldn\'t send player progress', why(err), err);
        }
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

PlayerProgressListener.propTypes = {
    active: PropTypes.bool.isRequired,
};

PlayerProgressListener.defaultProps = {};

export default PlayerProgressListener;
