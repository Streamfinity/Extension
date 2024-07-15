import React, { useState, Fragment, useEffect } from 'react';
import { Button } from '@streamfinity/streamfinity-branding';
import { useTranslation } from 'react-i18next';
import Card from '~/entries/contentScript/components/Card';
import MarkReactionForm from '~/entries/contentScript/components/MarkReactionForm';
import { useAppStore } from '~/entries/contentScript/state';

function MarkReactionNotice() {
    const { t } = useTranslation();
    const [showForm, setShowForm] = useState(false);

    const currentUrl = useAppStore((state) => state.currentUrl);
    const compact = useAppStore((state) => state.isCompact);

    useEffect(() => {
        setShowForm(false);
    }, [currentUrl]);

    return (
        <Card
            id="mr"
            title={t('markReaction.title')}
            className="flex flex-col"
            compact={compact}
        >

            {!showForm && (
                <div>
                    <Button
                        color="primary"
                        className="float-right ml-4"
                        onClick={() => setShowForm(true)}
                        usePx={false}
                    >
                        {t('actions.markAsReaction')}
                    </Button>

                    <p className="text-sm">
                        {t('markReaction.intro')}
                    </p>
                </div>
            )}

            {showForm && (
                <Fragment key={currentUrl}>
                    <MarkReactionForm onSubmitted={() => setShowForm(false)} />
                </Fragment>
            )}
        </Card>
    );
}

MarkReactionNotice.propTypes = {};

MarkReactionNotice.defaultProps = {};

export default MarkReactionNotice;
