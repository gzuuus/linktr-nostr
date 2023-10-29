import { join } from "path";
import type { Config } from "tailwindcss";
import { skeleton } from "@skeletonlabs/tw-plugin";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    join(require.resolve("@skeletonlabs/skeleton"), "../**/*.{html,js,svelte,ts}"),
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter"],
      },
      screens: {
        sm: "408px",
      },
    },
  },
  plugins: [
    forms,
    skeleton({
      themes: {
        preset: [
          { name: "crimson", enhancements: true },
          { name: "gold-nouveau", enhancements: true },
          { name: "hamlindigo", enhancements: true },
          { name: "modern", enhancements: true },
          { name: "rocket", enhancements: true },
          { name: "sahara", enhancements: true },
          { name: "seafoam", enhancements: true },
          { name: "skeleton", enhancements: true },
          { name: "vintage", enhancements: true },
          { name: "wintry", enhancements: true },
        ],
      },
    }),
  ],
} satisfies Config;
