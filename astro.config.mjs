// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://steverahardjo.com',
  trailingSlash: 'never',
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
