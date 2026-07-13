# Content database — services, clients, projects, results, testimonials

This is the normalized relational content model that powers portfolio, services and
social proof on client websites. It lives alongside the generic `collections`
system (which stays for ad-hoc data) — these five content types get first-class tables.

Everything is **site-scoped**: every row carries `organization_id` + `site_id`, and
row-level security (RLS) enforces that. There is no separate "portfolio" table —
**a portfolio item is a project.**

## Tables

| Table | What it holds |
|---|---|
| `service_categories` | Groups for services (Brand, Website, Photography…). `status`. |
| `industries` | Business types for filtering (Health & wellness, Coaching…). |
| `project_types` | Kinds of work (Website, Brand identity…). |
| `result_types` | Kinds of outcome (More enquiries, Brand clarity…). |
| `testimonial_types` | Where a testimonial came from (Written, Video, Google review…). |
| `services` | A service you offer. Category + optional parent service, pricing, deliverables/process (jsonb), audiences/formats/stages, SEO, `featured`, `status`. |
| `showcase_clients` | **Lola's clients** — public case-study attribution. `business_name` (req), optional person `name`, `industry_id`, `permission_to_publish`, `status` (active/past/**confidential**/archived). *Distinct from the platform `clients` table (agency tenants).* |
| `projects` | The single source of truth for portfolio / work / case studies. `showcase_client_id` (req), narrative fields, images (jsonb), `show_in_portfolio`, `case_study_enabled`, `featured`, `sort_order`, `status`, `published_at`. |
| `project_services` | Junction: a project ↔ its services (many-to-many). |
| `project_results` | Measurable or descriptive outcomes for a project. `result_kind` quantitative/qualitative; quantitative **must** carry `metric_value` (check constraint). |
| `testimonials` | `showcase_client_id` (req), optional `project_id`, `quote`, override fields, `rating` (1–5 check), `permission_confirmed`, `status`. |
| `testimonial_services` | Junction: a testimonial ↔ the services it praises. |

## Key relationships

```
showcase_client ──< projects ──< project_results
       │               │
       │               ├──< project_services >── services
       │               │
       └──< testimonials ──< testimonial_services >── services
                     └── (optional) project
```

- A **project belongs to one client** and links to **many services** (via `project_services`).
- A **testimonial belongs to one client**, may link to **one project**, and links to **many services** (via `testimonial_services`).
- A project has **many results**, each measurable (a number) or qualitative (words).

## How the website "views" work

There are no separate portfolio/case-study tables. The public site filters `projects`:

| Public view | Query |
|---|---|
| Portfolio / Our Work | `status = published AND show_in_portfolio = true` |
| Homepage featured | `+ featured = true` |
| Full case study page | single project by slug where `case_study_enabled = true` |

Reusable **SECURITY INVOKER views** (RLS still applies) join the public-safe data:
`public_services`, `public_projects`, `public_project_services`,
`public_project_results`, `public_testimonials` (attribution resolves
`*_override` ?? client record). The site engine reads these in
`apps/site-engine/src/lib/fetch.ts` (`fetchProjects`).

Filtering is by **slug**: service slug, industry slug, project-type slug,
result-type slug, plus featured / business stage. The `project_list` block and
`/work` routes use `filterProjects()` from `@brandevolved/blocks`.

## Publishing permission rules (enforced in RLS + admin server actions)

A row is only publicly readable when **all** hold:
- **Projects:** `status = published` AND site is building/live AND the client is
  public (`status <> confidential` AND `permission_to_publish`).
- **Testimonials:** `status = published` AND `permission_confirmed` AND the client is public.
- **Showcase clients:** `status <> confidential` AND `permission_to_publish`.
- **Confidential clients, their projects and testimonials never appear publicly** —
  even if someone hits the API directly, RLS hides them.

`packages/shared/src/content.ts` exports `projectPublishBlockers()` /
`testimonialPublishBlockers()` — the admin calls these before allowing a publish.

## Adding content (SQL is not required — use the admin)

- **Service:** Admin → Services → Add a service → fill sections → Publish.
- **Client:** Admin → Clients → Add a client. Turn on *Permission to publish* only
  when they've agreed. Mark *Confidential* to hide entirely.
- **Project:** Admin → Projects → Add a project → choose client, tick services,
  write the story, add results and images, set *Show in portfolio* / *Full case study* → Publish.
- **Result:** open a saved project → Results section → Add a result (choose "has a number" or "descriptive").
- **Testimonial:** Admin → Testimonials → Add → choose client (+ optional project),
  tick services, confirm permission → Publish.

## Media

Images are **URLs**, never binary in Postgres. Uploads go to the existing public
Supabase Storage bucket `site-assets` under `<site_id>/…` (per-site RLS on
`storage.objects`). Confidential-client media should not be uploaded to the public bucket.

## Remaining manual setup

- Admin CRUD is built (`apps/admin/src/pages/sites/[site]/{services,clients,projects,testimonials,categories}`).
- Service pages that auto-show related projects/testimonials, and a public services
  index, are a follow-up — the `public_services` view + junctions already support them.
- Types regenerate with the Supabase MCP `generate_typescript_types` into
  `packages/shared/src/database.types.ts` after any schema change.
