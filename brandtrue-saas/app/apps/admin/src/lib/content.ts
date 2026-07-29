import type { Db } from "@brandevolved/shared/supabase";

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface Lookups {
  serviceCategories: { id: string; name: string }[];
  industries: { id: string; name: string }[];
  projectTypes: { id: string; name: string }[];
  resultTypes: { id: string; name: string }[];
  testimonialTypes: { id: string; name: string }[];
  services: { id: string; name: string; category_name: string | null }[];
  clients: { id: string; business_name: string; status: string; permission_to_publish: boolean }[];
}

/** Loads all the option lists the content editors need, in one place. */
export async function loadLookups(db: Db, siteId: string): Promise<Lookups> {
  const [cats, inds, ptypes, rtypes, ttypes, svcs, clients] = await Promise.all([
    db.from("service_categories").select("id, name").eq("site_id", siteId).order("sort_order"),
    db.from("industries").select("id, name").eq("site_id", siteId).order("sort_order"),
    db.from("project_types").select("id, name").eq("site_id", siteId).order("sort_order"),
    db.from("result_types").select("id, name").eq("site_id", siteId).order("sort_order"),
    db.from("testimonial_types").select("id, name").eq("site_id", siteId).order("sort_order"),
    db.from("services").select("id, name, service_categories(name)").eq("site_id", siteId).order("sort_order"),
    db.from("showcase_clients").select("id, business_name, status, permission_to_publish").eq("site_id", siteId).order("business_name"),
  ]);
  return {
    serviceCategories: cats.data ?? [],
    industries: inds.data ?? [],
    projectTypes: ptypes.data ?? [],
    resultTypes: rtypes.data ?? [],
    testimonialTypes: ttypes.data ?? [],
    services: (svcs.data ?? []).map((s: any) => ({
      id: s.id,
      name: s.name,
      category_name: (s.service_categories as { name: string } | null)?.name ?? null,
    })),
    clients: clients.data ?? [],
  };
}

export const statusStyle: Record<string, string> = {
  draft: "bg-slate-100 text-slate-600",
  published: "bg-emerald-100 text-emerald-700",
  archived: "bg-amber-100 text-amber-700",
  active: "bg-emerald-100 text-emerald-700",
  past: "bg-slate-100 text-slate-600",
  confidential: "bg-red-100 text-red-700",
};

/** Config for the 5 generic lookup ("category") management pages. */
export const CATEGORY_TYPES: Record<
  string,
  { table: string; title: string; intro: string; match: string; hasStatus?: boolean }
> = {
  "service-categories": {
    table: "service_categories",
    title: "Service categories",
    intro: "High-level groups for your services, such as Brand, Website or Photography.",
    match: "cat:service-categories",
    hasStatus: true,
  },
  industries: {
    table: "industries",
    title: "Industries",
    intro: "The business types you work with. Visitors can filter projects and testimonials by these.",
    match: "cat:industries",
  },
  "project-types": {
    table: "project_types",
    title: "Project types",
    intro: "The kinds of work you do, such as Website, Brand Identity or Photography.",
    match: "cat:project-types",
  },
  "result-types": {
    table: "result_types",
    title: "Result types",
    intro: "The kinds of outcomes your projects deliver, such as More Enquiries or Brand Clarity.",
    match: "cat:result-types",
  },
  "testimonial-types": {
    table: "testimonial_types",
    title: "Testimonial types",
    intro: "Where testimonials come from, such as Written, Video or Google review.",
    match: "cat:testimonial-types",
  },
};
