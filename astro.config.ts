import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import wasm from "vite-plugin-wasm";
import sitemap from "@astrojs/sitemap";

import vercel from "@astrojs/vercel/serverless";

export default defineConfig({
  site: "https://dylf.dev",
  integrations: [wasm(), tailwind(), sitemap()],
  prefetch: true,
  vite: {
    optimizeDeps: {
      exclude: ["@dylf/wasm-game-of-life"],
    },
    plugins: [wasm()],
  },
  output: "server",
  adapter: vercel({
    imageService: true,
    webAnalytics: {
      enabled: true,
    },
  }),
});

