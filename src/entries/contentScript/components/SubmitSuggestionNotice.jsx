import React, { useState } from 'react';
import { Button } from '@streamfinity/streamfinity-branding';
import { useTranslation } from 'react-i18next';
import Card, { CardTitle } from '~/entries/contentScript/components/Card';
import SubmitSuggestionForm from '~/entries/contentScript/components/SubmitSuggestionForm';

function SubmitSuggestionNotice() {
    const { t } = useTranslation();
    const [showForm, setShowForm] = useState(false);

    return (
        <Card
            color="brand-viewer"
            className="flex flex-col"
        >
            <CardTitle>
                {t('submitSuggestion.title')}
            </CardTitle>

            {!showForm && (
                <div className="flex gap-4">
                    <div className="grow">
                        <p className="text-sm">
                            {t('submitSuggestion.intro')}
                        </p>
                    </div>
                    <div className="flex grow items-end">
                        <Button
                            color="brand-viewer"
                            className="w-full"
                            onClick={() => setShowForm(true)}
                        >
                            {t('submitSuggestion.suggestVideo')}
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
