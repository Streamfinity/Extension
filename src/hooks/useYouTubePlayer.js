import { useState, useEffect } from 'react';
import { retryFind, getYouTubePlayer } from '~/common/utility';

export function useYouTubePlayer({ pollInterval } = {}) {
    const [progress, setProgress] = useState(0);
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
        const intervalId = setInterval(() => {
            if (playerElement) {
                setProgress(playerElement.currentTime);
            }
        }, pollInterval || 2000);

        return () => {
            clearInterval(intervalId);
        };
    }, [playerElement]);

    return {
        element: playerElement,
        progress,
    };
}
