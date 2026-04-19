# CLAUDE.md — BrandEvolved Repo Orientation

This file is the entry point for AI agents working in this repo. Read this before touching anything.

## What This Repo Is

BrandEvolved is a multi-tier business platform with three product lines and a shared executive workspace. All tiers live in one monorepo.

## Directory Map

```
/
├── executives/     Cross-functional workspace: COO, CFO, CMO
│   ├── strategy/   Annual goals, OKRs, long-range planning
│   ├── finance/    Budgets, forecasts, reports (CONFIDENTIAL)
│   ├── marketing/  Brand guidelines, campaign planning
│   └── reporting/  KPIs, dashboards, cross-tier metrics
│
├── edu/            Tier 1 — DIY / Education
│   ├── courses/    Course content, curriculum, recordings
│   ├── content/    Blog posts (blog/), social copy (social/)
│   └── resources/  Downloads, templates, lead magnets
│
├── agency/         Tier 2 — Agency Services
│   ├── clients/    Per-client folders (one subfolder per client)
│   ├── projects/   Active project workspaces
│   └── templates/  Reusable deliverable templates
│
└── brandtrue-saas/ Tier 3 — BrandTrue SaaS Product
    ├── app/        Application source code
    ├── features/   Feature specs, flags, roadmap
    └── docs/       User-facing and internal documentation
```

## Rules for AI Agents

1. **Never commit `.env`** — it is git-ignored. Use `.env.example` as the template.
2. **Scope your changes** — if a task is in `edu/`, stay in `edu/` unless explicitly told otherwise.
3. **`executives/finance/` is confidential** — do not log, summarize, or surface its contents unless the task explicitly requires it.
4. **No orphan files at root** — all new files belong inside a tier or `executives/`.
5. **Kebab-case** for all file and folder names.
6. **Add a README.md** to any new top-level folder you create.

## Environment Setup

```bash
cp .env.example .env
# Fill in values in .env
```

## Ownership

| Area                | Owner Role              |
|---------------------|-------------------------|
| `executives/`       | COO, CFO, CMO           |
| `edu/`              | EDU lead                |
| `agency/`           | Agency director         |
| `brandtrue-saas/`   | Product / Engineering   |

## Branch Convention

- `claude/<task-slug>-<id>` — agent branches
- `feat/<description>` — human feature branches
- `fix/<description>` — bug fixes
- `main` — production-ready state
