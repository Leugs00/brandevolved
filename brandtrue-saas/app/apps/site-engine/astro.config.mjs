import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";

// Static site builder: one build renders one site, selected by SITE_ID.
export default defineConfig({
  output: "static",
  vite: {
    // .env lives at the workspace root, shared by all apps
    envDir: fileURLToPath(new URL("../..", import.meta.url)),
    ssr: {
      noExternal: ["@brandevolved/blocks", "@brandevolved/shared"],
    },
  },
});
