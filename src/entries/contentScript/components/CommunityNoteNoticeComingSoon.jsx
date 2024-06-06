import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import Card from '~/entries/contentScript/components/Card';
import { useAppStore } from '~/entries/contentScript/state';
import { buildFrontendUrl } from '~/common/utility';

function CommunityNoteNoticeComingSoon() {
    const { t } = useTranslation();
    const compact = useAppStore((state) => state.isCompact);

    return (
        <Card
            id="cncs"
            title={t('communityNotes.title')}
            color="dashed"
            compact={compact}
            preview={t('communityNotes.none')}
            className="text-sm"
        >
            <Trans
                i18nKey="communityNotes.comingSoon"
                components={[
                    <a
                        href={buildFrontendUrl('/dashboard/notes')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-primary-700 transition-colors hover:text-primary-900 dark:text-primary-500 dark:hover:text-primary-600"
                    >
                        chunk
                    </a>,
                ]}
            />
        </Card>
    );
}

CommunityNoteNoticeComingSoon.propTypes = {};

export default CommunityNoteNoticeComingSoon;
