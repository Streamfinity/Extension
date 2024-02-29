import React from 'react';
import PropTypes from 'prop-types';
import Card, { CardTitle } from '~/entries/contentScript/components/card';
import Button from '~/entries/contentScript/components/button';

function MarkReactionNotice({ onClick }) {
    return (
        <Card
            color="brand-viewer"
            className="flex flex-col"
        >
            <CardTitle>
                Reaction
            </CardTitle>
            <div className="flex gap-4">
                <div className="grow">
                    <p className="text-sm">
                        If this video is a reaction to another type of content, you can help use by
                        providing information.
                    </p>
                </div>
                <div className="flex grow items-end">
                    <Button
                        color="brand-viewer"
                        className="w-full"
                        onClick={() => onClick()}
                    >
                        Mark as Reaction
                    </Button>
                </div>
            </div>
        </Card>
    );
}

MarkReactionNotice.propTypes = {
    onClick: PropTypes.func.isRequired,
};

MarkReactionNotice.defaultProps = {};

export default MarkReactionNotice;
