import type { Db } from "@brandevolved/shared/supabase";

export interface SiteRow {
  id: string;
  organization_id: string;
  client_id: string;
  name: string;
  slug: string;
  status: "draft" | "building" | "live" | "archived";
  primary_domain: string | null;
  cloudflare_project: string | null;
  wp_source_url: string | null;
  settings: Record<string, unknown>;
}

/** Loads one site; RLS returns nothing if the user can't access it. */
export async function loadSite(db: Db, siteId: string): Promise<SiteRow | null> {
  const { data } = await db
    .from("sites")
    .select("id, organization_id, client_id, name, slug, status, primary_domain, cloudflare_project, wp_source_url, settings")
    .eq("id", siteId)
    .maybeSingle();
  return (data as SiteRow | null) ?? null;
}
