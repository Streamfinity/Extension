import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@streamfinity/streamfinity-branding';
import { useTranslation } from 'react-i18next';
import styles from '~/styles/input.module.css';
import H3Header from '~/entries/contentScript/components/H3Header';
import { prettyDuration } from '~/common/pretty';
import { submitReaction } from '~/common/bridge';
import { useYouTubePlayer } from '~/hooks/useYouTubePlayer';
import { toastError, toastSuccess } from '~/common/utility';

function MarkReactionForm({ onSubmitted }) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);

    const [originalUrl, setOriginalUrl] = useState('');

    const [segmentFull, setSegmentFull] = useState(null);
    const [segmentStart, setSegmentStart] = useState(null);
    const [segmentEnd, setSegmentEnd] = useState(null);

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
            toastError(t('messages.playerNotFound'));
            return;
        }

        setSegmentStart(playerProgress);
    }

    function endSegment() {
        if (segmentFull || !segmentStart) {
            return;
        }

        if (!playerElement) {
            toastError(t('messages.playerNotFound'));
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

            toastSuccess(t('messages.reactionSubmitted'));

            onSubmitted();
        } catch (err) {
            toastError(err);
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
                {t('markReaction.description')}
            </p>

            <H3Header step={1}>
                {t('markReaction.stepWhichPart')}
            </H3Header>

            <div className="flex">
                <div className="flex-1">
                    <Button
                        color="primary-gradient"
                        className="w-full"
                        disabled={segmentFull !== null}
                        onClick={() => fullSegment()}
                    >
                        {t('markReaction.fullVideo')}
                    </Button>
                </div>
                <div className="flex w-14 flex-col items-center justify-center">
                    <div className="py-2 text-xs font-medium text-gray-400">
                        {t('markReaction.or')}
                    </div>
                </div>
                <div className="flex flex-1 flex-col gap-4">
                    <Button
                        color="primary-gradient"
                        className="w-full"
                        disabled={segmentFull !== null}
                        onClick={() => partSegment()}
                    >
                        {t('markReaction.segmentVideo')}
                    </Button>
                </div>
            </div>

            {segmentFull === false && (
                <>
                    <H3Header step={2}>
                        {t('markReaction.stepMark')}
                        <button
                            onClick={() => resetSegment()}
                            type="button"
                            className="grow text-right text-sm font-normal text-gray-400"
                        >
                            {t('actions.tryAgain')}
                        </button>
                    </H3Header>
                    <div className="mt-4 flex gap-4">
                        <Button
                            color="primary-gradient"
                            disabled={!!segmentStart}
                            className="w-full"
                            onClick={() => startSegment()}
                        >
                            {segmentStart ? prettyDuration(segmentStart) : `Start at ${prettyDuration(playerProgress)}`}
                        </Button>
                        <Button
                            color="primary-gradient"
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
                        {t('markReaction.stepToWhat')}
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
                                {t('actions.submit')}
                            </H3Header>

                            <p className="mb-4 px-16 text-center text-sm">
                                {t('markReaction.disclaimer')}
                            </p>

                            <Button
                                color="primary-gradient"
                                className="w-full"
                                disabled={loading}
                                loading={loading}
                                onClick={() => submit()}
                            >
                                {t('actions.submitReaction')}
                            </Button>
                        </>
                    )}
                </>
            )}

            <button
                onClick={() => reset()}
                type="button"
                className="mt-4 w-full text-center text-sm text-gray-500 transition-colors hover:text-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            >
                {t('actions.abort')}
            </button>
        </div>
    );
}

MarkReactionForm.propTypes = {
    onSubmitted: PropTypes.func.isRequired,
};

MarkReactionForm.defaultProps = {};

export default MarkReactionForm;
