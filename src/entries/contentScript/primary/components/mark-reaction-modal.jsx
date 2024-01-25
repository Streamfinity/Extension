import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from '~/styles/input.module.css';
import H3Header from '~/entries/contentScript/primary/components/h3-header';
import Button from '~/entries/contentScript/primary/components/button';
import { prettyDuration } from '~/common/pretty';
import { submitReaction } from '~/common/bridge';
import { useYouTubePlayer } from '~/hooks/useYouTubePlayer';

/**
 * Represents a modal component for marking a reaction in a video.
 * @param {Object} props - The component props.
 * @param {Function} props.onSubmitted - The callback function to be called when the reaction is submitted.
 * @returns {JSX.Element} The JSX element representing the MarkReactionModal component.
 */
function MarkReactionModal({ onSubmitted }) {
    const [loading, setLoading] = useState(false);

    const [originalUrl, setOriginalUrl] = useState('');

    const [segmentFull, setSegmentFull] = useState(null);
    const [segmentStart, setSegmentStart] = useState(null);
    const [segmentEnd, setSegmentEnd] = useState(null);

    const { progress: playerProgress, element: playerElement } = useYouTubePlayer({
        pollInterval: 1000,
    });

    function fullSegment() {
        if (segmentStart) {
            return;
        }

        setSegmentFull(true);
    }

    function startSegment() {
        if (segmentFull || segmentStart) {
            return;
        }

        if (!playerElement) {
            alert('Player not found');
            return;
        }

        setSegmentStart(playerProgress);
    }

    function endSegment() {
        if (segmentFull || !segmentStart) {
            return;
        }

        if (!playerElement) {
            alert('Player not found');
            return;
        }

        setSegmentEnd(playerProgress);
    }

    async function submit() {
        if (loading) {
            return;
        }

        setLoading(true);

        try {
            await submitReaction({
                from: parseInt(segmentStart, 10),
                to: parseInt(segmentEnd, 10),
                original_video_url: originalUrl,
                from_video_url: window.location.href,
            });

            onSubmitted();
        } catch (err) {
            alert(err);
        }

        setLoading(false);
    }

    return (
        <div>
            <p>
                If this video is or contains a reaction to another video, you can mark it as this.
                Please note that every submission will be reviewed.
            </p>

            <H3Header step={1}>
                Wich part is the reaction?
            </H3Header>

            <div className="flex">
                <div className="flex-1">
                    <Button
                        color="primary"
                        className="w-full"
                        disabled={!!segmentStart}
                        onClick={() => fullSegment()}
                    >
                        Full Video
                    </Button>
                </div>
                <div className="w-14 flex flex-col items-center justify-center">
                    <div className="w-px h-16 bg-gray-500" />
                    <div className="py-2 text-gray-400">
                        OR
                    </div>
                    <div className="w-px h-16 bg-gray-500" />
                </div>
                <div className="flex-1 flex flex-col gap-4">
                    <Button
                        color="primary"
                        disabled={!!segmentFull || !!segmentStart}
                        className="w-full"
                        onClick={() => startSegment()}
                    >
                        {segmentStart ? prettyDuration(segmentStart) : `Start at ${prettyDuration(playerProgress)}`}
                    </Button>
                    <Button
                        color="primary"
                        className="w-full"
                        disabled={!!segmentFull || !segmentStart}
                        onClick={() => endSegment()}
                    >
                        {segmentEnd && prettyDuration(segmentEnd)}
                        {(!segmentEnd && segmentStart) && `End at ${prettyDuration(playerProgress)}`}
                        {(!segmentEnd && !segmentStart) && 'End Segment'}
                    </Button>
                </div>
            </div>

            <H3Header step={2}>
                To which video was reacted?
            </H3Header>

            <div>
                <input
                    id="originalUrl"
                    autoFocus
                    type="text"
                    autoComplete="off"
                    placeholder="https://youtu.be/dQw4w9WgXcQ"
                    value={originalUrl}
                    onChange={(e) => setOriginalUrl(e.target.value)}
                    className={styles.input}
                />
            </div>

            <H3Header step={3}>
                Submit
            </H3Header>

            <Button
                color="primary"
                className="w-full"
                disabled={loading}
                onClick={() => submit()}
            >
                Submit Reaction
            </Button>
        </div>
    );
}

MarkReactionModal.propTypes = {
    onSubmitted: PropTypes.func.isRequired,
};

MarkReactionModal.defaultProps = {};

export default MarkReactionModal;
