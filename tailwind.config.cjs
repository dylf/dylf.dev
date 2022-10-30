/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    fontFamily: {
      sans: ['Work Sans', 'sans-serif'],
    },
    extend: {
      colors: {
        'custom-purple': '#2a243c',
        greeny: '#009d52',
        'active-highlight': '#c78bff',
      },
      fontFamily: {
        headline: ['Signika', 'sans-serif'],
        subheadline: ['Orienta', 'sans-serif'],
        code: ['Victor Mono'],
      },
      animation: {
        'gradient-xy': 'gradient-xy 10s ease infinite',
      },
      keyframes: {
        'gradient-xy': {
          'from, to': {
            'background-size': '500% 900%',
            'background-position': 'left bottom',
          },
          '50%': {
            'background-size': '300% 300%',
            'background-position': 'right center',
          },
        },
      },
    },
  },
  plugins: [],
};
