import React from 'react';
import PropTypes from 'prop-types';
import { SignalIcon } from '@heroicons/react/16/solid';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { buildFrontendUrl } from '~/common/utility';
import { useAppStore } from '~/entries/contentScript/state';

function StatusNotice({
    liveStream,
}) {
    const { t } = useTranslation();
    const compact = useAppStore((state) => state.isCompact);

    if (!liveStream) {
        return null;
    }

    return (
        <a
            href={buildFrontendUrl('/dashboard/streams')}
            target="_blank"
            rel="noreferrer"
        >
            <div className={classNames(
                'flex items-center gap-3 bg-brand-streamer-gradient-from px-4 py-1 text-white rounded-[8px]',
                compact ? '' : '',
            )}
            >
                <SignalIcon className="size-8" />
                <div>
                    {liveStream?.service?.title ? (
                        <span className="font-bold uppercase">
                            {t('status.youAreLiveOn', {
                                service: liveStream?.service?.title,
                                accountName: liveStream?.account?.display_name,
                            })}
                        </span>
                    ) : (
                        <span className="font-bold uppercase">
                            {t('status.youAreLive')}
                        </span>
                    )}
                </div>
            </div>
        </a>
    );
}

StatusNotice.propTypes = {
    liveStream: PropTypes.shape({
        title: PropTypes.string,
        account: PropTypes.shape({
            display_name: PropTypes.string,
        }),
        service: PropTypes.shape({
            title: PropTypes.string,
        }),
    }),
};

StatusNotice.defaultProps = {
    liveStream: null,
};

export default StatusNotice;
