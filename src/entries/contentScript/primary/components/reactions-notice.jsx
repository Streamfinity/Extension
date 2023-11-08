import React from 'react';
import moment from 'moment';
import { usePage } from '~/hooks/usePage';
import Card, { CardTitle } from '~/entries/contentScript/primary/components/card';
import { useReactions } from '~/common/bridge';

function ReactionsNotice() {
    const { currentUrl } = usePage();
    const { data: reactions } = useReactions({ videoUrl: currentUrl });

    console.log(reactions);

    if (!reactions || reactions?.length === 0) {
        return (<div />);
    }

    return (
        <Card>
            <CardTitle>
                Reaction
            </CardTitle>
            <div className="flex flex-col gap-1 text-sm">
                {reactions.map((reaction) => (
                    <div key={reaction.id}>
                        {reaction.from_stream?.account?.display_name}
                        {' '}
                        watched this video
                        {' '}
                        {moment(reaction.reaction_timestamp_start).fromNow()}
                        {reaction.from_stream && (
                            <>
                                {' '}
                                in a
                                {' '}
                                {reaction.from_stream?.account?.service?.title}
                                {' '}
                                livestream
                            </>
                        )}
                    </div>
                ))}
            </div>
        </Card>
    );
}

ReactionsNotice.propTypes = {};

ReactionsNotice.defaultProps = {};

export default ReactionsNotice;
