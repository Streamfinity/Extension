import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { buildFrontendUrl } from '~/common/utility';
import useAuth from '~/hooks/useAuth';
import { useAppStore } from '~/entries/contentScript/state';

function Footer() {
    const { user } = useAuth();

    const [isMinimized, setIsMinimized] = useAppStore(
        useShallow((storeState) => ([storeState.isMinimized, storeState.setIsMinimized])),
    );

    if (!user) {
        return null;
    }

    return (
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-300">
            <div>
                {user.display_name}
            </div>
            <div className="flex gap-4">
                <button
                    type="button"
                    className="font-medium"
                    onClick={() => setIsMinimized(!isMinimized)}
                >
                    {isMinimized ? 'Maximize' : 'Minimize'}
                </button>
                <a
                    href={buildFrontendUrl('/dashboard')}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium"
                >
                    Your Dashboard
                </a>
            </div>
        </div>

    );
}

Footer.propTypes = {};

export default Footer;
