import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { reactionPolicyEnum } from '~/enums';

function ReactionPolicyNotice({ policy }) {
    const isAllowed = useMemo(() => {
        if (policy.policy === reactionPolicyEnum.ALLOW) {
            return true;
        }

        if (policy.policy === reactionPolicyEnum.CONDITIONS) {}

        return false;
    }, [policy]);

    return (
        <div className={classNames(
            policy.policy === reactionPolicyEnum.ALLOW && 'border-green-700',
            policy.policy === reactionPolicyEnum.DENY && 'border-red-700',
            policy.policy === reactionPolicyEnum.CONDITIONS && 'border-yellow-700 bg-yellow-700/30',
            'mt-4 py-1 rounded-xl border text-center text-sm text-white/60 leading-normal',
        )}
        >
            <div className="mb-2 text-base font-semibold">
                Reaction Policy
            </div>

            <p className="text-sm">
                This content creator has set a reaction policy
            </p>
        </div>
    );
}

ReactionPolicyNotice.propTypes = {
    policy: PropTypes.shape({
        policy: PropTypes.nu,
    }).isRequired(),
};

ReactionPolicyNotice.defaultProps = {};

export default ReactionPolicyNotice;
