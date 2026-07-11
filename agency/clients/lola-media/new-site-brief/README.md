# Lola Media — New Site Design Brief

Drop the raw materials for the new site design here, then start a Claude session
and say: **"Build the new Lola Media site from the brief in
`agency/clients/lola-media/new-site-brief/`."**

The site already exists in the platform as **"Lola Media — New Site"**
(slug `new-site`, status draft) with starter home/about/contact pages, a contact
form, and a testimonials collection — the build replaces the starter content.

## What to put where

| Folder | What goes in it |
|---|---|
| `mockups/` | Design mockups — images (PNG/JPG), Figma exports, PDFs, or even a rough sketch photo. Annotate with notes if helpful. |
| `images/` | Photography and graphics for the site (hero shots, portfolio pieces, headshots). Claude uploads these to Supabase storage and places them. |
| `fonts/` | Custom font files (`.woff2` preferred — e.g. Ballomont, Blooms). Google Fonts don't need files; just name them in `copy/notes.md`. |
| `copy/` | Page copy as `.md` files — one per page (`home.md`, `about.md`, `services.md`…). Headings become sections; Claude maps them to blocks. |

## What the build session does

1. Reads the mockups and copy, uses the installed design skills
   (`power-design`, `design`, `ui-styling`) to derive layout, spacing, and any
   new block styles needed.
2. Creates/updates pages and blocks in Supabase for the `new-site` site;
   uploads `images/` to the `site-assets` bucket; wires fonts into the theme.
3. Builds it statically (`SITE_ID=<new-site id> pnpm build:site`) and shows you
   screenshots to iterate on — all in the cloud, nothing needed on your laptop.
4. When you're happy: publish to Cloudflare Pages and connect the domain
   (needs the API token — see `brandtrue-saas/docs/cloudflare-setup.md`).

Everything stays editable afterwards in the admin's visual editor.
