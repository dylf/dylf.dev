import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import wasm from "vite-plugin-wasm";

export default defineConfig({
  integrations: [wasm(), tailwind()],
  image: {
    service: {
      entrypoint: "astro/assets/services/noop",
    },
  },
  prefetch: true,
  vite: {
    optimizeDeps: {
      exclude: ["@dylf/wasm-game-of-life"],
    },
    plugins: [wasm()],
    define: {
      "import.meta.env.VERCEL_ANALYTICS_ID": JSON.stringify(
        process.env.VERCEL_ANALYTICS_ID
      ),
    },
  },
});
