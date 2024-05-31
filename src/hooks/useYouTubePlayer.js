import { useState, useEffect } from 'react';
import { retryFind, getYouTubePlayer } from '~/common/utility';

/**
 * Custom React hook to track and retrieve information about the YouTube player element.
 * 
 * @param {Object} options - An optional object containing configuration options.
 * @param {number} options.pollInterval - The interval (in milliseconds) at which to poll for player progress. Default is 2000ms.
 * 
 * @returns {Object} An object containing the player element and current progress.
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
