import React from 'react';
import useAuth from '~/hooks/useAuth';
import LoginButton from '~/components/login-button';

function LoginView() {
    const { login, loadingLogin } = useAuth();

    return (
        <div className="flex h-full items-center justify-center">

            <LoginButton
                loading={loadingLogin}
                onClick={login}
            />
        </div>
    );
}

export default LoginView;
