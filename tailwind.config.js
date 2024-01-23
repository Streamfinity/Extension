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
                positive: {
                    500: '#00F397',
                    400: '#01FF94',
                },
                warning: {
                    500: '#EBC257',
                    400: '#FFA800',
                },
                negative: {
                    500: '#EB5757',
                    400: '#FF5C00',
                },
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
