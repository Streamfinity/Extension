import React, { useState } from 'react';
import { Button } from '@streamfinity/streamfinity-branding';
import { useTranslation } from 'react-i18next';
import Card from '~/entries/contentScript/components/Card';
import SubmitSuggestionForm from '~/entries/contentScript/components/SubmitSuggestionForm';
import { useAppStore } from '~/entries/contentScript/state';

function SubmitSuggestionNotice() {
    const { t } = useTranslation();
    const [showForm, setShowForm] = useState(false);

    const compact = useAppStore((state) => state.isCompact);

    return (
        <Card
            id="ss"
            title={t('submitSuggestion.title')}
            titleCompact={t('submitSuggestion.titleCompact')}
            color="brand-viewer"
            className="flex flex-col"
            compact={compact}
        >
            {!showForm && (
                <div className="flex gap-4">
                    <div className="grow">
                        <p className="text-sm">
                            {t('submitSuggestion.intro')}
                        </p>
                    </div>
                    <div className="flex grow items-center">
                        <Button
                            color="primary"
                            className="w-full"
                            onClick={() => setShowForm(true)}
                            usePx={false}
                        >
                            {t('actions.suggestVideo')}
                        </Button>
                    </div>
                </div>
            )}

            {showForm && (
                <SubmitSuggestionForm onSubmit={() => setShowForm(false)} />
            )}
        </Card>
    );
}

SubmitSuggestionNotice.propTypes = {};

SubmitSuggestionNotice.defaultProps = {};

export default SubmitSuggestionNotice;
