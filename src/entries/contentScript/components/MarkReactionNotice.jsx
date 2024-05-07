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
    const compact = useAppStore((state) => state.isMinimized);

    useEffect(() => {
        setShowForm(false);
    }, [currentUrl]);

    return (
        <Card
            title={t('markReaction.title')}
            className="flex flex-col"
            compact={compact}
        >

            {!showForm && (
                <div className="flex gap-4">
                    <div className="grow">
                        <p className="text-sm">
                            {t('markReaction.intro')}
                        </p>
                    </div>
                    <div className="flex grow items-center">
                        <Button
                            color="primary-gradient"
                            className="w-full"
                            onClick={() => setShowForm(true)}
                        >
                            {t('actions.markAsReaction')}
                        </Button>
                    </div>
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
