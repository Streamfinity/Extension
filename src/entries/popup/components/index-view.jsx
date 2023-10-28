import React from 'react';
import { openLoginPage } from '~/hooks/useAuth';

function IndexView() {
    async function login() {
        await openLoginPage();
    }

    return (
        <div className="h-full flex items-center justify-center">

            <button
                type="button"
                onClick={login}
                className="bg-primary-500 text-white font-semibold px-8 py-2 rounded-md hover:bg-primary-600"
            >
                Login with Streamfinity
            </button>
        </div>
    );
}

export default IndexView;
