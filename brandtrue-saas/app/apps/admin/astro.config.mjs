import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

// Admin dashboard: SSR, all data access as the logged-in user under RLS.
// Local runs use the node adapter; DEPLOY_TARGET=cloudflare builds for
// Cloudflare Pages (see brandtrue-saas/docs/cloudflare-setup.md).
const cf = process.env.DEPLOY_TARGET === "cloudflare";

export default defineConfig({
  output: "server",
  adapter: cf ? cloudflare() : node({ mode: "standalone" }),
  server: { port: 4322 },
  // Astro's origin check misfires behind the bare-IP node server; CSRF is
  // covered by the SameSite=Lax Supabase auth cookies (cross-site POSTs
  // arrive unauthenticated and get redirected to /login).
  security: { checkOrigin: false },
  vite: {
    plugins: [tailwindcss()],
    envDir: fileURLToPath(new URL("../..", import.meta.url)),
    ssr: {
      noExternal: ["@brandevolved/blocks", "@brandevolved/shared"],
    },
  },
});
