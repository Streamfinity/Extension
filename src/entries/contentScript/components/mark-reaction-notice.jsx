import React, { useState, Fragment } from 'react';
import Card, { CardTitle, CardTitleSubtle } from '~/entries/contentScript/components/card';
import Button from '~/entries/contentScript/components/button';
import MarkReactionForm from '~/entries/contentScript/components/mark-reaction-form';
import { useAppStore } from '~/entries/contentScript/state';

function MarkReactionNotice() {
    const [showForm, setShowForm] = useState(false);

    const currentUrl = useAppStore((state) => state.currentUrl);

    return (
        <Card className="flex flex-col">

            {!showForm && (
                <div className="flex gap-4">
                    <div className="grow text-sm">
                        <CardTitleSubtle>
                            Untracked Reaction?
                        </CardTitleSubtle>
                        <p>
                            If this video is a reaction to another type of content, you can help use by
                            providing information.
                        </p>
                    </div>
                    <div className="flex grow items-center">
                        <Button
                            color="primary"
                            className="w-full"
                            onClick={() => setShowForm(true)}
                        >
                            Mark as Reaction
                        </Button>
                    </div>
                </div>
            )}

            {showForm && (
                <>
                    <CardTitle>
                        Submit Reaction
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
