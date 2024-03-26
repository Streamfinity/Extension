import { preset } from '@streamfinity/streamfinity-branding';
import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './src/**/*.{js,ts,jsx,tsx,html}',
    ],
    darkMode: 'class',
    presets: [
        preset,
    ],
    theme: {
        extend: {
            colors: {
                gray: colors.neutral,
            },
            fontSize: {
                lg: '16px',
                base: '14px',
                sm: '12px',
                xs: '10px',
            },
            backgroundColor: {
                yt: {
                    'button-light': 'var(--yt-spec-badge-chip-background)',
                },
            },
        },
    },
    plugins: [],
};
