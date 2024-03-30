import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { buildFrontendUrl } from '~/common/utility';
import { childrenShape } from '~/shapes';

function PremiumCtaLabel({
    children, campaign, feature = '', className = '',
}) {
    return (
        <a
            href={buildFrontendUrl(`/dashboard/upgrade?utm_source=extension&utm_campaign=${campaign}&feature_id=${feature}`)}
            target="_blank"
            rel="noreferrer"
            className={classNames(className, 'mt-4 block')}
        >
            <div className="rounded-full border border-black/20 bg-black/20 px-2 py-1 text-center text-sm font-medium text-black dark:border-white/20 dark:bg-white/20 dark:text-white">
                {children}
            </div>
        </a>
    );
}

PremiumCtaLabel.propTypes = {
    children: childrenShape.isRequired,
    campaign: PropTypes.string.isRequired,
    feature: PropTypes.number,
    className: PropTypes.string,
};

export default PremiumCtaLabel;
