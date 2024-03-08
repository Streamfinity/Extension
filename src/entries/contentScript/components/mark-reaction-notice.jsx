import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Card, { CardTitle } from '~/entries/contentScript/components/card';
import Button from '~/entries/contentScript/components/button';
import MarkReactionForm from '~/entries/contentScript/components/mark-reaction-form';

function MarkReactionNotice() {
    const [showForm, setShowForm] = useState(false);

    return (
        <Card className="flex flex-col">

            {!showForm && (
                <div className="flex gap-4">
                    <div className="grow text-sm">
                        <b>
                            Untracked Reaction?
                        </b>
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
                    <MarkReactionForm onSubmitted={() => setShowForm(false)} />
                </>
            )}
        </Card>
    );
}

MarkReactionNotice.propTypes = {};

MarkReactionNotice.defaultProps = {};

export default MarkReactionNotice;
