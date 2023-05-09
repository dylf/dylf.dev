import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import compress from "astro-compress";
import prefetch from "@astrojs/prefetch";
import wasm from 'vite-plugin-wasm'

// https://astro.build/config
export default defineConfig({
  integrations: [wasm(), tailwind(), compress(), prefetch()],
  vite: {
    optimizeDeps: {
      exclude: ['@dylf/wasm-game-of-life'],
    },
    plugins: [wasm()],
    define: {
      'import.meta.env.VERCEL_ANALYTICS_ID': JSON.stringify(process.env.VERCEL_ANALYTICS_ID)
    }
  }
});
