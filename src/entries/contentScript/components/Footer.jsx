import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useTranslation } from 'react-i18next';
import { buildFrontendUrl } from '~/common/utility';
import useAuth from '~/hooks/useAuth';
import { useAppStore } from '~/entries/contentScript/state';

function Footer() {
    const { t } = useTranslation();
    const { user } = useAuth();

    const [isCompact, setIsCompact] = useAppStore(
        useShallow((storeState) => ([storeState.isCompact, storeState.setIsCompact])),
    );

    if (!user) {
        return null;
    }

    return (
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-300">
            <div>
                {user.display_name}
            </div>
            <div className="flex gap-4">
                <button
                    type="button"
                    className="font-medium"
                    onClick={() => setIsCompact(!isCompact)}
                >
                    {isCompact ? t('actions.compactDisable') : t('actions.compactEnable')}
                </button>
                <a
                    href={buildFrontendUrl('/dashboard')}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium"
                >
                    {t('actions.yourDashboard')}
                </a>
            </div>
        </div>

    );
}

Footer.propTypes = {};

export default Footer;
