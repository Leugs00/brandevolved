import type { APIRoute } from "astro";
import { blockDefs, validateBlockData } from "@brandevolved/shared/blocks";
import { json, apiError } from "../../../lib/api.ts";

export const POST: APIRoute = async ({ locals, request }) => {
  const body = await request.json().catch(() => null);
  const pageId = body?.page_id as string | undefined;
  const kind = body?.kind as string | undefined;
  if (!pageId || !kind || !blockDefs[kind]) return apiError("page_id and a valid kind are required");

  const { data: page } = await locals.db
    .from("pages")
    .select("id, site_id, organization_id")
    .eq("id", pageId)
    .maybeSingle();
  if (!page) return apiError("Page not found", 404);

  const { data: last } = await locals.db
    .from("content_blocks")
    .select("position")
    .eq("page_id", pageId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: created, error } = await locals.db
    .from("content_blocks")
    .insert({
      organization_id: page.organization_id,
      site_id: page.site_id,
      page_id: page.id,
      kind,
      position: (last?.position ?? 0) + 10,
      data: validateBlockData(kind, blockDefs[kind].defaults).success
        ? (blockDefs[kind].defaults as never)
        : ({} as never),
    })
    .select("id")
    .single();

  if (error) return apiError(error.message, 403);
  return json({ id: created.id });
};
