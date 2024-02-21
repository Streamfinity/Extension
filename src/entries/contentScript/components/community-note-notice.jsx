import React from 'react';
import { buildFrontendUrl } from '~/common/utility';
import { usePage } from '~/hooks/usePage';

function CommunityNoteNotice() {
    const { currentUrl } = usePage();

    return (
        <div>
            <b>Community Note</b>
            <div>
                <a
                    href={buildFrontendUrl(`/dashboard/notes?create_for_video_url=${currentUrl}`)}
                    target="_blank"
                    rel="noreferrer"
                    className="grow"
                >
                    Create Community Note
                </a>
            </div>
        </div>
    );
}

CommunityNoteNotice.propTypes = {};

CommunityNoteNotice.defaultProps = {};

export default CommunityNoteNotice;
