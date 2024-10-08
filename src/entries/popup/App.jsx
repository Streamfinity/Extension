import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import '@streamfinity/streamfinity-branding/dist/index.css';
import SettingsView from '~/entries/popup/components/SettingsView';
import LoginView from '~/entries/popup/components/LoginView';
import useAuth from '~/hooks/useAuth';
import { useBackgroundEvents } from '~/entries/contentScript/hooks/useBackgroundEvents';
import Header from '~/components/Header';

const availableViews = [
    {
        title: 'Options',
        component: SettingsView,
    },
];

function App() {
    const [activeView] = useState(availableViews[0]);
    const ActiveViewComponent = useMemo(() => activeView.component, [activeView]);

    const { user, refreshStatusData, loadingAuth } = useAuth();

    useBackgroundEvents();

    useEffect(() => {
        refreshStatusData();
    }, []);

    return (
        <main className="dark flex h-[23rem] min-w-[21rem] flex-col overflow-y-auto bg-black font-sans text-white">
            <div>
                <div className="flex justify-center p-3">
                    <Header size="small" />
                </div>
            </div>

            <div className="h-full p-4">
                {(!loadingAuth && user) && (
                    <ActiveViewComponent user={user} />
                )}

                {(!loadingAuth && !user) && (
                    <LoginView />
                )}
            </div>

        </main>
    );
}

export default App;
