import { useState, useEffect } from 'react';

/**
 * Custom hook to get the current URL of the page.
 *
 * @returns {Object} An object containing the current URL.
 * @property {string} currentUrl - The current URL of the page.
 */
export function usePage() {
    const [currentUrl, setCurrentUrl] = useState(null);

    useEffect(() => {
        const currentUrlIntervalId = setInterval(() => {
            if (window?.location) {
                setCurrentUrl(window.location.href);
            }
        }, 1000);

        return () => {
            clearInterval(currentUrlIntervalId);
        };
    }, []);

    return {
        currentUrl,
    };
}
