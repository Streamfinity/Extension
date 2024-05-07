import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Card from '~/entries/contentScript/components/Card';
import { useAppStore } from '~/entries/contentScript/state';
import { useCommunityNotes } from '~/common/bridge';
import { usePage } from '~/hooks/usePage';
import { buildFrontendUrl } from '~/common/utility';
import { strLimit } from '~/common/pretty';

function CommunityNoteNotice() {
    const { t } = useTranslation();
    const compact = useAppStore((state) => state.isCompact);

    const { currentUrl } = usePage();
    const [isExpanded, setIsExpanded] = useState(false);

    const { data: notes } = useCommunityNotes({ videoUrl: currentUrl });

    if (!notes?.length) {
        return null;
    }

    const note = notes[0];
    const expandable = note.content.length > 100;

    return (
        <Card
            title={t('communityNotes.title')}
            color="dashed"
            compact={compact}
            preview={strLimit(note.content, 20)}
        >
            <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className={classNames(
                    (expandable && !isExpanded) ? 'max-h-[5rem] overflow-hidden cursor-pointer' : 'cursor-default',
                    'relative text-sm text-left select-text',
                )}
            >
                <p>
                    {note.content}
                    {note.sources?.map((source, index) => (
                        <a
                            key={source}
                            href={source}
                            title={source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-1 font-semibold text-primary-700 transition-colors hover:text-primary-900"
                        >
                            [
                            {index}
                            ]
                        </a>
                    ))}
                </p>
                <div className="mt-2">
                    <a
                        href={buildFrontendUrl(`/dashboard/notes/review?note_id=${note.id}`)}
                        target="_blank"
                        className="font-semibold text-primary-700 transition-colors hover:text-primary-900"
                        rel="noreferrer"
                    >
                        {t('communityNotes.rate')}
                    </a>
                </div>
                {(expandable && !isExpanded) && (
                    <div className="absolute bottom-0 left-0 flex h-20 w-full items-end justify-center bg-gradient-to-t from-white from-25% to-white/0">
                        <div className="text-center font-semibold text-shadow text-shadow-gray-50">
                            {t('communityNotes.readMore')}
                        </div>
                    </div>
                )}
            </button>
        </Card>
    );
}

CommunityNoteNotice.propTypes = {};

export default CommunityNoteNotice;
