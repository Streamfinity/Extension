import React from 'react';
import { describe, expect, it } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import browser from 'webextension-polyfill';
import App from '~/entries/popup/App';
import { SETTING_UPDATE_VISIBLE } from '~/messages';
import { useAppStore } from '~/entries/contentScript/state';
import {
    mockBackground, renderWithQuery, sentMessageTypes, testUser,
} from './helpers';

describe('popup', () => {
    it('shows login when logged out', async () => {
        mockBackground();

        renderWithQuery(<App />);

        expect(await screen.findByText('Login with Streamfinity')).toBeTruthy();
        expect(screen.getByText(/cyber\.streamfinity\.tv/)).toBeTruthy();
    });

    it('shows settings when logged in', async () => {
        mockBackground({ user: testUser });

        renderWithQuery(<App />);

        expect(await screen.findByText('Settings')).toBeTruthy();
        expect(screen.getByText('Logout')).toBeTruthy();
    });

    it('toggles extension visibility', async () => {
        mockBackground({ user: testUser });

        renderWithQuery(<App />);

        const toggle = await screen.findByRole('switch', { name: 'Show Extension on Web Pages' });

        await waitFor(() => expect(toggle.getAttribute('aria-checked')).toBe('true'));

        fireEvent.click(toggle);

        await waitFor(() => expect(useAppStore.getState().isVisible).toBe(false));
        expect(sentMessageTypes()).toContain(SETTING_UPDATE_VISIBLE);
        expect(browser.runtime.sendMessage).toHaveBeenCalledWith({
            type: SETTING_UPDATE_VISIBLE,
            data: { visible: false },
        });
    });
});
