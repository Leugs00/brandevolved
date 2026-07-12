import { z } from "zod";

/**
 * The block library. Every content_blocks.kind maps to one entry here.
 * `fields` drives BOTH the visual editor (inline editing + side panel)
 * and validation on save. Renderers live in @brandevolved/blocks.
 */

export type FieldType =
  | "text" // single line, inline-editable
  | "richtext" // html, inline-editable
  | "image" // { src, alt } editable via click-to-replace
  | "url"
  | "select"
  | "checkboxes" // multi-select; options static or from another database
  | "number"
  | "list"; // repeatable group of sub-fields

export interface FieldDef {
  type: FieldType;
  label: string;
  /** explainer shown under the label in every editor */
  help?: string;
  /** for select / checkboxes */
  options?: string[];
  /** for select / checkboxes: options are item titles from this database (collection slug) */
  options_from?: string;
  /** for list: the shape of each item */
  item?: Record<string, FieldDef>;
  default?: unknown;
}

export interface BlockDef {
  kind: string;
  label: string;
  description: string;
  fields: Record<string, FieldDef>;
  /** zod schema for the block's data payload */
  schema: z.ZodTypeAny;
  /** starter data when the block is added in the editor */
  defaults: Record<string, unknown>;
}

const image = z
  .object({ src: z.string().default(""), alt: z.string().default("") })
  .default({ src: "", alt: "" });

