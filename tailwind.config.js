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
                brand: {
                    viewer: {
                        gradient: {
                            'from-tlc': 'rgb(117,255,147,.2)', // colors.green[400],
                            'to-tlc': 'rgb(223,255,133,.2)', // colors.lime[300],
                        },
                    },
                },
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
    plugins: [
        plugin,
    ],
};
