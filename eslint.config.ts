import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // Ignore build output
  {
    ignores: ["dist/**", ".astro/**"],
  },

  // Base config
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: {
      globals: globals.browser,
    },
  },

  // TypeScript
  ...tseslint.configs.recommended,
]);
