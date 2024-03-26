import React from 'react';
import { Button } from '@streamfinity/streamfinity-branding';
import Card, { CardTitleSubtle } from '~/entries/contentScript/components/Card';
import useAuth, { STATE_DEFAULT } from '~/hooks/useAuth';

function StreamerModeNotice() {
    const { setOverrideState } = useAuth();

    return (
        <Card className="flex gap-4">
            <div className="grow text-sm">
                <CardTitleSubtle>
                    Deactivate Streamer Mode
                </CardTitleSubtle>
                <p>
                    Show all hidden elements of the extension until you reload the page.
                </p>
            </div>
            <div className="flex grow items-center">
                <Button
                    color="brand-streamer"
                    className="w-full"
                    onClick={() => setOverrideState(STATE_DEFAULT)}
                >
                    Show All
                </Button>
            </div>
        </Card>
    );
}

StreamerModeNotice.propTypes = {};

StreamerModeNotice.defaultProps = {};

export default StreamerModeNotice;
