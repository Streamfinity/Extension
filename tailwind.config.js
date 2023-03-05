/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,ts,jsx,tsx,html}',
    ],
    theme: {
        extend: {
            fontSize: {
                base: '14px',
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
