import React, { useEffect, useState, useRef } from 'react';
import { XMarkIcon } from '@heroicons/react/16/solid';
import PropTypes from 'prop-types';

const availableVideoItems = [{
    name: 'Roman',
    url: 'https://cdn.streamfinity.tv/extension-assets/subway-surfer-roman.mp4',
}, {
    name: 'Christian',
    url: 'https://cdn.streamfinity.tv/extension-assets/subway-surfer-christian.mp4',
}, {
    name: 'Chris',
    url: 'https://cdn.streamfinity.tv/extension-assets/subway-surfer-chris.mp4',
}, {
    name: 'Matze',
    url: 'https://cdn.streamfinity.tv/extension-assets/subway-surfer-matze.mp4',
}, {
    name: 'Mina',
    url: 'https://cdn.streamfinity.tv/extension-assets/subway-surfer-mina.mp4',
}];

function SubwaySurfer({ onClose }) {
    const [videoItem, setVideoItem] = useState(null);

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * availableVideoItems.length);
        if (videoItem === null) {
            setVideoItem(availableVideoItems[randomIndex]);
        }
    }, []);

    const video = useRef();

    if (!videoItem) {
        return null;
    }

    return (
        <div className="relative overflow-hidden rounded-lg">
            <button
                type="button"
                onClick={() => onClose()}
                className="absolute right-0 top-0 z-20 cursor-pointer p-3 text-white"
            >
                <XMarkIcon className="size-8" />
            </button>

            <div className="absolute left-0 top-0 w-full bg-gradient-to-b from-black/40 to-black/0 p-2 pb-12 text-center font-semibold text-white">
                Gameplay by
                {' '}
                {videoItem.name}
            </div>

            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
                onCanPlay={() => video.current.playbackRate = 1.5}
                ref={video}
                width="100%"
                autoPlay
                muted
                loop
                className="z-10"
            >
                <source
                    src={videoItem.url}
                    type="video/mp4"
                />
            </video>

        </div>
    );
}

SubwaySurfer.propTypes = {
    onClose: PropTypes.func.isRequired,
};

SubwaySurfer.defaultProps = {};

export default SubwaySurfer;
