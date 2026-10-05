import React from 'react';
import browser from 'webextension-polyfill';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GET_STATUS } from '~/messages';

export const testUser = {
    id: 1,
    display_name: 'Tester',
    locale_frontend: 'en',
    extension_invisible_until: null,
};

export function mockBackground({ user = null, storage = {} } = {}) {
    browser.runtime.sendMessage.mockImplementation(async ({ type }) => {
        if (type === GET_STATUS) {
            return { data: user ? { user, accounts: [], live_streams: [] } : null };
        }

        return { data: [] };
    });

    browser.storage.sync.get.mockImplementation(async (key) => (key ? { [key]: storage[key] } : storage));
    browser.storage.sync.set.mockResolvedValue(undefined);
}

export function sentMessageTypes() {
    return browser.runtime.sendMessage.mock.calls.map(([{ type }]) => type);
}

export function renderWithQuery(element) {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

    return render(
        <QueryClientProvider client={queryClient}>
            {element}
        </QueryClientProvider>,
    );
}
