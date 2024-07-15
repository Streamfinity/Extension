import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { ChevronUpIcon, ChevronDownIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/16/solid';
import { buildFrontendUrl } from '~/common/utility';
import useAuth, { STATE_LIVE, STATE_DEFAULT, STATE_OWN_VIDEO } from '~/hooks/useAuth';
import { useAppStore } from '~/entries/contentScript/state';

function Footer({
    state,
    liveStream = null,
}) {
    const { t } = useTranslation();
    const { user, setOverrideState } = useAuth();

    const [isCompact, setIsCompact] = useAppStore(
        useShallow((storeState) => ([storeState.isCompact, storeState.setIsCompact])),
    );

    if (!user) {
        return null;
    }

    return (
        <div className="flex justify-between gap-4 truncate text-xs font-medium text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={() => setIsCompact(!isCompact)}
                    className="group flex items-center gap-1.5 leading-none dark:hover:text-gray-300"
                >
                    {isCompact ? (
                        <>
                            <div className="size-4 rounded-full border border-gray-500 p-px">
                                <div className="size-full rounded-full bg-gray-500" />
                            </div>
                            {t('actions.compact') }
                        </>
                    ) : (
                        <>
                            <div className="size-4 rounded-full border border-gray-500 p-px">
                                <div className="invisible size-full rounded-full bg-gray-500 group-hover:visible" />
                            </div>
                            {t('actions.compact')}
                        </>
                    )}
                </button>

                <div className="flex items-center gap-1.5 leading-none">
                    <div className="size-4 rounded-full border border-gray-500 p-px">
                        <div className="size-full rounded-full bg-gray-500" />
                    </div>
                    Minimize
                </div>
            </div>

            {(liveStream && state !== STATE_LIVE) && (
                <button
                    onClick={() => setOverrideState(STATE_LIVE)}
                    type="button"
                    className="dark:hover:text-gray-300"
                >
                    {t('status.enableStreamerMode')}
                </button>
            )}

            <a
                href={buildFrontendUrl('/dashboard')}
                target="_blank"
                rel="noreferrer"
                title={user.display_name}
                className="flex items-center gap-1 dark:hover:text-gray-300"
            >
                <ArrowTopRightOnSquareIcon className="inline size-6" />
                {t('actions.yourDashboard')}
            </a>
        </div>
    );
}

Footer.propTypes = {
    state: PropTypes.oneOf([
        STATE_DEFAULT,
        STATE_LIVE,
        STATE_OWN_VIDEO,
    ]),
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

export default Footer;
