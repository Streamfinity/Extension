import React from 'react';
import { usePage } from '~/hooks/usePage';
import { useOriginalVideos } from '~/common/bridge';
import Card, { CardTitle } from '~/entries/contentScript/components/card';

function OriginalVideoNotice() {
    const { currentUrl } = usePage();

    const { data: originalVideoReactions } = useOriginalVideos({
        videoUrl: currentUrl,
    });

    console.log(originalVideoReactions);

    if (originalVideoReactions?.length > 0) {
        return (
            <Card color="brand-viewer">
                <CardTitle>
                    Original Video
                    {originalVideoReactions.length > 1 ? 's' : ''}
                </CardTitle>
                dings hier
            </Card>
        );
    }

    return null;
}

OriginalVideoNotice.propTypes = {};

OriginalVideoNotice.defaultProps = {};

export default OriginalVideoNotice;
