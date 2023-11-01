import React, { useState, useEffect } from 'react';
import { findVideoPlayerBar, findYouTubePlayer } from '~/common/utility';
import { useAppStore } from '~/entries/contentScript/primary/state';
import { createLogger } from '~/common/log';
import Card, { CardTitle } from '~/entries/contentScript/primary/components/card';
import { useContentRatings } from '~/common/bridge';

const log = createLogger('Content-Rating');

function ContentRatingNotice() {
    const { currentUrl } = useAppStore();

    const [playerBarElement, setPlayerBarElement] = useState(null);
    const [initialized, setInitialized] = useState(false);

    async function displayContentRatingSegmentsInPlayer(segments) {
        if (initialized) {
            return;
        }

        log.debug('spitting into player', segments);

        setInitialized(true);

        const player = await findYouTubePlayer();
        const playBar = await findVideoPlayerBar();

        console.log(player, playBar);

        const foo = document.createElement('div');
        foo.style.position = 'absolute';
        foo.style.width = '30px';
        foo.style.height = '100%';
        foo.style.left = '120px';
        foo.style.top = '0px';
        foo.style.zIndex = '60';
        foo.style.backgroundColor = '#2563eb';

        parentElement.append(foo);

        log.debug('appended segments');
    }

    const { items: contentRatings } = useContentRatings({ videoUrl: currentUrl });

    useEffect(() => {
        let clear = null;

        async function find() {
            if (playerBarElement) {
                return;
            }

            const [findElement, clearFunction] = findVideoPlayerBar();
            clear = clearFunction;
            const el = await findElement();

            log.debug('found progress bar', el);
            setPlayerBarElement(el);
        }

        find();

        return () => clear();
    }, []);

    // Listen for content rating results and mount in player

    useEffect(() => {
        if (!contentRatings?.length || !playerBarElement) {
            return;
        }

        displayContentRatingSegmentsInPlayer(contentRatings, playerBarElement);
    }, [contentRatings, playerBarElement]);

    if (!contentRatings || contentRatings.length === 0) {
        return (<div />);
    }

    return (
        <Card className="p-4 rounded-xl">
            <CardTitle>
                Content Rating
            </CardTitle>
            <div>
                {contentRatings.map((rating) => (
                    <div key={`${rating.from}-${rating.to}-${rating.type}`}>
                        {rating.type_title}
                    </div>
                ))}
            </div>
        </Card>
    );
}

ContentRatingNotice.propTypes = {

};

ContentRatingNotice.defaultProps = {};

export default ContentRatingNotice;
