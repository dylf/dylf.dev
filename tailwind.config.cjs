const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    fontFamily: {
      sans: ["Work Sans", ...defaultTheme.fontFamily.sans],
    },
    extend: {
      colors: {
        "bg-primary": "#2a243c",
        "fg-highlight": "#009d52",
        "active-highlight": "#c78bff",
      },
      fontFamily: {
        headline: ["Signika", ...defaultTheme.fontFamily.sans],
        subheadline: ["Orienta", ...defaultTheme.fontFamily.sans],
        code: ["Victor Mono", ...defaultTheme.fontFamily.mono],
      },
      animation: {
        "gradient-xy": "gradient-xy 10s ease infinite",
      },
      keyframes: {
        "gradient-xy": {
          "from, to": {
            "background-size": "500% 900%",
            "background-position": "left bottom",
          },
          "50%": {
            "background-size": "300% 300%",
            "background-position": "right center",
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
