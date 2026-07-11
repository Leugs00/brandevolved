import type { APIRoute } from "astro";
import { env } from "../../lib/supabase.ts";
import { json, apiError } from "../../lib/api.ts";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]);

export const POST: APIRoute = async ({ locals, request }) => {
  const form = await request.formData().catch(() => null);
  const siteId = form?.get("site_id");
  const file = form?.get("file");
  if (typeof siteId !== "string" || !(file instanceof File)) return apiError("site_id and file are required");
  if (!ALLOWED.has(file.type)) return apiError("Only image uploads are allowed");
  if (file.size > MAX_BYTES) return apiError("Image is too large (max 8 MB)");

  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]+/g, "-").slice(-60);
  const path = `${siteId}/${crypto.randomUUID().slice(0, 8)}-${safeName}`;

  const { error } = await locals.db.storage
    .from("site-assets")
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) return apiError(error.message, 403);

  return json({ url: `${env.url}/storage/v1/object/public/site-assets/${path}` });
};
