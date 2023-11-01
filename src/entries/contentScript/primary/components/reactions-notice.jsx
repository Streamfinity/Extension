import React from 'react';
import { usePage } from '~/hooks/usePage';
import Card, { CardTitle } from '~/entries/contentScript/primary/components/card';
import useAuth from '~/hooks/useAuth';

function ReactionsNotice() {
    const { currentUrl } = usePage();
    const { user } = useAuth();

    return (
        <Card>
            <CardTitle>Reaction</CardTitle>
            <p>
                {currentUrl}
            </p>
        </Card>
    );
}

ReactionsNotice.propTypes = {};

ReactionsNotice.defaultProps = {};

export default ReactionsNotice;
