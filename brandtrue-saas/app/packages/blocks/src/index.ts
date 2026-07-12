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
export interface RenderContext {
  siteId: string;
  supabaseUrl: string;
  anonKey: string;
  collections: Record<string, RenderCollection>;
  forms: Record<string, RenderForm>;
  /** true inside the admin visual editor — adds data-* hooks, disables scripts */
  editable?: boolean;
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
