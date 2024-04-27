import React from 'react';
import useAuth from '~/hooks/useAuth';
import LoginButton from '~/components/LoginButton';

function LoginView() {
    const { login, loadingLogin } = useAuth();

    const endpoint = new URL(import.meta.env.VITE_API_URL);

    return (
        <div className="flex h-full items-center justify-center">
            <div className="w-full">
                <LoginButton
                    loading={loadingLogin}
                    onClick={login}
                />
                <div className="mt-2 text-center text-xs text-gray-300">
                    Environment:
                    {' '}
                    {endpoint.hostname}
                </div>
            </div>
        </div>
    );
}

export default LoginView;
