import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { buildFrontendUrl } from '~/common/utility';
import { childrenShape } from '~/shapes';
import { accountTypes } from '~/enums';

function PremiumCtaLabel({
    children,
    campaign,
    type,
    feature = '',
    className = '',
}) {
    return (
        <a
            href={buildFrontendUrl(`/dashboard/upgrade?utm_source=extension&utm_campaign=${campaign}&feature_id=${feature}`)}
            target="_blank"
            rel="noreferrer"
            className={classNames(className, 'block')}
        >
            <div className={classNames(
                type === accountTypes.CREATOR && 'bg-gradient-to-r from-brand-creator-gradient-from to-brand-creator-gradient-to',
                type === accountTypes.VIEWER && 'bg-gradient-to-r from-brand-viewer-gradient-from to-brand-viewer-gradient-to',
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
    type: PropTypes.number,
    campaign: PropTypes.string.isRequired,
    feature: PropTypes.number,
    className: PropTypes.string,
};

export default PremiumCtaLabel;
