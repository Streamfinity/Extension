import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { ArrowUpIcon } from '@heroicons/react/16/solid';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '~/entries/contentScript/state';
import { useVideoAnalytics } from '~/common/bridge';
import useAuth from '~/hooks/useAuth';
import Card from '~/entries/contentScript/components/Card';
import { childrenShape } from '~/shapes';
import { prettyNumber } from '~/common/pretty';
import { hasSubscription } from '~/entries/contentScript/hooks/useSubscription';
import { subscriptionIds, subscriptionFeatures } from '~/enums';
import PremiumCtaLabel from '~/entries/contentScript/components/PremiumCtaLabel';

/**
 * Function component for displaying a statistic with a title, value, and optional children.
 * 
 * @param {string} title - The title of the statistic.
 * @param {number} value - The numerical value of the statistic.
 * @param {bool} blur - Whether to apply blur effect to the statistic.
 * @param {PropTypes.node|PropTypes.element|PropTypes.arrayOf(PropTypes.element)} children - Optional children components.
 * @returns {JSX.Element} A div element displaying the statistic with the provided information.
 */
function Statistic({
    title, value, children, blur = false,
}) {
    return (
        <div className="flex flex-col gap-2 text-left">
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                {title}
            </div>
            <div className={classNames(
                'text-3xl font-medium',
                blur && 'blur select-none',
                value === 0 && 'text-gray-600 dark:text-gray-400',
            )}
            >
                {prettyNumber(value)}
            </div>
            {children}
        </div>
    );
}

Statistic.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    blur: PropTypes.bool,
    children: childrenShape,
};

Statistic.defaultProps = {
    children: null,
};

/**
 * Function component for displaying a statistic change with an arrow icon.
 * 
 * @param {Object} props - The props object containing the children to be displayed.
 * @param {node|element|arrayOf(element)} props.children - The content to be displayed within the component.
 * 
 * @returns {JSX.Element} A div element displaying the statistic change with an arrow icon and the provided children.
 */
function StatisticChange({ children }) {
    return (
        <div className="flex items-center gap-2 text-sm text-green-800 dark:text-green-500">
            <div className="flex size-6 items-center justify-center rounded-full bg-green-600/30 text-sm">
                <ArrowUpIcon className="size-4" />
            </div>
            <div>
                {children}
            </div>
        </div>
    );
}

StatisticChange.propTypes = {
    children: childrenShape.isRequired,
};

// -------------------------------------------------------------------------------------------------------
// Mount
// -------------------------------------------------------------------------------------------------------

/**
 * Function that renders an analytics notice component.
 * It fetches video analytics data, checks if the user has a subscription, and displays relevant information.
 * 
 * @returns {JSX.Element} The rendered AnalyticsNotice component.
 */
function AnalyticsNotice() {
    const { t } = useTranslation();
    const currentUrl = useAppStore((state) => state.currentUrl);
    const compact = useAppStore((state) => state.isCompact);
    const { accounts, user } = useAuth();

    const { data: videos } = useVideoAnalytics({
        videoUrl: currentUrl,
        accountIds: accounts.map((account) => account.id),
    });

    const isSubscribed = hasSubscription(user, subscriptionIds.CREATOR);

    const video = useMemo(() => {
        if (!videos) {
            return null;
        }

        return videos[0];
    }, [videos, isSubscribed]);

    const viewChangePercentage = useMemo(() => (video ? Math.round((video.analytics_aggregated.sum_unique_views / video.views_count) * 100) : null), [video]);

    return (
        <Card
            title={t('analytics.title')}
            titleCompact={t('analytics.titleCompact')}
            color="brand-creator"
            compact={compact}
            preview={(isSubscribed && !!video) ? t('analytics.preview', { views: video?.analytics_aggregated.sum_unique_views || 0 }) : null}
        >
            <div className="flex justify-between">
                {isSubscribed && (
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {t('analytics.reactionsTitle', { count: video?.reactions?.length || 0 })}
                    </div>
                )}
            </div>

            {/* eslint-disable-next-line no-nested-ternary */}
            {isSubscribed ? (
                video ? (
                    <div className="flex justify-between px-2">
                        {isSubscribed ? (
                            <>
                                <Statistic
                                    title={t('analytics.uniqueViews')}
                                    value={video?.analytics_aggregated.sum_unique_views || 0}
                                >
                                    {viewChangePercentage > 0 && (
                                        <StatisticChange>
                                            +
                                            {viewChangePercentage}
                                            %
                                        </StatisticChange>
                                    )}
                                </Statistic>
                                <Statistic
                                    title={t('analytics.liveAvg')}
                                    value={video?.analytics_aggregated?.live_avg_views || 0}
                                />
                                <Statistic
                                    title={t('analytics.livePeak')}
                                    value={video?.analytics_aggregated?.live_peak_views || 0}
                                />
                                <Statistic
                                    title={t('analytics.clicks')}
                                    value={video?.clicks?.value || 0}
                                />
                            </>
                        ) : (
                            <>
                                <Statistic
                                    title={t('analytics.uniqueViews')}
                                    value={86455}
                                    blur
                                />
                                <Statistic
                                    title={t('analytics.liveAvg')}
                                    value={624}
                                    blur
                                />
                                <Statistic
                                    title={t('analytics.livePeak')}
                                    value={466}
                                    blur
                                />
                                <Statistic
                                    title={t('analytics.clicks')}
                                    value={6428}
                                    blur
                                />
                            </>
                        )}
                    </div>
                ) : (
                    <div className="text-sm">
                        {t('analytics.noReactionsYet')}
                    </div>
                )
            ) : (

                <PremiumCtaLabel
                    plan={subscriptionIds.CREATOR}
                    campaign="analytics"
                    feature={subscriptionFeatures.ANALYTICS_VIDEOS}
                >
                    {t('analytics.ctaCreator')}
                </PremiumCtaLabel>
            )}
        </Card>
    );
}

AnalyticsNotice.propTypes = {};

AnalyticsNotice.defaultProps = {};

export default AnalyticsNotice;
