import path from 'path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        react({
            include: ['**/*.jsx', '**/*.js'],
        }),
    ],
    resolve: {
        alias: {
            '~': path.resolve(__dirname, './src'),
            '@': path.resolve(__dirname, './'),
        },
    },
    test: {
        environment: 'jsdom',
        environmentOptions: {
            jsdom: {
                url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            },
        },
        setupFiles: ['./tests/setup.js'],
        env: {
            VITE_API_URL: 'https://cyber.streamfinity.tv',
            VITE_FRONTEND_URL: 'https://streamfinity.tv',
        },
    },
});
