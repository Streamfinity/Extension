import React, { useState, Fragment, useEffect } from 'react';
import { Button } from '@streamfinity/streamfinity-branding';
import { useTranslation } from 'react-i18next';
import Card, { CardTitle } from '~/entries/contentScript/components/Card';
import MarkReactionForm from '~/entries/contentScript/components/MarkReactionForm';
import { useAppStore } from '~/entries/contentScript/state';

function MarkReactionNotice() {
    const { t } = useTranslation();
    const [showForm, setShowForm] = useState(false);

    const currentUrl = useAppStore((state) => state.currentUrl);

    useEffect(() => {
        setShowForm(false);
    }, [currentUrl]);

    return (
        <Card className="flex flex-col">

            {!showForm && (
                <div className="flex gap-4">
                    <div className="grow">
                        <CardTitle>
                            {t('markReaction.title')}
                        </CardTitle>
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
                <>
                    <CardTitle>
                        {t('actions.submitReaction')}
                    </CardTitle>
                    <Fragment key={currentUrl}>
                        <MarkReactionForm onSubmitted={() => setShowForm(false)} />
                    </Fragment>
                </>
            )}
        </Card>
    );
}

MarkReactionNotice.propTypes = {};

MarkReactionNotice.defaultProps = {};

export default MarkReactionNotice;
