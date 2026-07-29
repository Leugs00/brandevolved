# Cloudflare Pages — connecting deploys

The platform is built for Cloudflare Pages free hosting but ships **unwired** —
publishes queue in the `deploys` table until you connect Cloudflare. Two ways:

## Option A — API token (recommended; makes the Publish button work end-to-end)

1. Sign in at https://dash.cloudflare.com from any browser.
2. Click the profile icon (top right) → **My Profile** → **API Tokens** → **Create Token**.
3. Choose **Create Custom Token**:
   - Name: `brandevolved-deploys`
   - Permissions: **Account → Cloudflare Pages → Edit**
   - Click **Continue to summary** → **Create Token** and copy it.
4. Find your **Account ID**: dash.cloudflare.com → any site → right sidebar, or
   Workers & Pages → overview (it's in the URL).
5. Put both in `brandtrue-saas/app/.env`:
   ```
   CLOUDFLARE_API_TOKEN=...
   CLOUDFLARE_ACCOUNT_ID=...
   ```
6. Tell Claude (or your developer) the token is in place — the deploy runner then:
   - creates a Pages project per site (name from `sites.cloudflare_project`),
   - on publish: `SITE_ID=<id> pnpm build:site` then
     `npx wrangler pages deploy apps/site-engine/dist --project-name=<project>`,
   - writes the `*.pages.dev` preview URL back onto the deploy record.

## Option B — deploy by hand (works today, no token)

```bash
cd brandtrue-saas/app
SITE_ID=<site uuid> pnpm build:site
npx wrangler pages deploy apps/site-engine/dist --project-name=lolamediadesign-main
```
(`wrangler login` opens a browser the first time.)

## Custom domains

Pages project → **Custom domains** → add e.g. `lolamediadesign.com`, follow the
DNS instructions. The `sites.primary_domain` column records it for reference.

## The admin app itself

The admin currently runs as a Node server (`@astrojs/node`). To host it on
Cloudflare too, swap the adapter to `@astrojs/cloudflare` in
`apps/admin/astro.config.mjs` and deploy as a Pages project with functions.
Do this after adding the API token; environment variables move to the Pages
project settings.
