import React from 'react';
import { Button } from '@streamfinity/streamfinity-branding';
import { useTranslation } from 'react-i18next';
import Card from '~/entries/contentScript/components/Card';
import useAuth, { STATE_DEFAULT } from '~/hooks/useAuth';
import { useAppStore } from '~/entries/contentScript/state';

/**
 * Function component for displaying a notice in streamer mode.
 * Uses translation and authentication hooks to render a Card component with a title and description.
 * Includes a Button component to allow users to show all content.
 */
function StreamerModeNotice() {
    const { t } = useTranslation();
    const { setOverrideState } = useAuth();

    const compact = useAppStore((state) => state.isCompact);

    return (
        <Card
            title={t('status.disableStreamerMode')}
            compact={compact}
        >
            <div className="flex gap-2">
                <div className="grow text-sm">
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
            </div>
        </Card>
    );
}

StreamerModeNotice.propTypes = {};

StreamerModeNotice.defaultProps = {};

export default StreamerModeNotice;
