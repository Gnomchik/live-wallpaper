import purgecss from '@fullhuman/postcss-purgecss';
import cssnano from 'cssnano';

export default {
  plugins: [
    purgecss({
      content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    }),
    cssnano({ preset: 'default' })
  ],
};