import React from 'react';
import PropTypes from 'prop-types';
import { usePage } from '~/hooks/usePage';
import Card, { CardTitle } from '~/entries/contentScript/primary/components/card';

function ReactionsNotice() {
    const { currentUrl } = usePage();

    return (
        <Card>
            <CardTitle>Reaction</CardTitle>
            <p>
                {currentUrl}
            </p>
        </Card>
    );
}

ReactionsNotice.propTypes = {

};

ReactionsNotice.defaultProps = {};

export default ReactionsNotice;
