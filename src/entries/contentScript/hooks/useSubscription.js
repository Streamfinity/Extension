/* eslint-disable no-restricted-syntax */

import { useMemo } from 'react';

/**
 * Check if a user has a specific subscription based on the subscription ID.
 * 
 * @param {Object} user - The user object containing accounts and subscriptions.
 * @param {string} subscriptionId - The ID of the subscription to check for.
 * @returns {boolean} - Returns true if the user has the subscription, false otherwise.
 */
export function hasSubscription(user, subscriptionId) {
    return useMemo(
        () => user
            ?.accounts
            ?.some((account) => account.subscriptions?.filter((sub) => sub.is_active && sub.plan.id === subscriptionId)?.length > 0),
        [user, subscriptionId],
    );
}

/**
 * Check if a user has a specific feature available based on their subscriptions.
 * 
 * @param {string} feature - The feature to check availability for.
 * @param {Object} account - The user's account object containing subscriptions.
 * @param {Object} user - The user object containing multiple accounts and subscriptions.
 * @returns {boolean} - Returns true if the feature is available to the user, false otherwise.
 */
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
