import adapterCloudflare from "@sveltejs/adapter-cloudflare";
import adapterVercel from "@sveltejs/adapter-vercel";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

const adapter = process.env.VERCEL
  ? adapterVercel({ runtime: "nodejs22.x" })
  : adapterCloudflare({
      // See below for an explanation of these options
      routes: {
        include: ["/*"],
        exclude: ["<all>"],
      },
    });

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte"],
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: [vitePreprocess()],

  kit: {
    adapter,
    // Mount under a path prefix (e.g. NOSTREE_BASE=/nostree on Vercel)
    paths: {
      base: process.env.NOSTREE_BASE ?? "",
    },
  },
};
export default config;
