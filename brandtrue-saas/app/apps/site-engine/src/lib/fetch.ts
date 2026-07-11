import { createAnonClient, readEnv } from "@brandevolved/shared/supabase";
import type { RenderBlock, RenderCollection, RenderContext, RenderForm } from "@brandevolved/blocks";

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
    },
  };
}
