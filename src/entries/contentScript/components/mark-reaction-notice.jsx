import React from 'react';
import PropTypes from 'prop-types';
import Card from '~/entries/contentScript/components/card';
import Button from '~/entries/contentScript/components/button';

function MarkReactionNotice({ onClick }) {
    return (
        <Card className="flex flex-col">
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
