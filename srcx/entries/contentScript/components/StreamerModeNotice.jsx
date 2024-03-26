import React from 'react';
import Card, { CardTitleSubtle } from '~/entries/contentScript/components/card';
import Button from '~/entries/contentScript/components/button';
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
