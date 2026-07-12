import { z } from "zod";

/**
 * Zod schemas + types for the normalized content model
 * (services, showcase clients, projects, results, testimonials, lookups).
 * Used for server-side validation in the admin content editors and for
 * shared TS types. Publishing rules that need related rows (e.g. "a project
 * needs at least one service") live in the admin actions, not here.
 */

export const contentStatus = z.enum(["draft", "published", "archived"]);
export const showcaseClientStatus = z.enum(["active", "past", "confidential", "archived"]);
export const resultKind = z.enum(["quantitative", "qualitative"]);

export const slug = z
  .string()
  .min(1, "Please add a page address.")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by hyphens, e.g. website-design.");

const optionalUrl = z
  .string()
  .trim()
  .refine((v) => v === "" || /^https?:\/\//.test(v), "Please enter a valid website address, including https://")
  .transform((v) => (v === "" ? null : v))
  .nullable()
  .optional();

const textArray = z.array(z.string()).default([]);
const imageItem = z.object({
  src: z.string(),
  alt: z.string().default(""),
  caption: z.string().default("").optional(),
});
const imageArray = z.array(imageItem).default([]);

// ── lookups ────────────────────────────────────────────────
export const lookupSchema = z.object({
  name: z.string().min(1, "Please enter a name."),
  slug,
  description: z.string().optional().nullable(),
  sort_order: z.number().int().default(0),
});
export const serviceCategorySchema = lookupSchema.extend({ status: contentStatus.default("published") });

// ── services ───────────────────────────────────────────────
export const serviceSchema = z.object({
  service_category_id: z.string().uuid().nullable().optional(),
  parent_service_id: z.string().uuid().nullable().optional(),
  name: z.string().min(1, "Please add a service name before saving."),
  slug,
  short_description: z.string().optional().nullable(),
  full_description: z.string().optional().nullable(),
  featured_image_url: optionalUrl,
  icon_url: optionalUrl,
  starting_price: z.number().nonnegative().nullable().optional(),
  currency: z.string().optional().nullable(),
  price_label: z.string().optional().nullable(),
  delivery_time: z.string().optional().nullable(),
  ideal_for: z.string().optional().nullable(),
  deliverables: textArray,
  process: z
    .array(z.object({ title: z.string(), body: z.string().default(""), sort_order: z.number().default(0) }))
    .default([]),
  audiences: textArray,
  delivery_formats: textArray,
  business_stages: textArray,
  cta_text: z.string().optional().nullable(),
  cta_url: optionalUrl,
  seo_title: z.string().max(70).optional().nullable(),
  seo_description: z.string().max(180).optional().nullable(),
  featured: z.boolean().default(false),
  sort_order: z.number().int().default(0),
  status: contentStatus.default("draft"),
});

// ── showcase clients ───────────────────────────────────────
export const showcaseClientSchema = z.object({
  industry_id: z.string().uuid().nullable().optional(),
  business_name: z.string().min(1, "Please enter the business name."),
  name: z.string().optional().nullable(),
  slug: slug.optional(),
  role: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  website_url: optionalUrl,
  logo_url: optionalUrl,
  photo_url: optionalUrl,
  public_bio: z.string().optional().nullable(),
  permission_to_publish: z.boolean().default(false),
  featured: z.boolean().default(false),
  status: showcaseClientStatus.default("active"),
});

// ── projects ───────────────────────────────────────────────
export const projectSchema = z.object({
  showcase_client_id: z.string().uuid({ message: "Please choose the client this project belongs to." }),
  industry_id: z.string().uuid().nullable().optional(),
  project_type_id: z.string().uuid().nullable().optional(),
  title: z.string().min(1, "Please add a project title before saving."),
  slug,
  project_summary: z.string().optional().nullable(),
  challenge: z.string().optional().nullable(),
  approach: z.string().optional().nullable(),
  solution: z.string().optional().nullable(),
  outcome_summary: z.string().optional().nullable(),
  website_url: optionalUrl,
  launch_date: z.string().optional().nullable(),
  hero_image_url: optionalUrl,
  gallery: imageArray,
  before_images: imageArray,
  after_images: imageArray,
  business_stage: z.string().optional().nullable(),
  seo_title: z.string().max(70).optional().nullable(),
  seo_description: z.string().max(180).optional().nullable(),
  featured: z.boolean().default(false),
  show_in_portfolio: z.boolean().default(true),
  case_study_enabled: z.boolean().default(false),
  sort_order: z.number().int().default(0),
  status: contentStatus.default("draft"),
});

// ── project results ────────────────────────────────────────
export const projectResultSchema = z
  .object({
    result_type_id: z.string().uuid().nullable().optional(),
    title: z.string().min(1, "Please add a result title."),
    description: z.string().optional().nullable(),
    result_kind: resultKind,
    metric_name: z.string().optional().nullable(),
    metric_value: z.number().nullable().optional(),
    metric_unit: z.string().optional().nullable(),
    display_value: z.string().optional().nullable(),
    time_period: z.string().optional().nullable(),
    comparison_period: z.string().optional().nullable(),
    supporting_note: z.string().optional().nullable(),
    verified: z.boolean().default(false),
    featured: z.boolean().default(false),
    sort_order: z.number().int().default(0),
  })
  .refine((r) => r.result_kind !== "quantitative" || r.metric_value != null, {
    message: "Measurable results need a number.",
    path: ["metric_value"],
  });

// ── testimonials ───────────────────────────────────────────
export const testimonialSchema = z.object({
  showcase_client_id: z.string().uuid({ message: "Please choose the client who gave this testimonial." }),
  project_id: z.string().uuid().nullable().optional(),
  testimonial_type_id: z.string().uuid().nullable().optional(),
  quote: z.string().min(1, "Please paste the client's words before saving."),
  short_quote: z.string().optional().nullable(),
  client_name_override: z.string().optional().nullable(),
  client_role_override: z.string().optional().nullable(),
  business_name_override: z.string().optional().nullable(),
  client_photo_override_url: optionalUrl,
  business_logo_override_url: optionalUrl,
  rating: z.number().min(1, "Ratings go from 1 to 5.").max(5, "Ratings go from 1 to 5.").nullable().optional(),
  video_url: optionalUrl,
  audio_url: optionalUrl,
  source_name: z.string().optional().nullable(),
  source_url: optionalUrl,
  permission_confirmed: z.boolean().default(false),
  testimonial_date: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  sort_order: z.number().int().default(0),
  status: contentStatus.default("draft"),
});

export type ServiceInput = z.infer<typeof serviceSchema>;
export type ShowcaseClientInput = z.infer<typeof showcaseClientSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type ProjectResultInput = z.infer<typeof projectResultSchema>;
export type TestimonialInput = z.infer<typeof testimonialSchema>;

/** Options shown in the friendly admin selects. */
export const AUDIENCE_OPTIONS = [
  "Health practitioner",
  "Wellness brand",
  "Consultant",
  "Coach",
  "Service business",
  "Product-based wellness business",
];
export const DELIVERY_FORMAT_OPTIONS = [
  "Done for you",
  "Strategy session",
  "Done in a day",
  "Photography session",
  "Ongoing support",
];
export const BUSINESS_STAGE_OPTIONS = [
  "Starting a new business",
  "Growing an established business",
  "Rebranding",
  "Launching a new offer",
  "Improving an existing website",
];
export const METRIC_UNIT_OPTIONS = ["percent", "hours", "enquiries", "sales", "dollars", "bookings", "visitors"];

/**
 * Reasons a project cannot be published yet (server-enforced list).
 * `serviceCount` is passed in because it needs a related-row count.
 */
export function projectPublishBlockers(
  p: { title?: string; slug?: string; showcase_client_id?: string | null },
  client: { status?: string; permission_to_publish?: boolean } | null,
  serviceCount: number,
): string[] {
  const out: string[] = [];
  if (!p.title?.trim()) out.push("Add a project title.");
  if (!p.slug?.trim()) out.push("Add a page address.");
  if (!p.showcase_client_id) out.push("Choose the client this project belongs to.");
  if (!client) out.push("The chosen client could not be found.");
  else {
    if (client.status === "confidential") out.push("This client is marked confidential and cannot appear publicly.");
    if (!client.permission_to_publish) out.push("The client has not yet given permission to publish.");
  }
  if (serviceCount === 0) out.push("Link at least one service to this project.");
  return out;
}

/** Reasons a testimonial cannot be published yet. */
export function testimonialPublishBlockers(
  t: { quote?: string; showcase_client_id?: string | null; permission_confirmed?: boolean },
  client: { status?: string; permission_to_publish?: boolean } | null,
): string[] {
  const out: string[] = [];
  if (!t.quote?.trim()) out.push("Add the testimonial text.");
  if (!t.showcase_client_id) out.push("Choose the client who gave this testimonial.");
  if (!t.permission_confirmed) out.push("Confirm the client's permission before publishing.");
  if (client?.status === "confidential") out.push("This client is confidential and cannot appear publicly.");
  if (client && !client.permission_to_publish) out.push("The client has not given permission to publish.");
  return out;
}
