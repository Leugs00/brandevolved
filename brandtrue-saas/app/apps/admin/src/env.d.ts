/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    db: import("@brandevolved/shared/supabase").Db;
    user: import("@supabase/supabase-js").User | null;
    membership: {
      id: string;
      organization_id: string;
      role: "super_admin" | "agency_developer" | "designer" | "client";
    } | null;
  }
}
