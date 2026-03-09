// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://sjrah.net',
  trailingSlash: 'never',
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
