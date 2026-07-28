import { createAnonClient, readEnv } from "@brandevolved/shared/supabase";
import type {
  RenderBlock,
  RenderCollection,
  RenderContext,
  RenderForm,
  RenderProject,
  RenderTestimonial,
} from "@brandevolved/blocks";

/** Loads published testimonials (from public_testimonials) as RenderTestimonial[]. */
export async function fetchTestimonials(db: any, siteId: string): Promise<RenderTestimonial[]> {
  const [{ data: rows }, { data: ts }] = await Promise.all([
    db.from("public_testimonials").select("*").eq("site_id", siteId).order("sort_order"),
    db.from("testimonial_services").select("testimonial_id, services(slug)").eq("site_id", siteId),
  ]);
  const svcByTestimonial = new Map<string, string[]>();
  for (const row of ts ?? []) {
    const slug = (row.services as any)?.slug;
    if (!slug) continue;
    svcByTestimonial.set(row.testimonial_id, [...(svcByTestimonial.get(row.testimonial_id) ?? []), slug]);
  }
  return (rows ?? []).map((t: any) => ({
    id: t.id,
    quote: t.quote,
    short_quote: t.short_quote,
    display_name: t.display_name,
    display_role: t.display_role,
    display_business: t.display_business,
    display_photo: t.display_photo,
    client_location: t.client_location,
    client_website: t.client_website,
    rating: t.rating == null ? null : Number(t.rating),
    featured: !!t.featured,
    service_slugs: svcByTestimonial.get(t.id) ?? [],
  }));
}

/** Loads published services (from public_services) ordered for display. */
export async function fetchServices(db: any, siteId: string): Promise<any[]> {
  const { data } = await db
    .from("public_services")
    .select("*")
    .eq("site_id", siteId)
    .order("sort_order", { nullsFirst: false });
  return data ?? [];
}

/** Loads a single published service by slug (from public_services), or null. */
export async function fetchServiceBySlug(db: any, siteId: string, slug: string): Promise<any | null> {
  const { data } = await db
    .from("public_services")
    .select("*")
    .eq("site_id", siteId)
    .eq("slug", slug)
    .maybeSingle();
  return data ?? null;
}

/** Loads published projects (from public_* views) as RenderProject[]. */
export async function fetchProjects(db: any, siteId: string): Promise<RenderProject[]> {
  const [{ data: projects }, { data: svc }, { data: res }] = await Promise.all([
    db.from("public_projects").select("*").eq("site_id", siteId).order("sort_order"),
    db.from("public_project_services").select("project_id, service_slug"),
    db.from("public_project_results").select("project_id, result_type_slug"),
  ]);
  const svcByProject = new Map<string, string[]>();
  for (const s of svc ?? []) {
    const arr = svcByProject.get(s.project_id) ?? [];
    if (s.service_slug) arr.push(s.service_slug);
    svcByProject.set(s.project_id, arr);
  }
  const resByProject = new Map<string, string[]>();
  for (const r of res ?? []) {
    const arr = resByProject.get(r.project_id) ?? [];
    if (r.result_type_slug) arr.push(r.result_type_slug);
    resByProject.set(r.project_id, arr);
  }
  return (projects ?? []).map((p: any) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    project_summary: p.project_summary,
    hero_image_url: p.hero_image_url,
    featured: p.featured,
    show_in_portfolio: p.show_in_portfolio,
    case_study_enabled: p.case_study_enabled,
    business_name: p.business_name,
    industry_slug: p.industry_slug,
    industry_name: p.industry_name,
    project_type_slug: p.project_type_slug,
    project_type_name: p.project_type_name,
    service_slugs: svcByProject.get(p.id) ?? [],
    result_type_slugs: resByProject.get(p.id) ?? [],
  }));
}

export interface SitePayload {
  site: {
    id: string;
    name: string;
    slug: string;
    settings: SiteSettings;
  };
  pages: {
    id: string;
    path: string;
    title: string;
    meta_description: string | null;
    blocks: RenderBlock[];
  }[];
  context: RenderContext;
}

export interface SiteSettings {
  navigation?: { label: string; href: string }[];
  theme?: Record<string, string>;
  footer_text?: string;
}

const env = readEnv(import.meta.env as Record<string, string | undefined>);

/**
 * Fetches everything needed to statically render one site.
 * Runs as anon: RLS only exposes published pages/blocks of building/live sites,
 * so a build can never leak drafts.
 */
export async function fetchSite(): Promise<SitePayload> {
  const siteId = import.meta.env.SITE_ID || process.env.SITE_ID;
  if (!siteId) throw new Error("SITE_ID must be set to build a site (see .env.example)");

  const db = createAnonClient(env);

  const { data: site, error: siteError } = await db
    .from("sites")
    .select("id, name, slug, settings")
    .eq("id", siteId)
    .single();
  if (siteError || !site) {
    throw new Error(
      `Site ${siteId} not found or not publicly buildable (status must be building/live): ${siteError?.message}`,
    );
  }

  const [{ data: pages, error: pagesError }, { data: blocks }, { data: collections }, { data: items }, { data: forms }] =
    await Promise.all([
      db.from("pages").select("id, path, title, meta_description").eq("site_id", siteId).order("path"),
      db.from("content_blocks").select("id, page_id, kind, data, locked, position").eq("site_id", siteId).order("position"),
      db.from("collections").select("id, slug, name, kind").eq("site_id", siteId),
      db.from("collection_items").select("collection_id, data, position").eq("site_id", siteId).order("position"),
      db
        .from("forms")
        .select("id, slug, name, fields, success_message, honeypot_enabled")
        .eq("site_id", siteId),
    ]);
  if (pagesError) throw new Error(`Failed to fetch pages: ${pagesError.message}`);

  const projects = await fetchProjects(db, siteId);
  const testimonials = await fetchTestimonials(db, siteId);

  const collectionMap: Record<string, RenderCollection> = {};
  for (const c of collections ?? []) {
    collectionMap[c.slug] = {
      id: c.id,
      slug: c.slug,
      name: c.name,
      kind: c.kind,
      items: (items ?? [])
        .filter((i) => i.collection_id === c.id)
        .map((i) => i.data as Record<string, unknown>),
    };
  }

  const formMap: Record<string, RenderForm> = {};
  for (const f of forms ?? []) {
    formMap[f.slug] = {
      id: f.id,
      slug: f.slug,
      name: f.name,
      fields: (f.fields as RenderForm["fields"]) ?? [],
      success_message: f.success_message,
      honeypot_enabled: f.honeypot_enabled,
    };
  }

  return {
    site: { ...site, settings: (site.settings as SiteSettings) ?? {} },
    pages: (pages ?? []).map((p) => ({
      ...p,
      blocks: (blocks ?? [])
        .filter((b) => b.page_id === p.id)
        .map((b) => ({
          id: b.id,
          kind: b.kind,
          data: (b.data as Record<string, unknown>) ?? {},
          locked: b.locked,
          position: b.position,
        })),
    })),
    context: {
      siteId,
      supabaseUrl: env.url,
      anonKey: env.anonKey,
      collections: collectionMap,
      forms: formMap,
      projects,
      testimonials,
    },
  };
}
