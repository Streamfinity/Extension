import React, { useState } from 'react';
import { Button } from '@streamfinity/streamfinity-branding';
import Card, { CardTitle } from '~/entries/contentScript/components/Card';
import SubmitSuggestionForm from '~/entries/contentScript/components/SubmitSuggestionForm';

function SubmitSuggestionNotice() {
    const [showForm, setShowForm] = useState(false);

    return (
        <Card
            color="brand-viewer"
            className="flex flex-col"
        >
            <CardTitle>
                Suggestion
            </CardTitle>

            {!showForm && (
                <div className="flex gap-4">
                    <div className="grow">
                        <p className="text-sm">
                            Send this video as a suggestion to your favorite streamers.
                        </p>
                    </div>
                    <div className="flex grow items-end">
                        <Button
                            color="brand-viewer"
                            className="w-full"
                            onClick={() => setShowForm(true)}
                        >
                            Suggest Video
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
