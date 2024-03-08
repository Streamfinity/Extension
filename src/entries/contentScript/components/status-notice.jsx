import React from 'react';
import PropTypes from 'prop-types';
import { SignalIcon } from '@heroicons/react/16/solid';
import { buildFrontendUrl } from '~/common/utility';
import { STATE_DEFAULT, STATE_LIVE, STATE_OWN_VIDEO } from '~/hooks/useAuth';

function StatusNotice({ state, liveStream }) {
    if (state === STATE_LIVE) {
        return (
            <a
                href={buildFrontendUrl('/dashboard/streams')}
                target="_blank"
                rel="noreferrer"
            >
                <div className="flex items-center gap-3 rounded-lg bg-brand-streamer-gradient-from px-4 py-1 text-white">
                    <SignalIcon className="size-8" />
                    <div>
                        <span className="font-bold uppercase">
                            You are live
                        </span>
                        {liveStream && ` on ${liveStream?.service?.title} (${liveStream?.account?.display_name})`}
                    </div>
                </div>
            </a>
        );
    }
    return null;
}

StatusNotice.propTypes = {
    state: PropTypes.oneOf([
        STATE_DEFAULT,
        STATE_LIVE,
        STATE_OWN_VIDEO,
    ]),
    liveStream: PropTypes.shape({
        title: PropTypes.string,
        account: PropTypes.shape({
            display_name: PropTypes.string,
        }),
        service: PropTypes.shape({
            title: PropTypes.string,
        }),
    }),
};

StatusNotice.defaultProps = {
    liveStream: null,
    state: STATE_DEFAULT,
};

export default StatusNotice;
