import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
/** @type {import('astro/config').AstroUserConfig} */
export default defineConfig({
  integrations: [tailwind()],
  vite: {
    define: {
      'import.meta.env.VERCEL_ANALYTICS_ID': JSON.stringify(
        process.env.VERCEL_ANALYTICS_ID
      ),
    },
  },
});
