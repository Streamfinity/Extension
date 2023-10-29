import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { findVideoPlayerBar } from '~/common/utility';
import { useAppStore } from '~/entries/contentScript/primary/state';
import { createLogger } from '~/common/log';

const log = createLogger('Content-Rating');

function ContentRatingHeadless() {
    const [playerBarElement, setPlayerBarElement] = useState(null);
    const [initialized, setInitialized] = useState(false);

    function initContentRating(element) {
        if (initialized) {
            return;
        }

        setInitialized(true);

        const foo = document.createElement('div');
        foo.style.position = 'absolute';
        foo.style.width = '30px';
        foo.style.height = '100%';
        foo.style.left = '120px';
        foo.style.top = '0px';
        foo.style.zIndex = '60';
        foo.style.backgroundColor = '#2563eb';

        element.append(foo);

        log.debug('appended segments');
    }

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

    useEffect(() => {
        if (playerBarElement) {
            initContentRating(playerBarElement);
        }
    }, [playerBarElement]);

    return (
        <div />
    );
}

ContentRatingHeadless.propTypes = {

};

ContentRatingHeadless.defaultProps = {};

export default ContentRatingHeadless;
