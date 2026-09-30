import js from "@eslint/js";
import tseslint from "typescript-eslint";
import svelte from "eslint-plugin-svelte";
import svelteParser from "svelte-eslint-parser";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default tseslint.config(
  {
    ignores: [
      ".DS_Store",
      "node_modules/**",
      "build/**",
      ".svelte-kit/**",
      "package/**",
      ".env",
      ".env.*",
      "!*.cjs",
      "pnpm-lock.yaml",
      "package-lock.json",
      "yarn.lock",
      "static/**",
      "coverage/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...svelte.configs["flat/recommended"],
  prettier,
  ...svelte.configs["flat/prettier"],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // newer rules not present in the previous eslint 8 + plugin-svelte 2 setup
      "svelte/require-each-key": "warn",
      "svelte/no-navigation-without-resolve": "warn",
      "svelte/no-useless-mustaches": "warn",
      "svelte/no-reactive-literals": "warn",
      "svelte/no-immutable-reactive-statements": "warn",
      "svelte/no-reactive-reassign": "warn",
      "svelte/no-at-html-tags": "warn",
      "no-useless-assignment": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",
      "no-empty": ["error", { allowEmptyCatch: true }],
    },
  },
  {
    files: ["**/*.svelte", "**/*.svelte.ts", "**/*.svelte.js"],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tseslint.parser,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
);
