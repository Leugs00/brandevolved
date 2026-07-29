# Admin content management

How the website owner manages services, clients, projects, results and testimonials
from the BrandEvolved admin — no technical knowledge needed.

## Where it is

Everything lives per-site in the admin sidebar under **Portfolio** and
**Categories & filters**:

- **Projects** — your portfolio and case studies
- **Services** — the work you offer
- **Testimonials** — client words
- **Clients** — the businesses behind projects and testimonials
- **Service categories / Industries / Project types / Result types / Testimonial types** — the manageable filter lists

The dashboard shows live counts (published/draft services and projects, projects in
the portfolio, full case studies, published testimonials, testimonials awaiting
permission, confidential clients) with quick **+ Service / + Client / + Project /
+ Testimonial** buttons.

## Admin access & security

Access follows the existing platform roles (`super_admin`, `agency_developer`,
`designer`, `client`). It is **not** "any logged-in user":

- Every content table is protected by row-level security keyed on
  `can_access_site()` — only the site's team and its client can read or write.
- All create/update/delete happens in Astro server actions that run as the
  logged-in user under RLS. Hiding a nav link is never the only protection.
- Publishing rules (below) are enforced **on the server**, not just in the UI.
- Confidential clients and unpublished content are hidden from the public site by
  RLS even if the API is called directly.

The first admin already exists (`lori@brandevolved.ai`, super admin). New people are
added on the Team page (agency roles only).

## How projects act as portfolio items

There is no separate "portfolio". A **project** is the single record. Three toggles
control how it appears:

- **Show in portfolio** → appears on the main portfolio page (`/work`).
- **Featured** → highlighted on the homepage / featured sections.
- **Full case study** → gets its own page at `/work/<address>` with the challenge,
  approach, solution, results and related testimonials.

A project can be in the portfolio without being a full case study.

## Add a service

Services → **Add a service**. Sections: basic info, who it's for, what's included
(deliverables one-per-line; process titles + explanations line-for-line), pricing &
delivery, images, call to action, search settings. **Save as draft** any time;
**Publish** when ready.

## Add a client

Clients → **Add a client**. Fill only public-safe details. Turn on **Permission to
publish** only when the client has agreed. Set status **Confidential** to hide the
client and all their projects/testimonials from the public site entirely.

## Add a project

Projects → **Add a project**:
1. Overview — title, client (add the client first if needed), industry, type, short intro.
2. Portfolio display — Show in portfolio / Full case study / Featured / order.
3. Services — tick every service used (grouped by category).
4. Story — challenge, approach, solution, outcome.
5. Images — main image, plus gallery / before / after (upload, add alt text, reorder).
6. Save the project, then add **Results** in the section that appears (measurable
   numbers or descriptive outcomes).

## Add & link testimonials

Testimonials → **Add a testimonial**: paste the quote, choose the **client** (and
optionally the **project** it's about), tick the **services** praised, add the
source, and confirm **permission**. A testimonial linked to a project shows on that
project's case study automatically.

## Publishing rules

A **project** cannot be published until: it has a title and page address, a client is
chosen, the client is not confidential and has given permission, and at least one
service is linked. A **testimonial** cannot be published until: it has text, a client
is chosen, the client is public, and permission is confirmed. Anything incomplete can
still be **saved as a draft** — the admin lists exactly what needs fixing.

## Previewing drafts

Use the visual page editor's preview (Pages → open a page). Draft projects and
testimonials never appear on the public site or in search until published.

## Images

Uploads go to the shared, per-site `site-assets` storage bucket and are stored as
URLs. Add alternative text for every meaningful image (used by screen readers and
shown if the image fails to load).

## Public filters

The portfolio page and the `Portfolio / projects` page block filter published
projects by **service**, **industry**, **project type**, **result type** and
**featured**. Testimonials and the testimonial block filter by service and more.
See `content-database.md` for the data model behind this.

## Remaining manual steps

- Service pages that automatically list related projects and testimonials, and a
  public services index, are a follow-up (the data + views already support them).
- After any database schema change, regenerate types with the Supabase MCP
  `generate_typescript_types` into `packages/shared/src/database.types.ts`.
