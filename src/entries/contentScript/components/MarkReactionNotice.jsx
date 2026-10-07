import React, { useState, Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@streamfinity/streamfinity-branding';
import { useTranslation } from 'react-i18next';
import Card from '~/entries/contentScript/components/Card';
import MarkReactionForm from '~/entries/contentScript/components/MarkReactionForm';
import { useAppStore } from '~/entries/contentScript/state';
import { useReactionCandidate } from '~/hooks/useReactionCandidate';
import { submitReaction } from '~/common/bridge';
import { toastError, toastSuccess } from '~/common/utility';

function MarkReactionNotice({ autoDetect }) {
    const { t } = useTranslation();
    const [showForm, setShowForm] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const [loading, setLoading] = useState(false);

    const currentUrl = useAppStore((state) => state.currentUrl);
    const compact = useAppStore((state) => state.isCompact);

    const candidate = useReactionCandidate({ enabled: autoDetect });
    const showCandidate = !!candidate && !dismissed && !showForm;

    useEffect(() => {
        setShowForm(false);
        setDismissed(false);
    }, [currentUrl]);

    async function confirmCandidate() {
        if (loading) {
            return;
        }

        setLoading(true);

        try {
            await submitReaction({
                original_video_url: candidate.original_video.external_url,
                from_video_url: window.location.href,
            });

            toastSuccess(t('messages.reactionSubmitted'));

            setDismissed(true);
        } catch (err) {
            toastError(err);
        }

        setLoading(false);
    }

    return (
        <Card
            id="mr"
            title={t('markReaction.title')}
            className="flex flex-col"
            compact={compact}
            forceOpen={showCandidate}
            highlight={showCandidate}
            color={showCandidate ? 'primary' : 'default'}
        >

            {showCandidate && (
                <div className="flex flex-col gap-3">
                    <p className="text-sm">
                        {t('markReaction.candidate')}
                    </p>

                    <div className="text-sm">
                        <div className="font-semibold">
                            {candidate.original_video.title}
                        </div>
                        {candidate.original_video.channel?.title && (
                            <div className="opacity-75">
                                {candidate.original_video.channel.title}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button
                            color="primary"
                            onClick={() => confirmCandidate()}
                            loading={loading}
                            usePx={false}
                        >
                            {t('markReaction.candidateConfirm')}
                        </Button>
                        <Button
                            onClick={() => setShowForm(true)}
                            usePx={false}
                        >
                            {t('markReaction.candidatePart')}
                        </Button>
                        <Button
                            onClick={() => setDismissed(true)}
                            usePx={false}
                        >
                            {t('markReaction.candidateDismiss')}
                        </Button>
                    </div>
                </div>
            )}

            {!showCandidate && !showForm && (
                <div>
                    <Button
                        color="primary"
                        className="float-right ml-4"
                        onClick={() => setShowForm(true)}
                        usePx={false}
                    >
                        {t('actions.markAsReaction')}
                    </Button>

                    <p className="text-sm">
                        {t('markReaction.intro')}
                    </p>
                </div>
            )}

            {showForm && (
                <Fragment key={currentUrl}>
                    <MarkReactionForm
                        initialOriginalUrl={candidate?.original_video.external_url}
                        onSubmitted={() => setShowForm(false)}
                    />
                </Fragment>
            )}
        </Card>
    );
}

MarkReactionNotice.propTypes = {
    autoDetect: PropTypes.bool,
};

MarkReactionNotice.defaultProps = {
    autoDetect: false,
};

export default MarkReactionNotice;
