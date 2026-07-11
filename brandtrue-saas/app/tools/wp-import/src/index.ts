// CLI wrapper around the shared WordPress importer.
// Usage: SITE_ID=<uuid> WP_URL=https://example.com pnpm wp-import
// Needs SUPABASE_SERVICE_ROLE_KEY (writes bypass RLS) — or run the import
// from the admin UI (Sites → Import from WordPress) as a signed-in agency user.
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createServiceClient, readEnv } from "@brandevolved/shared/supabase";
import { importWordPressSite } from "@brandevolved/shared/wp-import";

const envPath = fileURLToPath(new URL("../../../.env", import.meta.url));
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]!]) process.env[m[1]!] = m[2]!;
  }
}

const siteId = process.env.SITE_ID;
const wpUrl = process.env.WP_URL;
if (!siteId || !wpUrl) {
  console.error("Usage: SITE_ID=<uuid> WP_URL=https://example.com pnpm wp-import");
  process.exit(1);
}

const db = createServiceClient(readEnv(process.env));
const { data: site, error } = await db
  .from("sites")
  .select("id, organization_id")
  .eq("id", siteId)
  .single();
if (error || !site) {
  console.error(`Site ${siteId} not found: ${error?.message}`);
  process.exit(1);
}

const result = await importWordPressSite(db, site, wpUrl);
console.log(`Imported ${result.imported.length} pages:`);
for (const p of result.imported) console.log(`  ${p.path}  ${p.title}`);
if (result.skipped.length) {
  console.log(`Skipped ${result.skipped.length}:`);
  for (const s of result.skipped) console.log(`  ${s.path}  (${s.reason})`);
}
