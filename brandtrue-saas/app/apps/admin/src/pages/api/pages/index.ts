import type { APIRoute } from "astro";
import { json, apiError } from "../../../lib/api.ts";

export const POST: APIRoute = async ({ locals, request }) => {
  const body = await request.json().catch(() => null);
  const siteId = body?.site_id as string | undefined;
  let path = String(body?.path ?? "").trim();
  const title = String(body?.title ?? "").trim();
  if (!siteId || !path || !title) return apiError("site_id, path and title are required");
  if (!path.startsWith("/")) path = `/${path}`;

  const { data: site } = await locals.db
    .from("sites")
    .select("id, organization_id")
    .eq("id", siteId)
    .maybeSingle();
  if (!site) return apiError("Site not found", 404);

  const { data: created, error } = await locals.db
    .from("pages")
    .insert({ organization_id: site.organization_id, site_id: site.id, path, title })
    .select("id")
    .single();
  if (error) return apiError(error.message, 403);

  await locals.db.from("content_blocks").insert({
    organization_id: site.organization_id,
    site_id: site.id,
    page_id: created.id,
    kind: "text",
    position: 10,
    data: { html: `<h1>${title}</h1><p>Write your content…</p>` } as never,
  });

  return json({ id: created.id });
};
