import { useState, useEffect } from 'react';

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
