import { defineConfig } from "astro/config";
import wasm from "vite-plugin-wasm";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://dylf.dev",
  prefetch: true,
  integrations: [sitemap()],
  vite: {
    optimizeDeps: {
      exclude: ["@dylf/wasm-game-of-life"],
    },
    plugins: [wasm(), tailwindcss()],
  },
  output: "server",
  adapter: vercel({
    imageService: true,
    webAnalytics: {
      enabled: true,
    },
  }),
});
