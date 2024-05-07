import React from 'react';
import { Button } from '@streamfinity/streamfinity-branding';
import { useTranslation } from 'react-i18next';
import Card, { CardTitle } from '~/entries/contentScript/components/Card';
import useAuth, { STATE_DEFAULT } from '~/hooks/useAuth';

function StreamerModeNotice() {
    const { t } = useTranslation();
    const { setOverrideState } = useAuth();

    return (
        <Card className="flex gap-4">
            <div className="grow text-sm">
                <CardTitle>
                    {t('status.disableStreamerMode')}
                </CardTitle>
                <p>
                    {t('status.disableStreamerModeDescription')}
                </p>
            </div>
            <div className="flex grow items-center">
                <Button
                    color="brand-streamer"
                    className="w-full"
                    onClick={() => setOverrideState(STATE_DEFAULT)}
                >
                    {t('actions.showAll')}
                </Button>
            </div>
        </Card>
    );
}

StreamerModeNotice.propTypes = {};

StreamerModeNotice.defaultProps = {};

export default StreamerModeNotice;
