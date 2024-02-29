import React from 'react';
import PropTypes from 'prop-types';
import Card, { CardTitle } from '~/entries/contentScript/components/card';
import Button from '~/entries/contentScript/components/button';

function SubmitSuggestionNotice({ onClick }) {
    return (
        <Card
            color="brand-viewer"
            className="flex flex-col"
        >
            <CardTitle>
                Suggestion
            </CardTitle>
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
                        onClick={() => onClick()}
                    >
                        Suggest Video
                    </Button>
                </div>
            </div>
        </Card>
    );
}

SubmitSuggestionNotice.propTypes = {
    onClick: PropTypes.func.isRequired,
};

SubmitSuggestionNotice.defaultProps = {};

export default SubmitSuggestionNotice;
