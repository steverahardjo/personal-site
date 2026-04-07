// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://sjrah.net",
  vite: {
    plugins: [tailwindcss()],
  },
  trailingSlash: "never",
  integrations: [sitemap(), react()],
  markdown: {
    shikiConfig: {
      theme: "github-dark",
    },
  },
});
