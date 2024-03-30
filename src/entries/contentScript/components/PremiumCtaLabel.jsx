import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import gradientStyles from '@streamfinity/streamfinity-branding/dist/Gradients.module.css';
import { buildFrontendUrl } from '~/common/utility';
import { childrenShape } from '~/shapes';

function PremiumCtaLabel({ children, campaign, feature = '' }) {
    return (
        <a
            href={buildFrontendUrl(`/dashboard/upgrade?utm_source=extension&utm_campaign=${campaign}&feature_id=${feature}`)}
            target="_blank"
            rel="noreferrer"
            className="mt-4 block"
        >
            <div className={classNames(
                'px-2 rounded-full text-sm text-black py-1 text-center font-medium border border-black/20',
                'bg-black/20',
            )}
            >
                {children}
            </div>
        </a>
    );
}

PremiumCtaLabel.propTypes = {
    children: childrenShape.isRequired,
    campaign: PropTypes.string.isRequired,
    feature: PropTypes.number,
};

export default PremiumCtaLabel;
