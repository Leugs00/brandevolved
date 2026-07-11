import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

// Admin dashboard: SSR, all data access as the logged-in user under RLS.
// Node adapter for now; swap to @astrojs/cloudflare when deploying to
// Cloudflare (documented in brandtrue-saas/docs/).
export default defineConfig({
  output: "server",
  adapter: node({ mode: "standalone" }),
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
