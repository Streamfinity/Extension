/* eslint-disable no-restricted-syntax */

import { useMemo } from 'react';

export function hasSubscription(user, subscriptionId) {
    return useMemo(
        () => user
            ?.accounts
            ?.some((account) => account.subscriptions?.filter((sub) => sub.is_active && sub.plan.id === subscriptionId)?.length > 0),
        [user, subscriptionId],
    );
}

export function hasSubscriptionFeature(feature, account, user) {
    return useMemo(() => {
        const accountSubscriptions = account?.subscriptions || [];
        const userSubscriptionsUnique = [];
        const userSubscriptions = [];

        user?.accounts?.forEach((userAccount) => {
            if (!userAccount.from_pivot?.is_initial) {
                return;
            }

            userSubscriptions.push(...userAccount.subscriptions);
            userSubscriptionsUnique.push(...userAccount.subscriptions.filter((subscription) => subscription.plan.is_unique_for_user));
        });

        // Find active subscription in owned account for a feature that propagates to the user

        for (const subscription of userSubscriptions) {
            const perk = subscription.plan.perks.find((subscriptionPerk) => subscriptionPerk.feature === feature);

            if (perk && perk.feature_propagate_to_user) {
                return true;
            }
        }

        // Find a perk that is included in an account-bound subscription or unique-for-user subscription
        const subscriptions = [...accountSubscriptions, ...userSubscriptionsUnique];

        for (const subscription of subscriptions) {
            const perk = subscription.plan.perks.find((subscriptionPerk) => subscriptionPerk.feature === feature);

            if (perk) {
                return true;
            }
        }

        return false;
    }, [feature, account, user]);
}
