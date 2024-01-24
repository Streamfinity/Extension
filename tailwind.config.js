const { preset, plugin } = require('@streamfinity/streamfinity-branding');
const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,ts,jsx,tsx,html}',
    ],
    presets: [
        preset,
    ],
    theme: {
        extend: {
            colors: {
                gray: colors.neutral,
            },
            fontSize: {
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
    plugins: [
        plugin,
    ],
};
