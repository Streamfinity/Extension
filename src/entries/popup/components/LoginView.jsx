import React from 'react';
import useAuth from '~/hooks/useAuth';
import LoginButton from '~/components/LoginButton';
import { getApiUrl } from '~/config';

/**
 * Renders a login view component.
 * 
 * This component displays a login button that triggers the login process when clicked.
 * It also shows the current environment's hostname fetched from the API URL.
 * 
 * @returns {JSX.Element} The rendered login view component.
 */
function LoginView() {
    const { login, loadingLogin } = useAuth();

    const endpoint = new URL(getApiUrl());

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
