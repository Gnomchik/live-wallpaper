// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import imagemin from 'vite-plugin-imagemin';

export default defineConfig({
    plugins: [
        react(),
        fonts({
            google: {
                families: [
                    { name: 'Montserrat', styles: 'wght@400;700' },
                    { name: 'Roboto', styles: 'wght@400;700' }
                ]
            }
        }),
        imagemin({
            gifsicle: { optimizationLevel: 3 },
            optipng: { optimizationLevel: 5 },
            mozjpeg: { quality: 75 },
            pngquant: { quality: [0.65, 0.90], speed: 4 },
            svgo: {
                plugins: [
                    { removeViewBox: false },
                    { removeEmptyAttrs: true }
                ]
            },
        }),
        purgecss({
            content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
            safelist: [],
        }),
    ],
    build: {
        minify: 'esbuild',
    },
});
