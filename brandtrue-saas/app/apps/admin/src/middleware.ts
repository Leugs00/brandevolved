import { defineMiddleware } from "astro:middleware";
import { supabaseFor } from "./lib/supabase.ts";

const PUBLIC_PATHS = new Set(["/login"]);

export const onRequest = defineMiddleware(async (context, next) => {
  const db = supabaseFor(context.request, context.cookies);
  context.locals.db = db;
  context.locals.user = null;
  context.locals.membership = null;

  const {
    data: { user },
  } = await db.auth.getUser();

  if (user) {
    context.locals.user = user;
    const { data: membership } = await db
      .from("memberships")
      .select("id, organization_id, role")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();
    context.locals.membership = membership ?? null;
  }

  const path = context.url.pathname;
  if (!user && !PUBLIC_PATHS.has(path)) {
    return context.redirect(`/login?next=${encodeURIComponent(path)}`);
  }
  if (user && path === "/login" && context.request.method === "GET") {
    return context.redirect("/");
  }

  return next();
});
