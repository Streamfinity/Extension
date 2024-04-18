import { preset } from '@streamfinity/streamfinity-branding';
import colors from 'tailwindcss/colors';

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
        },
    },
    plugins: [],
};
