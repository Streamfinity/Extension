import React, { useState, useEffect, useMemo } from 'react';
import './app.css';
import SettingsView from '~/entries/popup/components/settings-view';
import LoginView from '~/entries/popup/components/login-view';
import useAuth from '~/hooks/useAuth';
import { useBackgroundEvents } from '~/entries/contentScript/hooks/useBackgroundEvents';
import Logo from '~/components/logo';

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
        <main className="dark flex h-[21rem] min-w-[21rem] flex-col bg-black text-white">
            <div>
                <div className="flex justify-center p-3">
                    <Logo size="small" />
                </div>
            </div>

            <div className="h-full p-4">
                <div className="h-full">
                    {(!loadingAuth && user) && (
                        <ActiveViewComponent user={user} />
                    )}

                    {(!loadingAuth && !user) && (
                        <LoginView />
                    )}
                </div>
            </div>

        </main>
    );
}

export default App;
