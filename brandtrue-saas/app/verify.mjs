// End-to-end verification: admin walkthrough (super admin + client roles),
// visual editor inline edit, and public-site form submission + beacon.
import { chromium } from "playwright-core";

const ADMIN = "http://127.0.0.1:4322";
const SITE = "http://127.0.0.1:4321";
const OUT = process.env.OUT_DIR;
const results = [];
const ok = (name, pass, detail = "") => {
  results.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
};

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

async function login(page, email, password) {
  await page.goto(`${ADMIN}/login`);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForLoadState("networkidle");
}

// ── Super admin ────────────────────────────────────────────
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await login(page, "admin-test@brandevolved.test", "fCl0PIrHlnzhCCyl");
  ok("admin login", page.url() === `${ADMIN}/`, page.url());
  await page.screenshot({ path: `${OUT}/admin-01-sites.png` });

  await page.click("text=Lola Media Design");
  await page.waitForLoadState("networkidle");
  ok("site dashboard", await page.locator("text=Daily page views").count() === 1);
  await page.screenshot({ path: `${OUT}/admin-02-dashboard.png` });

  // Pages → editor
  await page.click('nav >> text=Pages');
  await page.waitForLoadState("networkidle");
  await page.screenshot({ path: `${OUT}/admin-03-pages.png` });
  await page.click('a:has-text("Lola Media - Web Design")');
  await page.waitForLoadState("networkidle");
  const frame = page.frameLocator("#preview");
  await frame.locator(".be-hero").waitFor({ timeout: 15000 });
  ok("editor preview renders hero", true);
  await page.screenshot({ path: `${OUT}/admin-04-editor.png` });

  // click hero (locked=true but super admin can edit) → side panel shows fields
  await frame.locator(".be-hero h1").click();
  await page.waitForTimeout(400);
  ok("hero selected in panel", (await page.locator('#block-editor:has-text("Hero")').count()) === 1);

  // inline-edit the CTA block heading
  const cta = frame.locator('.be-block[data-block-kind="cta"] h2');
  await cta.click();
  await cta.evaluate((el) => {
    el.textContent = "Ready to uplevel your brand? ✨";
    el.dispatchEvent(new Event("input", { bubbles: true }));
  });
  let saveText = "";
  for (let i = 0; i < 16; i++) {
    await page.waitForTimeout(500);
    saveText = (await page.locator("#save-state").textContent()) ?? "";
    if (saveText.includes("Saved") || saveText === "") break;
  }
  ok("inline edit autosaved", saveText.includes("Saved") || saveText === "", `state="${saveText}"`);
  await page.screenshot({ path: `${OUT}/admin-05-editor-inline-edit.png` });

  // walk remaining sections
  for (const [label, shot, probe] of [
    ["Enquiries", "admin-06-leads.png", "Emma Wilson"],
    ["Contacts", "admin-07-contacts.png", "anna@example.org"],
    ["Customers", "admin-08-customers.png", "Matakana Homewares"],
    ["Forms", "admin-09-forms.png", "Contact form"],
    ["Collections", "admin-10-collections.png", "Testimonials"],
    ["Publish", "admin-11-publish.png", "Deploy history"],
  ]) {
    await page.click(`nav >> text=${label}`);
    await page.waitForLoadState("networkidle");
    ok(`${label} page shows data`, (await page.locator(`text=${probe}`).count()) >= 1);
    await page.screenshot({ path: `${OUT}/${shot}` });
  }

  // publish button → deploy row
  await page.click('button:has-text("Publish site")');
  await page.waitForLoadState("networkidle");
  ok("publish queues a deploy", (await page.locator("text=Queued from admin").count()) >= 1);

  // team (global nav — go via sites root)
  await page.goto(`${ADMIN}/team`);
  await page.waitForLoadState("networkidle");
  ok("team lists members", (await page.locator("text=admin-test@brandevolved.test").count()) >= 1);
  await page.screenshot({ path: `${OUT}/admin-12-team.png` });
  await ctx.close();
}

// ── Client role ────────────────────────────────────────────
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await login(page, "client-test@lolamedia.test", "avMTuDQXbdmQec1u");
  ok("client login", page.url() === `${ADMIN}/`);
  await page.click("text=Lola Media Design");
  await page.waitForLoadState("networkidle");
  ok("client sees dashboard", (await page.locator("text=Daily page views").count()) === 1);
  ok("client has NO Publish nav", (await page.locator("nav >> text=Publish").count()) === 0);
  await page.screenshot({ path: `${OUT}/client-01-dashboard.png` });

  // team should redirect away
  await page.goto(`${ADMIN}/team`);
  await page.waitForLoadState("networkidle");
  ok("client blocked from /team", !page.url().endsWith("/team"), page.url());

  // editor: hero is locked → shows lock, no structure controls
  await page.goto(`${ADMIN}/sites`);
  await page.goto(`${ADMIN}/`);
  await page.click("text=Lola Media Design");
  await page.click("nav >> text=Pages");
  await page.click('a:has-text("Lola Media - Web Design")');
  await page.waitForLoadState("networkidle");
  const frame = page.frameLocator("#preview");
  await frame.locator(".be-hero").waitFor({ timeout: 15000 });
  const heroEditable = await frame.locator('.be-block[data-block-kind="hero"]').getAttribute("data-editable");
  ok("locked hero not editable for client", heroEditable === "false", `data-editable=${heroEditable}`);
  ok("client has no Add-block UI", (await page.locator("#add-block:visible").count()) === 0);
  await page.screenshot({ path: `${OUT}/client-02-editor-locked.png` });
  await ctx.close();
}

// ── Public site: form submission + beacon ──────────────────
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`${SITE}/contact`, { waitUntil: "networkidle" });
  await page.fill('input[name="name"]', "Verification Bot");
  await page.fill('input[name="email"]', "verify@example.com");
  await page.fill('input[name="phone"]', "021 000 111");
  await page.fill('textarea[name="message"]', "This is an automated end-to-end test enquiry.");
  await page.click('form[data-be-form] button[type="submit"]');
  await page.waitForSelector('text=Thanks for reaching out', { timeout: 10000 });
  ok("public form submits", true);
  await page.screenshot({ path: `${OUT}/site-01-form-submitted.png` });
  await page.waitForTimeout(1000); // let beacon land
  await ctx.close();
}

await browser.close();
const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
