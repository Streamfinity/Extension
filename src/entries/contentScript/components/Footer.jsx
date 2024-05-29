import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { buildFrontendUrl } from '~/common/utility';
import useAuth, { STATE_LIVE, STATE_DEFAULT, STATE_OWN_VIDEO } from '~/hooks/useAuth';
import { useAppStore } from '~/entries/contentScript/state';

/**
 * Renders a footer component with buttons and links based on user and state information.
 * 
 * @param {Object} props - The props object containing state and liveStream information.
 * @param {string} props.state - The state of the footer, can be one of STATE_DEFAULT, STATE_LIVE, STATE_OWN_VIDEO.
 * @param {Object} [props.liveStream] - The live stream object with title, account, and service information.
 * @param {string} props.liveStream.title - The title of the live stream.
 * @param {Object} props.liveStream.account - The account object with display_name.
 * @param {string} props.liveStream.account.display_name - The display name of the account.
 * @param {Object} props.liveStream.service - The service object with title.
 * @param {string} props.liveStream.service.title - The title of the service.
 * 
 * @returns {JSX.Element} A JSX element representing the footer component with buttons and links.
 */
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
        <div className="flex justify-between gap-4 text-sm font-medium text-gray-500 dark:text-gray-400">
            <button
                type="button"
                onClick={() => setIsCompact(!isCompact)}
                className="dark:hover:text-gray-300"
            >
                {isCompact ? t('actions.compactDisable') : t('actions.compactEnable')}
            </button>

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
                className="dark:hover:text-gray-300"
            >
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
