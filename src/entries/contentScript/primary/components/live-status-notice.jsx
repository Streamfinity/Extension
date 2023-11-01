import React from 'react';
import PropTypes from 'prop-types';
import { buildFrontendUrl } from '~/common/utility';
import Card from '~/entries/contentScript/primary/components/card';

function LiveStatusNotice({ isLive, liveStream }) {
    if (isLive) {
        return (
            <a
                href={buildFrontendUrl('/dashboard/streams')}
                target="_blank"
                rel="noreferrer"
            >
                <Card
                    rounded
                    color="red"
                >
                    You are live
                    {liveStream && ` on ${liveStream?.account?.display_name}`}
                </Card>
            </a>
        );
    }
    return (

        <Card
            rounded
            className="dark:text-white/60"
        >
            You are currently offline
        </Card>
    );
}

LiveStatusNotice.propTypes = {
    isLive: PropTypes.bool.isRequired,
    liveStream: PropTypes.shape({
        title: PropTypes.string,
        account: PropTypes.shape({
            display_name: PropTypes.string,
        }),
    }),
};

LiveStatusNotice.defaultProps = {
    liveStream: null,
};

export default LiveStatusNotice;
