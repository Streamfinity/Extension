import React from 'react';
import useAuth from '~/hooks/useAuth';

function DevTools() {
    const {
        user, liveStreams, accounts, isLive,
    } = useAuth();

    return (
        <div className="relative p-2 pt-8 mt-6 mb-2 border-2 border-red-600 rounded-md overflow-hidden text-sm">
            <div className="absolute left-0 top-0 px-2 text-sm bg-red-600 text-white font-medium uppercase rounded-br-md leading-normal">
                Streamfinity Dev Tools
            </div>
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
