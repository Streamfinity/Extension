import React from 'react';
import useAuth from '~/hooks/useAuth';

function DevTools() {
    const {
        state, user, liveStreams, accounts, isLive,
    } = useAuth();

    return (
        <div className="relative my-6 overflow-hidden rounded-md border-2 border-red-600 p-2 pt-8 text-sm dark:text-white">
            <div className="absolute left-0 top-0 rounded-br-md bg-red-600 px-2 text-sm font-medium uppercase leading-normal text-white">
                Streamfinity Dev Tools
            </div>
            <div>
                <b>Endpoint:</b>
                {' '}
                {import.meta.env.VITE_API_URL}
                <br />
                <b>State:</b>
                {' '}
                {state}
            </div>
            <hr />
            <div>
                <b>Logged in as:</b>
                {' '}
                {user ? (
                    <>
                        <br />
                        -
                        {' '}
                        <span>{user.display_name}</span>
                        {' '}
                        <span className="opacity-50">{`(${user.id})`}</span>
                    </>
                ) : (<span>...</span>)}
            </div>
            <hr />
            <div>
                <b>Accounts for reaction tracking:</b>
                {' '}
                {accounts?.map((a) => (
                    <div key={a.id}>
                        {`  - ${a.name}`}
                        {' '}
                        <span className="opacity-50">{`(${a.id})`}</span>
                    </div>
                ))}
            </div>
            <hr />
            <div>
                <b>Live:</b>
                {' '}
                {!isLive && 'not live'}
                {liveStreams?.map((a) => (
                    <div key={a.id}>{`  - ${a.title} (${a.id})`}</div>
                ))}
            </div>
            <hr />
        </div>
    );
}

DevTools.propTypes = {};

DevTools.defaultProps = {};

export default DevTools;
