import { preset } from '@streamfinity/streamfinity-branding';
import colors from 'tailwindcss/colors';
import containerQueries from '@tailwindcss/container-queries';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './src/**/*.{js,ts,jsx,tsx,html}',
        './node_modules/@streamfinity/streamfinity-branding/**/*.{js,jsx}',
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
            keyframes: {
                attention: {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.03)' },
                },
            },
            animation: {
                attention: 'attention 0.5s ease-in-out 3',
            },
        },
    },
    plugins: [
        containerQueries,
    ],
};
