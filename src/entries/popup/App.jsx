import React, { useState, useEffect } from 'react';
import './App.css';
import classNames from 'classnames';
import InfoView from '~/entries/popup/components/InfoView';
import SettingsView from '~/entries/popup/components/SettingsView';
import { useStatus } from '~/hooks/useStatus';
import IndexView from '~/entries/popup/components/IndexView';

const availableViews = [
    {
        title: 'Info',
        component: InfoView,
    }, {
        title: 'Options',
        component: SettingsView,
    },
];

function App() {
    const [activeView, setActiveView] = useState(availableViews[0]);
    const ActiveViewComponent = activeView.component;

    const { user, refresh: refreshStatus, hasData } = useStatus();

    console.log(user);

    useEffect(() => {
        refreshStatus();
    }, []);

    console.log(user);

    return (
        <main className="min-w-[21rem] h-[21rem] flex flex-col">
            <div>
                <div className="p-3">
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
                    {hasData ? (
                        <ActiveViewComponent
                            user={user}
                            refreshStatus={refreshStatus}
                        />
                    ) : (
                        <IndexView />
                    )}
                    {user && (
                        <div>
                            {user.display_name}
                        </div>
                    )}

                </div>
            </div>

        </main>
    );
}

export default App;
