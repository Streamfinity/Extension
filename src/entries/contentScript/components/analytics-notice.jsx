import React, { Fragment, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ArrowUpIcon } from '@heroicons/react/16/solid';
import classNames from 'classnames';
import { useAppStore } from '~/entries/contentScript/state';
import { useVideoAnalytics } from '~/common/bridge';
import useAuth from '~/hooks/useAuth';
import Card, { CardTitle } from '~/entries/contentScript/components/card';
import { childrenShape } from '~/shapes';
import { prettyNumber } from '~/common/pretty';

// -------------------------------------------------------------------------------------------------------
// Components
// -------------------------------------------------------------------------------------------------------

function Statistic({ title, value, children }) {
    return (
        <div className="flex flex-col gap-2 text-left">
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                {title}
            </div>
            <div className={classNames('text-3xl font-medium', value === 0 && 'text-gray-600 dark:text-gray-400')}>
                {prettyNumber(value)}
            </div>
            {children}
        </div>
    );
}

Statistic.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    children: childrenShape,
};

Statistic.defaultProps = {
    children: null,
};

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

function AnalyticsNotice() {
    const { currentUrl } = useAppStore();
    const { accounts } = useAuth();

    const { data: videos } = useVideoAnalytics({
        videoUrl: currentUrl,
        accountIds: accounts.map((account) => account.id),
    });

    const video = useMemo(() => (videos ? videos[0] : null), [videos]);

    const viewChangePercentage = useMemo(() => (video ? Math.round((video.analytics_aggregated.sum_unique_views / video.views_count) * 100) : null), [video]);

    if (!video) {
        return null;
    }

    console.log(video);
    return (
        <Card color="brand-creator">
            <CardTitle>Analytics</CardTitle>

            <div className="flex justify-between">
                <Statistic
                    title="Unique views"
                    value={video.analytics_aggregated.sum_unique_views}
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
                    title="Live Avg"
                    value={video.analytics_aggregated.live_avg_views}
                />
                <Statistic
                    title="Live Peak"
                    value={video.analytics_aggregated.live_peak_views}
                />
                <Statistic
                    title="Clicks"
                    value={video.clicks?.value || 0}
                />
            </div>
        </Card>
    );
}

AnalyticsNotice.propTypes = {};

AnalyticsNotice.defaultProps = {};

export default AnalyticsNotice;
