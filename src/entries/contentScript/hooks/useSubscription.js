import { useMemo } from 'react';

export function hasSubscription(user, subscriptionId) {
    return useMemo(
        () => user
            ?.accounts
            ?.some((account) => account.subscriptions?.filter((sub) => sub.is_active && sub.plan.id === subscriptionId)?.length > 0),
        [user],
    );
}

export function hasSubscriptionFeature(feature, account, user) {
    return useMemo(() => {
        const accountSubscriptions = account?.subscriptions || [];
        const userSubscriptions = [];

        user?.accounts?.forEach((userAccount) => {
            if (!userAccount.from_pivot?.is_initial) {
                return;
            }

            userSubscriptions.push(...userAccount.subscriptions.filter((subscription) => subscription.plan.is_unique_for_user));
        });

        const subscriptions = [...accountSubscriptions, ...userSubscriptions];

        // eslint-disable-next-line no-restricted-syntax
        for (const subscription of subscriptions) {
            const perk = subscription.plan.perks.find((subscriptionPerk) => subscriptionPerk.feature === feature);

            if (perk) {
                return true;
            }
        }

        return false;
    }, [account, user, feature]);
}
