import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { buildFrontendUrl } from '~/common/utility';
import { childrenShape } from '~/shapes';
import { subscriptionIds } from '~/enums';

function PremiumCtaLabel({
    children,
    campaign,
    plan,
    feature = '',
    className = '',
}) {
    return (
        <a
            href={buildFrontendUrl(`/dashboard/upgrade?utm_source=extension&utm_campaign=${campaign}&plan_id=${plan}&feature_id=${feature}`)}
            target="_blank"
            rel="noreferrer"
            className={classNames(className, 'block')}
        >
            <div className={classNames(
                plan === subscriptionIds.CREATOR && 'bg-gradient-to-r from-brand-creator-gradient-from to-brand-creator-gradient-to',
                plan === subscriptionIds.VIEWER && 'bg-gradient-to-r from-brand-viewer-gradient-from to-brand-viewer-gradient-to',
                'rounded-full border border-black/20 bg-black/20 px-2 py-1 text-center text-sm font-medium text-white',
            )}
            >
                {children}
            </div>
        </a>
    );
}

PremiumCtaLabel.propTypes = {
    children: childrenShape.isRequired,
    plan: PropTypes.string,
    campaign: PropTypes.string.isRequired,
    feature: PropTypes.number,
    className: PropTypes.string,
};

export default PremiumCtaLabel;
