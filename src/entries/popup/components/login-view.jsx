import React from 'react';
import useAuth from '~/hooks/useAuth';

function LoginView() {
    const { login, loadingLogin } = useAuth();

    return (
        <div className="flex h-full items-center justify-center">

            <button
                type="button"
                disabled={loadingLogin}
                onClick={login}
                className="rounded-md bg-gradient-to-r from-primary-gradient-from to-primary-gradient-to px-8 py-2 font-semibold text-white hover:bg-primary-600"
            >
                Login with Streamfinity
            </button>
        </div>
    );
}

export default LoginView;
