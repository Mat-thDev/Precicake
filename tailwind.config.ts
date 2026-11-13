import type { Config } from 'tailwindcss';
import daisyui from 'daisyui';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: ['cupcake'],
    logs: false,
  },
} satisfies Config;
