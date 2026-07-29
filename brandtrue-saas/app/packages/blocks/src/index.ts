export { blockDefs, blockKinds, validateBlockData } from "@brandevolved/shared/blocks";

export interface FormFieldSpec {
  name: string;
  label: string;
  type: string;
  required?: boolean;
}

export interface RenderForm {
  id: string;
  slug: string;
  name: string;
  fields: FormFieldSpec[];
  success_message: string;
  honeypot_enabled: boolean;
}

export interface RenderCollection {
  id: string;
  slug: string;
  name: string;
  kind: string;
  items: Record<string, unknown>[];
}

/**
 * Everything a block component may need besides its own data.
 * Built once per page render by the site engine (from published content)
 * or by the admin preview (from draft content).
 */
/** A published project, flattened for public rendering (from public_projects). */
export interface RenderProject {
  id: string;
  slug: string;
  title: string;
  project_summary: string | null;
  hero_image_url: string | null;
  featured: boolean;
  show_in_portfolio: boolean;
  case_study_enabled: boolean;
  business_name: string | null;
  industry_slug: string | null;
  industry_name: string | null;
  project_type_slug: string | null;
  project_type_name: string | null;
  service_slugs: string[];
  result_type_slugs: string[];
}

/** A published testimonial, resolved for public rendering (from public_testimonials). */
export interface RenderTestimonial {
  id: string;
  quote: string;
  short_quote: string | null;
  display_name: string | null;
  display_role: string | null;
  display_business: string | null;
  display_photo: string | null;
  client_location: string | null;
  client_website: string | null;
  rating: number | null;
  featured: boolean;
  service_slugs: string[];
}

export interface RenderContext {
  siteId: string;
  supabaseUrl: string;
  anonKey: string;
  collections: Record<string, RenderCollection>;
  forms: Record<string, RenderForm>;
  /** published projects for portfolio / project-list blocks (optional) */
  projects?: RenderProject[];
  /** published testimonials for testimonial blocks (optional) */
  testimonials?: RenderTestimonial[];
  /** true inside the admin visual editor — adds data-* hooks, disables scripts */
  editable?: boolean;
}

/** Filter published projects by a project_list block's optional filters. */
export function filterProjects(
  projects: RenderProject[],
  opts: { service?: string; industry?: string; type?: string; result?: string; featured?: boolean; portfolioOnly?: boolean },
): RenderProject[] {
  return projects.filter((p) => {
    if (opts.portfolioOnly && !p.show_in_portfolio) return false;
    if (opts.featured && !p.featured) return false;
    if (opts.service && !p.service_slugs.includes(opts.service)) return false;
    if (opts.result && !p.result_type_slugs.includes(opts.result)) return false;
    if (opts.industry && p.industry_slug !== opts.industry) return false;
    if (opts.type && p.project_type_slug !== opts.type) return false;
    return true;
  });
}

/** Filter items by a block's filter_field/filter_value (array includes, scalar equals). */
export function filterItems(
  items: Record<string, unknown>[],
  field?: unknown,
  value?: unknown,
): Record<string, unknown>[] {
  const f = String(field ?? "").trim();
  const v = String(value ?? "").trim().toLowerCase();
  if (!f || !v) return items;
  return items.filter((item) => {
    const cell = item[f];
    if (Array.isArray(cell)) return cell.some((x) => String(x).toLowerCase() === v);
    return String(cell ?? "").toLowerCase() === v;
  });
}

export interface RenderBlock {
  id: string;
  kind: string;
  data: Record<string, unknown>;
  locked: boolean;
  position: number;
}
