import React from 'react';
import PropTypes from 'prop-types';
import { SignalIcon } from '@heroicons/react/16/solid';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { buildFrontendUrl } from '~/common/utility';
import { useAppStore } from '~/entries/contentScript/state';

/**
 * Functional component for displaying a status notice based on the liveStream prop.
 * 
 * @param {Object} liveStream - The live stream object containing title, account, and service information.
 * @param {string} liveStream.title - The title of the live stream.
 * @param {Object} liveStream.account - The account object with display_name.
 * @param {string} liveStream.account.display_name - The display name of the account.
 * @param {Object} liveStream.service - The service object with title.
 * @param {string} liveStream.service.title - The title of the service.
 * 
 * @returns {JSX.Element} JSX element representing the status notice component.
 */
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
