// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://sjrah.net",
  // GitHub Pages serves directory routes with a trailing slash and 301s the
  // slash-less form. Keep canonical URLs, the sitemap, and internal links on
  // the URL that actually returns 200 so Google does not index redirects.
  trailingSlash: "always",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap()],
  prefetch: {
    prefetchAll: false,
    defaultStrategy: "hover",
  },
  markdown: {
    shikiConfig: {
      theme: "css-variables",
    },
  },
});