export const blockDefs: Record<string, BlockDef> = {
  text: {
    kind: "text",
    label: "Rich text",
    description: "Free-form text content",
    fields: { html: { type: "richtext", label: "Content", help: "The text of this section. You can also edit it directly on the page preview." } },
    schema: z.object({ html: z.string().default("") }).passthrough(),
    defaults: { html: "<p>Write something…</p>" },
  },
  hero: {
    kind: "hero",
    label: "Hero",
    description: "Large heading with optional image and button",
    fields: {
      heading: { type: "text", label: "Heading", help: "The big headline — the first thing visitors read." },
      subheading: { type: "text", label: "Subheading", help: "One supporting sentence under the headline." },
      image: { type: "image", label: "Background image", help: "Optional photo behind the headline; a dark overlay keeps text readable." },
      cta_label: { type: "text", label: "Button label", help: "Text on the button, e.g. Book a free call. Leave empty for no button." },
      cta_href: { type: "url", label: "Button link", help: "Where the button goes — a page path like /contact or a full https:// link." },
      align: { type: "select", label: "Alignment", options: ["left", "center"], help: "How the text sits in the banner." },
    },
    schema: z
      .object({
        heading: z.string().default(""),
        subheading: z.string().default(""),
        image,
        cta_label: z.string().default(""),
        cta_href: z.string().default(""),
        align: z.enum(["left", "center"]).default("center"),
      })
      .passthrough(),
    defaults: { heading: "Your headline", subheading: "", align: "center" },
  },
  image: {
    kind: "image",
    label: "Image",
    description: "A single image with optional caption",
    fields: {
      image: { type: "image", label: "Image", help: "The picture to show. Upload replaces it everywhere this block appears." },
      caption: { type: "text", label: "Caption", help: "Optional small text under the image." },
    },
    schema: z
      .object({ image, caption: z.string().default("") })
      .passthrough(),
    defaults: { caption: "" },
  },
  gallery: {
    kind: "gallery",
    label: "Gallery",
    description: "A grid of images",
    fields: {
      heading: { type: "text", label: "Heading" },
      images: {
        type: "list",
        label: "Images",
        item: {
          image: { type: "image", label: "Image" },
          caption: { type: "text", label: "Caption" },
        },
      },
    },
    schema: z
      .object({
        heading: z.string().default(""),
        images: z.array(z.object({ image, caption: z.string().default("") })).default([]),
      })
      .passthrough(),
    defaults: { heading: "", images: [] },
  },
  features: {
    kind: "features",
    label: "Features",
    description: "Icon / title / text columns",
    fields: {
      heading: { type: "text", label: "Heading" },
      items: {
        type: "list",
        label: "Features",
        item: {
          title: { type: "text", label: "Title" },
          body: { type: "text", label: "Text" },
        },
      },
    },
    schema: z
      .object({
        heading: z.string().default(""),
        items: z
          .array(z.object({ title: z.string().default(""), body: z.string().default("") }))
          .default([]),
      })
      .passthrough(),
    defaults: {
      heading: "Why choose us",
      items: [{ title: "Feature one", body: "Describe it here." }],
    },
  },
  cta: {
    kind: "cta",
    label: "Call to action",
    description: "Banner with a button",
    fields: {
      heading: { type: "text", label: "Heading", help: "The call-to-action headline, e.g. Ready to get started?" },
      body: { type: "text", label: "Text", help: "Optional supporting sentence." },
      button_label: { type: "text", label: "Button label", help: "Text on the button." },
      button_href: { type: "url", label: "Button link", help: "Where the button goes — e.g. /contact." },
    },
    schema: z
      .object({
        heading: z.string().default(""),
        body: z.string().default(""),
        button_label: z.string().default(""),
        button_href: z.string().default(""),
      })
      .passthrough(),
    defaults: { heading: "Ready to get started?", button_label: "Contact us", button_href: "/contact" },
  },
  collection_list: {
    kind: "collection_list",
    label: "Database items",
    description: "Shows items from a database (portfolio, products, services…). Edit the items themselves in Databases.",
    fields: {
      heading: { type: "text", label: "Heading", help: "Optional title shown above the items." },
      collection_slug: { type: "text", label: "Database slug", help: "Which database to show — its slug is listed on the Databases page (e.g. portfolio)." },
      layout: { type: "select", label: "Layout", options: ["grid", "list"], help: "Grid of cards or a vertical list." },
      limit: { type: "number", label: "Max items", help: "Show at most this many items." },
      filter_field: { type: "text", label: "Filter by field", help: "Optional: only show items where this field matches. E.g. services." },
      filter_value: { type: "text", label: "Filter value", help: "The value the field must include. E.g. Brand Photography." },
    },
    schema: z
      .object({
        heading: z.string().default(""),
        collection_slug: z.string().default(""),
        layout: z.enum(["grid", "list"]).default("grid"),
        limit: z.number().int().positive().max(100).default(12),
        filter_field: z.string().default(""),
        filter_value: z.string().default(""),
      })
      .passthrough(),
    defaults: { heading: "", collection_slug: "", layout: "grid", limit: 12, filter_field: "", filter_value: "" },
  },
  form_embed: {
    kind: "form_embed",
    label: "Form",
    description: "Embed a form (contact, subscribe…)",
    fields: {
      heading: { type: "text", label: "Heading", help: "Title shown above the form." },
      form_slug: { type: "text", label: "Form slug", help: "Which form to show — set up forms and their fields on the Forms page." },
    },
    schema: z
      .object({ heading: z.string().default(""), form_slug: z.string().default("") })
      .passthrough(),
    defaults: { heading: "Get in touch", form_slug: "contact" },
  },
  faq: {
    kind: "faq",
    label: "FAQ",
    description: "Questions and answers",
    fields: {
      heading: { type: "text", label: "Heading" },
      items: {
        type: "list",
        label: "Questions",
        item: {
          question: { type: "text", label: "Question" },
          answer: { type: "richtext", label: "Answer" },
        },
      },
    },
    schema: z
      .object({
        heading: z.string().default("FAQ"),
        items: z
          .array(z.object({ question: z.string().default(""), answer: z.string().default("") }))
          .default([]),
      })
      .passthrough(),
    defaults: { heading: "FAQ", items: [] },
  },
  testimonial_strip: {
    kind: "testimonial_strip",
    label: "Testimonials",
    description: "Quotes pulled from the Testimonials database. Add or edit testimonials in Databases → Testimonials.",
    fields: {
      heading: { type: "text", label: "Heading", help: "Optional title shown above the quotes." },
      collection_slug: { type: "text", label: "Database slug", help: "Usually testimonials — the database the quotes come from." },
      limit: { type: "number", label: "Max items", help: "Show at most this many testimonials." },
      filter_field: { type: "text", label: "Filter by field", help: "Optional: only show testimonials where this field matches. E.g. services or industry." },
      filter_value: { type: "text", label: "Filter value", help: "The value to match. E.g. Brand Photography — shows only clients who used that service." },
    },
    schema: z
      .object({
        heading: z.string().default(""),
        collection_slug: z.string().default("testimonials"),
        limit: z.number().int().positive().max(50).default(6),
        filter_field: z.string().default(""),
        filter_value: z.string().default(""),
      })
      .passthrough(),
    defaults: { heading: "What clients say", collection_slug: "testimonials", limit: 6, filter_field: "", filter_value: "" },
  },
};

export const blockKinds = Object.keys(blockDefs);

export function validateBlockData(kind: string, data: unknown) {
  const def = blockDefs[kind];
  if (!def) return { success: false as const, error: `Unknown block kind: ${kind}` };
  const parsed = def.schema.safeParse(data ?? {});
  if (!parsed.success) return { success: false as const, error: parsed.error.message };
  return { success: true as const, data: parsed.data as Record<string, unknown> };
}
