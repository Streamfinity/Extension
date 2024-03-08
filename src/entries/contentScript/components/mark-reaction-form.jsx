import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import styles from '~/styles/input.module.css';
import H3Header from '~/entries/contentScript/components/h3-header';
import Button from '~/entries/contentScript/components/button';
import { prettyDuration } from '~/common/pretty';
import { submitReaction } from '~/common/bridge';
import { useYouTubePlayer } from '~/hooks/useYouTubePlayer';
import { useAppStore, MESSAGE_ERROR, MESSAGE_SUCCESS } from '~/entries/contentScript/state';

function MarkReactionForm({ onSubmitted }) {
    const [loading, setLoading] = useState(false);

    const [originalUrl, setOriginalUrl] = useState('');

    const [segmentFull, setSegmentFull] = useState(null);
    const [segmentStart, setSegmentStart] = useState(null);
    const [segmentEnd, setSegmentEnd] = useState(null);

    const { setAppMessage } = useAppStore();

    const { progress: playerProgress, element: playerElement } = useYouTubePlayer({
        pollInterval: 1000,
    });

    function reset() {
        setSegmentFull(null);
        setSegmentStart(null);
        setSegmentEnd(null);
        setOriginalUrl('');
        onSubmitted();
    }

    function resetSegment() {
        setSegmentStart(null);
        setSegmentEnd(null);
    }

    function partSegment() {
        if (segmentFull === null) {
            setSegmentFull(false);
        }
    }

    function fullSegment() {
        if (segmentFull === null) {
            setSegmentFull(true);
        }
    }

    function startSegment() {
        if (segmentFull || segmentStart) {
            return;
        }

        if (!playerElement) {
            setAppMessage({ type: MESSAGE_ERROR, message: 'Player not found' });
            return;
        }

        setSegmentStart(playerProgress);
    }

    function endSegment() {
        if (segmentFull || !segmentStart) {
            return;
        }

        if (!playerElement) {
            setAppMessage({ type: MESSAGE_ERROR, message: 'Player not found' });
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

            setAppMessage({ type: MESSAGE_SUCCESS, message: 'Reaction has been submitted!' });

            onSubmitted();
        } catch (err) {
            setAppMessage({ type: MESSAGE_ERROR, message: err });
        }

        setLoading(false);
    }

    const canEnterUrl = useMemo(() => {
        if (segmentFull === null) {
            return false;
        }

        if (segmentFull === false && (!segmentStart || !segmentEnd)) {
            return false;
        }

        return true;
    }, [segmentFull, segmentStart, segmentEnd]);

    return (
        <div>
            <p className="text-sm">
                If this video is or contains a reaction to another video, you can mark it as this.
            </p>

            <H3Header step={1}>
                Wich part contains the reaction?
            </H3Header>

            <div className="flex">
                <div className="flex-1">
                    <Button
                        color="primary"
                        className="w-full"
                        disabled={segmentFull !== null}
                        onClick={() => fullSegment()}
                    >
                        Full Video
                    </Button>
                </div>
                <div className="flex w-14 flex-col items-center justify-center">
                    <div className="py-2 text-xs font-medium text-gray-400">
                        OR
                    </div>
                </div>
                <div className="flex flex-1 flex-col gap-4">
                    <Button
                        color="primary"
                        className="w-full"
                        disabled={segmentFull !== null}
                        onClick={() => partSegment()}
                    >
                        Segment of the Video
                    </Button>
                </div>
            </div>

            {segmentFull === false && (
                <>
                    <H3Header step={2}>
                        Mark beginning &  end
                        <button
                            onClick={() => resetSegment()}
                            type="button"
                            className="grow text-right text-sm font-normal text-gray-400"
                        >
                            Try again
                        </button>
                    </H3Header>
                    <div className="mt-4 flex gap-4">
                        <Button
                            color="primary"
                            disabled={!!segmentStart}
                            className="w-full"
                            onClick={() => startSegment()}
                        >
                            {segmentStart ? prettyDuration(segmentStart) : `Start at ${prettyDuration(playerProgress)}`}
                        </Button>
                        <Button
                            color="primary"
                            className="w-full"
                            disabled={!!segmentEnd || !segmentStart}
                            onClick={() => endSegment()}
                        >
                            {segmentEnd && prettyDuration(segmentEnd)}
                            {(!segmentEnd && segmentStart) && `End at ${prettyDuration(playerProgress)}`}
                            {(!segmentEnd && !segmentStart) && 'End Segment'}
                        </Button>
                    </div>
                </>
            )}

            {canEnterUrl && (
                <>
                    <H3Header step={segmentFull === true ? 2 : 3}>
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

                    {originalUrl && (
                        <>
                            <H3Header step={segmentFull === true ? 3 : 4}>
                                Submit
                            </H3Header>

                            <p className="mb-4 px-16 text-center text-sm">
                                Please note that every submission will be manually reviewed before being listed.
                            </p>

                            <Button
                                color="primary"
                                className="w-full"
                                disabled={loading}
                                loading={loading}
                                onClick={() => submit()}
                            >
                                Submit Reaction
                            </Button>
                        </>
                    )}
                </>
            )}

            <button
                onClick={() => reset()}
                type="button"
                className="mt-4 w-full text-center text-sm text-gray-500 hover:text-gray-300 dark:text-gray-400"
            >
                Abort
            </button>
        </div>
    );
}

MarkReactionForm.propTypes = {
    onSubmitted: PropTypes.func.isRequired,
};

MarkReactionForm.defaultProps = {};

export default MarkReactionForm;
