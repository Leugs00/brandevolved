import type { AstroCookies } from "astro";
import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { readEnv, type Db } from "@brandevolved/shared/supabase";
import type { Database } from "@brandevolved/shared/database.types";

export const env = readEnv(import.meta.env as Record<string, string | undefined>);

/** Request-scoped client: queries run as the logged-in user under RLS. */
export function supabaseFor(request: Request, cookies: AstroCookies): Db {
  return createServerClient<Database>(env.url, env.anonKey, {
    cookies: {
      getAll: () =>
        parseCookieHeader(request.headers.get("Cookie") ?? "").map((c) => ({
          name: c.name,
          value: c.value ?? "",
        })),
      setAll: (list) => {
        for (const { name, value, options } of list) {
          cookies.set(name, value, { ...options, path: "/" });
        }
      },
    },
  });
}

/** Service-role client — ONLY for team invites; requires SUPABASE_SERVICE_ROLE_KEY. */
export function serviceClient(): Db | null {
  if (!env.serviceRoleKey) return null;
  return createClient<Database>(env.url, env.serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
