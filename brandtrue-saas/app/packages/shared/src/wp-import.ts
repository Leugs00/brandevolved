import type { Db } from "./supabase.ts";

export interface WpImportResult {
  imported: { path: string; title: string }[];
  skipped: { path: string; reason: string }[];
}

interface WpEntry {
  link: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt?: { rendered: string };
}

/**
 * Imports pages + posts from a WordPress site's public REST API
 * (/wp-json/wp/v2) into the pages/content_blocks tables. Each WP entry
 * becomes a draft page with a single rich-text block; content is then
 * restructured in the visual editor.
 */
export async function importWordPressSite(
  db: Db,
  site: { id: string; organization_id: string },
  wpUrl: string,
): Promise<WpImportResult> {
  const base = wpUrl.replace(/\/+$/, "");
  const result: WpImportResult = { imported: [], skipped: [] };

  const { data: existing } = await db.from("pages").select("path").eq("site_id", site.id);
  const existingPaths = new Set((existing ?? []).map((p) => p.path));

  for (const type of ["pages", "posts"]) {
    let page = 1;
    for (;;) {
      const res = await fetch(`${base}/wp-json/wp/v2/${type}?per_page=50&page=${page}&status=publish`, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        if (page === 1) result.skipped.push({ path: `(${type})`, reason: `WP API returned ${res.status}` });
        break;
      }
      const entries = (await res.json()) as WpEntry[];
      if (!Array.isArray(entries) || entries.length === 0) break;

      for (const entry of entries) {
        const title = decodeEntities(entry.title?.rendered ?? "Untitled");
        let path: string;
        try {
          path = new URL(entry.link).pathname.replace(/\/+$/, "") || "/";
        } catch {
          result.skipped.push({ path: entry.link, reason: "unparseable link" });
          continue;
        }
        if (existingPaths.has(path)) {
          result.skipped.push({ path, reason: "already exists" });
          continue;
        }

        const { data: created, error } = await db
          .from("pages")
          .insert({
            organization_id: site.organization_id,
            site_id: site.id,
            path,
            title,
            meta_description: decodeEntities(stripTags(entry.excerpt?.rendered ?? "")).slice(0, 300) || null,
            status: "draft",
          })
          .select("id")
          .single();
        if (error) {
          result.skipped.push({ path, reason: error.message });
          continue;
        }

        await db.from("content_blocks").insert({
          organization_id: site.organization_id,
          site_id: site.id,
          page_id: created.id,
          kind: "text",
          position: 10,
          data: { html: entry.content?.rendered ?? "" } as never,
        });

        existingPaths.add(path);
        result.imported.push({ path, title });
      }

      if (entries.length < 50) break;
      page += 1;
    }
  }

  return result;
}

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, "–")
    .replace(/&nbsp;/g, " ");
}
