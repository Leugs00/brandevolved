import type { APIRoute } from "astro";
import { json, apiError } from "../../../lib/api.ts";

export const PATCH: APIRoute = async ({ locals, params, request }) => {
  const body = await request.json().catch(() => null);
  if (!body) return apiError("Invalid JSON");

  const patch: Record<string, unknown> = {};
  if (typeof body.title === "string" && body.title.trim()) patch.title = body.title.trim();
  if (typeof body.path === "string" && body.path.trim()) {
    patch.path = body.path.startsWith("/") ? body.path.trim() : `/${body.path.trim()}`;
  }
  if (typeof body.meta_description === "string") patch.meta_description = body.meta_description || null;
  if (body.status === "draft" || body.status === "published") patch.status = body.status;
  if (Object.keys(patch).length === 0) return apiError("Nothing to update");

  const { data, error } = await locals.db
    .from("pages")
    .update(patch as never)
    .eq("id", params.id!)
    .select("id")
    .maybeSingle();
  if (error) return apiError(error.message, 403);
  if (!data) return apiError("Not allowed for your role", 403);
  return json({ ok: true });
};

export const DELETE: APIRoute = async ({ locals, params }) => {
  // blocks first (no cascade on content_blocks.page_id)
  const { error: blockError } = await locals.db.from("content_blocks").delete().eq("page_id", params.id!);
  if (blockError) return apiError(blockError.message, 403);
  const { data, error } = await locals.db.from("pages").delete().eq("id", params.id!).select("id").maybeSingle();
  if (error) return apiError(error.message, 403);
  if (!data) return apiError("Not allowed", 403);
  return json({ ok: true });
};
