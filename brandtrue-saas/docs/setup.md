# BrandEvolved Web Builder — Setup & Operations

The platform lives in `brandtrue-saas/app/` (pnpm workspace). It builds and manages
client websites with Astro, stores everything in Supabase (project **website-rebuilder**,
id `emicyinmmwhipguddeud`), and deploys static sites to Cloudflare Pages
(see `cloudflare-setup.md`).

## Pieces

| Path | What it is |
|---|---|
| `apps/admin` | The backend dashboard (Astro SSR). Login, visual editor, enquiries/contacts/customers, forms, collections, analytics, publish, team. |
| `apps/site-engine` | Static site builder. One build renders one site: `SITE_ID=<uuid> pnpm build`. |
| `packages/blocks` | Block components shared by the site engine **and** the editor preview — what you see in the editor is exactly what publishes. |
| `packages/shared` | Supabase clients, DB types, block schemas, email layer, WordPress importer. |
| `tools/wp-import` | CLI wrapper for the WordPress importer (also available in the admin UI). |

## First run

```bash
cd brandtrue-saas/app
cp .env.example .env       # then fill in values (Supabase URL + anon key already documented)
pnpm install

# admin dashboard (http://localhost:4322)
pnpm build:admin && HOST=127.0.0.1 PORT=4322 node apps/admin/dist/server/entry.mjs
# or for development: pnpm dev:admin

# build a client site (static output in apps/site-engine/dist/)
SITE_ID=<site uuid> pnpm build:site
```

## Accounts

Real account: **lolamediadesign@gmail.com** (super admin — already existed).

Two throwaway test accounts were seeded for verification; delete them once real
accounts exist (Supabase dashboard → Authentication → Users):
- `admin-test@brandevolved.test` (super admin)
- `client-test@lolamedia.test` (client role, scoped to Lola Media)

## Roles

| Ability | Super admin | Developer | Designer | Client |
|---|---|---|---|---|
| Everything, all clients | ✅ | ✅ | — | — |
| Edit pages/blocks/forms/collections | ✅ | ✅ | ✅ (unlocked blocks only) | content of **their** client only, unlocked blocks only |
| Lock/unlock blocks | ✅ | ✅ | — | — |
| See enquiries/contacts/customers/analytics | ✅ | ✅ | ✅ | ✅ (their client) |
| Publish / deploys | ✅ | ✅ | view | — |
| Team management | ✅ | invite only | — | — |

Enforcement is **in the database** (row-level security), not just the UI — a client
with API access still cannot touch locked blocks, other clients' data, or deploys.

## Inviting people

With `SUPABASE_SERVICE_ROLE_KEY` set in `.env`, use the admin **Team** page.
Without it, create the user in the Supabase dashboard (Authentication → Users →
Add user, confirm email) and link them:

```sql
insert into public.memberships (user_id, organization_id, role)
values ('<auth user id>', (select id from organizations limit 1), 'client');

-- clients additionally need a scope:
insert into public.client_scopes (membership_id, client_id)
values ((select id from memberships where user_id = '<auth user id>'),
        (select id from clients where slug = '<client slug>'));
```

## Branding the admin

- Colors, fonts, radii: `apps/admin/src/styles/brand.css` (currently Lola Media).
  Swap the variable values to re-skin everything — e.g. to BrandEvolved.
- Workspace name: `PUBLIC_BRAND_NAME` in `.env`.
- Heading font Cormorant + body DM Sans load from Google Fonts. The script fonts
  (Ballomont/Blooms) from the design system need their `.woff2` files if wanted.

## Email

`RESEND_API_KEY` empty → **log-only mode**: every email is recorded in the
`email_log` table instead of being sent. Add the key to go live; sender address
is in `packages/shared/src/email.ts`.

## End-to-end verification

`apps/../verify.mjs` (workspace root) drives a headless browser through login,
every admin section, an inline visual edit, client-role restrictions, and a
public form submission:

```bash
# admin on :4322 and a built site preview on :4321, then
OUT_DIR=/tmp/shots node verify.mjs
```
