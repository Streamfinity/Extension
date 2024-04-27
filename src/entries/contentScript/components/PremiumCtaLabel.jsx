import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import gradientStyles from '@streamfinity/streamfinity-branding/dist/Gradients.module.css';
import { buildFrontendUrl } from '~/common/utility';
import { childrenShape } from '~/shapes';
import PlusSparklesIcon from '~/components/Icons/PlusSparklesIcon';

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
            className={classNames(className, 'block relative overflow-hidden rounded-[12px] border-2 border-purple-300/60 text-sm font-semibold group/sublabel')}
        >
            <div className={classNames(gradientStyles.premiumGradient, 'absolute left-0 top-0 w-full h-full opacity-20 transition-opacity group-hover/sublabel:opacity-40')} />
            <div className="flex items-center gap-4 px-5 py-2">
                <PlusSparklesIcon className="size-6 shrink-0" />
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
