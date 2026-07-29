// Deploy runner: builds a site statically and ships it to Cloudflare Pages.
//
//   pnpm --filter deploy start -- --site <site slug or uuid>
//
// Needs in ../../.env (or the environment):
//   CLOUDFLARE_API_TOKEN   (Account → Cloudflare Pages → Edit)
//   CLOUDFLARE_ACCOUNT_ID
//   PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_ANON_KEY
//   SUPABASE_SERVICE_ROLE_KEY (optional — lets the runner update deploy records
//   and read draft sites; without it only building/live sites deploy)
import { execFileSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const root = fileURLToPath(new URL("../..", import.meta.url));
const envPath = `${root}/.env`;
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=("?)(.*)\2$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[3];
  }
}

const { CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID, PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY } = process.env;
const siteArg = process.argv[process.argv.indexOf("--site") + 1];

if (!CLOUDFLARE_API_TOKEN || !CLOUDFLARE_ACCOUNT_ID) {
  console.error("CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID must be set — see brandtrue-saas/docs/cloudflare-setup.md");
  process.exit(1);
}
if (!siteArg) {
  console.error("Usage: pnpm --filter deploy start -- --site <site slug or uuid>");
  process.exit(1);
}

const db = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY || PUBLIC_SUPABASE_ANON_KEY);
const isUuid = /^[0-9a-f-]{36}$/i.test(siteArg);
const { data: site, error } = await db
  .from("sites")
  .select("id, name, slug, cloudflare_project, organization_id")
  .eq(isUuid ? "id" : "slug", siteArg)
  .maybeSingle();
if (error || !site) {
  console.error(`Site "${siteArg}" not found${SUPABASE_SERVICE_ROLE_KEY ? "" : " (draft sites need SUPABASE_SERVICE_ROLE_KEY)"}: ${error?.message ?? ""}`);
  process.exit(1);
}

const project = site.cloudflare_project || `${site.slug}-${site.id.slice(0, 8)}`;
console.log(`Deploying "${site.name}" → Pages project "${project}"`);

// 1. ensure the Pages project exists
const cf = async (path, init = {}) => {
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`, "Content-Type": "application/json", ...init.headers },
  });
  return res.json();
};
const existing = await cf(`/pages/projects/${project}`);
if (!existing.success) {
  console.log("Creating Pages project…");
  const created = await cf("/pages/projects", {
    method: "POST",
    body: JSON.stringify({ name: project, production_branch: "main" }),
  });
  if (!created.success) {
    console.error("Could not create Pages project:", JSON.stringify(created.errors));
    process.exit(1);
  }
}

// 2. static build
console.log("Building…");
execFileSync("pnpm", ["--filter", "site-engine", "build"], {
  cwd: root,
  stdio: "inherit",
  env: { ...process.env, SITE_ID: site.id },
});

// 3. deploy via wrangler
console.log("Uploading…");
const out = execFileSync(
  "pnpm",
  ["--filter", "deploy", "exec", "wrangler", "pages", "deploy", `${root}/apps/site-engine/dist`, `--project-name=${project}`, "--branch=main", "--commit-dirty=true"],
  { cwd: root, env: process.env, encoding: "utf8" },
);
console.log(out);
const url = out.match(/https:\/\/[^\s]+\.pages\.dev/)?.[0] ?? `https://${project}.pages.dev`;

// 4. record the result
if (SUPABASE_SERVICE_ROLE_KEY) {
  await db.from("sites").update({ cloudflare_project: project, status: "live" }).eq("id", site.id);
  const { data: queued } = await db
    .from("deploys")
    .select("id")
    .eq("site_id", site.id)
    .eq("status", "queued")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (queued) await db.from("deploys").update({ status: "live", url }).eq("id", queued.id);
  else await db.from("deploys").insert({ organization_id: site.organization_id, site_id: site.id, status: "live", url, note: "CLI deploy" });
}

console.log(`\n✅ Live at ${url}`);
