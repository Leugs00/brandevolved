import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";
import type { Database } from "./database.types.ts";

export type Db = SupabaseClient<Database>;

export interface SupabaseEnv {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
}

export function readEnv(env: Record<string, string | undefined>): SupabaseEnv {
  const url = env.PUBLIC_SUPABASE_URL;
  const anonKey = env.PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error("PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY must be set (see .env.example)");
  }
  return { url, anonKey, serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY || undefined };
}

/** Anonymous client — build-time fetching of published content, public form posts. */
export function createAnonClient(env: SupabaseEnv): Db {
  return createClient<Database>(env.url, env.anonKey);
}

/** Service-role client — admin-only server operations (user invites). */
export function createServiceClient(env: SupabaseEnv): Db {
  if (!env.serviceRoleKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
  return createClient<Database>(env.url, env.serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * Request-scoped client for the admin app (Astro SSR). Auth session lives in
 * cookies; all queries run as the logged-in user under RLS.
 */
export function createRequestClient(
  env: SupabaseEnv,
  request: Request,
  responseHeaders: Headers,
): Db {
  return createServerClient<Database>(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return parseCookieHeader(request.headers.get("Cookie") ?? "").map((c) => ({
          name: c.name,
          value: c.value ?? "",
        }));
      },
      setAll(cookies) {
        for (const { name, value, options } of cookies) {
          responseHeaders.append("Set-Cookie", serializeCookieHeader(name, value, options));
        }
      },
    },
  });
}
