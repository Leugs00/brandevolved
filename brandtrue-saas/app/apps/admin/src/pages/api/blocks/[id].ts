import type { APIRoute } from "astro";
import { validateBlockData } from "@brandevolved/shared/blocks";
import { json, apiError } from "../../../lib/api.ts";

export const PATCH: APIRoute = async ({ locals, params, request }) => {
  const body = await request.json().catch(() => null);
  if (!body) return apiError("Invalid JSON");

  const patch: Record<string, unknown> = {};

  if (body.data !== undefined) {
    const { data: existing } = await locals.db
      .from("content_blocks")
      .select("kind")
      .eq("id", params.id!)
      .maybeSingle();
    if (!existing) return apiError("Block not found", 404);
    const result = validateBlockData(existing.kind, body.data);
    if (!result.success) return apiError(`Invalid block data: ${result.error}`);
    patch.data = result.data;
  }
  if (typeof body.position === "number") patch.position = body.position;
  if (typeof body.locked === "boolean") patch.locked = body.locked;
  if (typeof body.duplicatable === "boolean") patch.duplicatable = body.duplicatable;
  if (Object.keys(patch).length === 0) return apiError("Nothing to update");

  const { data, error } = await locals.db
    .from("content_blocks")
    .update(patch as never)
    .eq("id", params.id!)
    .select("id")
    .maybeSingle();

  if (error) return apiError(error.message, 403);
  if (!data) return apiError("Not allowed — this block may be locked for your role", 403);
  return json({ ok: true });
};

export const DELETE: APIRoute = async ({ locals, params }) => {
  const { data, error } = await locals.db
    .from("content_blocks")
    .delete()
    .eq("id", params.id!)
    .select("id")
    .maybeSingle();
  if (error) return apiError(error.message, 403);
  if (!data) return apiError("Not allowed", 403);
  return json({ ok: true });
};
