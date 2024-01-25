import { useState, useEffect } from 'react';
import { retryFind, getYouTubePlayer } from '~/common/utility';

/**
 * Custom hook for interacting with a YouTube player.
 * @param {Object} options - The options for the hook.
 * @param {number} options.pollInterval - The interval in milliseconds to poll for player progress.
 * @returns {Object} - The player element and progress.
 */
export function useYouTubePlayer({ pollInterval } = {}) {
    const [progress, setProgress] = useState(null);
    const [playerElement, setPlayerElement] = useState(null);

    useEffect(() => {
        (async () => {
            const e = await retryFind(() => getYouTubePlayer());
            if (e) {
                setPlayerElement(e);
            }
        })();
    }, []);

    useEffect(() => {
        const progressIntervalId = setInterval(() => {
            if (playerElement) {
                setProgress(playerElement.currentTime);
            }
        }, pollInterval || 2000);

        return () => {
            clearInterval(progressIntervalId);
        };
    }, [playerElement]);

    return {
        element: playerElement,
        progress,
    };
}
