import React from 'react';
import { describe, expect, it } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import browser from 'webextension-polyfill';
import App from '~/entries/contentScript/App';
import { GET_STATUS, REACTIONS_GET_FOR_VIDEO } from '~/messages';
import { useAppStore } from '~/entries/contentScript/state';
import { STORAGE_COMPACT } from '~/entries/background/common/storage';
import {
    mockBackground, renderWithQuery, sentMessageTypes, testUser,
} from './helpers';

describe('content script', () => {
    it('shows login when logged out', async () => {
        mockBackground();

        renderWithQuery(<App />);

        expect(await screen.findByText('Get started by logging in with your Twitch or YouTube account!')).toBeTruthy();
        expect(await screen.findByText('Login with Streamfinity')).toBeTruthy();
    });

    it('loads video data when logged in', async () => {
        mockBackground({ user: testUser });

        renderWithQuery(<App />);

        expect(await screen.findByText('Your Dashboard')).toBeTruthy();
        expect(useAppStore.getState().currentUrl).toBe('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

        await waitFor(() => expect(sentMessageTypes()).toContain(REACTIONS_GET_FOR_VIDEO));
        expect(sentMessageTypes()).toContain(GET_STATUS);
    });

    it('toggles compact mode', async () => {
        mockBackground({ user: testUser, storage: { [STORAGE_COMPACT]: false } });

        renderWithQuery(<App />);

        fireEvent.click(await screen.findByText('Compact Mode'));

        await waitFor(() => expect(useAppStore.getState().isCompact).toBe(true));
        await waitFor(() => expect(browser.storage.sync.set).toHaveBeenCalledWith({ [STORAGE_COMPACT]: true }));
    });
});
