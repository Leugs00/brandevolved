export type Role = "super_admin" | "agency_developer" | "designer" | "client";

export const isAgency = (role: Role | undefined | null) =>
  role === "super_admin" || role === "agency_developer";

export const canEditStructure = (role: Role | undefined | null) =>
  isAgency(role) || role === "designer";

export interface NavItem {
  label: string;
  href: (siteId: string) => string;
  match: string;
  roles?: Role[];
  group?: string;
}

/** Site-scoped sections, grouped. Omitted `roles` means every role sees it. */
export const siteNav: NavItem[] = [
  { label: "Dashboard", href: (s) => `/sites/${s}`, match: "" },
  { label: "Pages", href: (s) => `/sites/${s}/pages`, match: "pages" },

  { group: "Portfolio", label: "Projects", href: (s) => `/sites/${s}/projects`, match: "projects" },
  { group: "Portfolio", label: "Services", href: (s) => `/sites/${s}/services`, match: "services" },
  { group: "Portfolio", label: "Testimonials", href: (s) => `/sites/${s}/testimonials`, match: "testimonials" },
  { group: "Portfolio", label: "Clients", href: (s) => `/sites/${s}/clients`, match: "clients" },

  { group: "Enquiries & CRM", label: "Enquiries", href: (s) => `/sites/${s}/leads`, match: "leads" },
  { group: "Enquiries & CRM", label: "Contacts", href: (s) => `/sites/${s}/contacts`, match: "contacts" },
  { group: "Enquiries & CRM", label: "Customers", href: (s) => `/sites/${s}/customers`, match: "customers" },
  { group: "Enquiries & CRM", label: "Forms", href: (s) => `/sites/${s}/forms`, match: "forms" },

  {
    group: "Categories & filters",
    label: "Service categories",
    href: (s) => `/sites/${s}/categories/service-categories`,
    match: "cat:service-categories",
  },
  { group: "Categories & filters", label: "Industries", href: (s) => `/sites/${s}/categories/industries`, match: "cat:industries" },
  { group: "Categories & filters", label: "Project types", href: (s) => `/sites/${s}/categories/project-types`, match: "cat:project-types" },
  { group: "Categories & filters", label: "Result types", href: (s) => `/sites/${s}/categories/result-types`, match: "cat:result-types" },
  { group: "Categories & filters", label: "Testimonial types", href: (s) => `/sites/${s}/categories/testimonial-types`, match: "cat:testimonial-types" },

  { group: "Advanced", label: "Databases", href: (s) => `/sites/${s}/collections`, match: "collections", roles: ["super_admin", "agency_developer", "designer"] },
  {
    group: "Advanced",
    label: "Publish",
    href: (s) => `/sites/${s}/publish`,
    match: "publish",
    roles: ["super_admin", "agency_developer", "designer"],
  },
];

export function visibleNav(role: Role | undefined | null): NavItem[] {
  return siteNav.filter((item) => !item.roles || (role && item.roles.includes(role)));
}

/** Ordered groups for sidebar rendering. Ungrouped items render first. */
export function groupedNav(role: Role | undefined | null): { group: string | null; items: NavItem[] }[] {
  const items = visibleNav(role);
  const order: (string | null)[] = [null, "Portfolio", "Enquiries & CRM", "Categories & filters", "Advanced"];
  return order
    .map((group) => ({ group, items: items.filter((i) => (i.group ?? null) === group) }))
    .filter((g) => g.items.length > 0);
}
