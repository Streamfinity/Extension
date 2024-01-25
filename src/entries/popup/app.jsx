import React, { useState, useEffect } from 'react';
import './app.css';
import classNames from 'classnames';
import InfoView from '~/entries/popup/components/info-view';
import SettingsView from '~/entries/popup/components/settings-view';
import IndexView from '~/entries/popup/components/index-view';
import useAuth from '~/hooks/useAuth';
import { useBackgroundEvents } from '~/entries/contentScript/hooks/useBackgroundEvents';

const availableViews = [
    {
        title: 'Info',
        component: InfoView,
    }, {
        title: 'Options',
        component: SettingsView,
    },
];

/**
 * Represents the main component of the popup application.
 *
 * @returns {JSX.Element} The rendered App component.
 */
function App() {
    const [activeView, setActiveView] = useState(availableViews[0]);
    const ActiveViewComponent = activeView.component;

    const { user, refreshUserData, loadingAuth } = useAuth();

    useBackgroundEvents();

    useEffect(() => {
        refreshUserData();
    }, []);

    return (
        <main className="min-w-[21rem] h-[21rem] flex flex-col">
            <div>
                <div className="p-3 text-center">
                    <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-gray-600 dark:from-gray-200 to-gray-800 dark:to-gray-400">
                        Streamfinity
                    </div>
                </div>

                <div className="flex text-center gap-2 px-2">
                    {availableViews.map((view) => (
                        <button
                            key={view.title}
                            type="button"
                            onClick={() => setActiveView(view)}
                            className={classNames(
                                view.title === activeView.title
                                    ? 'bg-primary-50 text-primary-600'
                                    : 'hover:bg-gray-100/80 text-gray-600 bg-gray-50',
                                'flex-1 font-semibold rounded-md p-2 transition-colors duration-100',
                            )}
                        >
                            {view.title}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-full p-2">
                <div className="h-full p-2 bg-gray-50 rounded-lg">
                    {(!loadingAuth && user) && (
                        <ActiveViewComponent user={user} />
                    )}

                    {(!loadingAuth && !user) && (
                        <IndexView />
                    )}
                </div>
            </div>

        </main>
    );
}

export default App;
