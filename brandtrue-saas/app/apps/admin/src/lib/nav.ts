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
}

/** Site-scoped sections. Omitted `roles` means every role sees it. */
export const siteNav: NavItem[] = [
  { label: "Dashboard", href: (s) => `/sites/${s}`, match: "" },
  { label: "Pages", href: (s) => `/sites/${s}/pages`, match: "pages" },
  { label: "Enquiries", href: (s) => `/sites/${s}/leads`, match: "leads" },
  { label: "Contacts", href: (s) => `/sites/${s}/contacts`, match: "contacts" },
  { label: "Customers", href: (s) => `/sites/${s}/customers`, match: "customers" },
  { label: "Forms", href: (s) => `/sites/${s}/forms`, match: "forms" },
  { label: "Databases", href: (s) => `/sites/${s}/collections`, match: "collections" },
  {
    label: "Publish",
    href: (s) => `/sites/${s}/publish`,
    match: "publish",
    roles: ["super_admin", "agency_developer", "designer"],
  },
];

export function visibleNav(role: Role | undefined | null): NavItem[] {
  return siteNav.filter((item) => !item.roles || (role && item.roles.includes(role)));
}
