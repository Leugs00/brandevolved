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
  project_list: {
    kind: "project_list",
    label: "Portfolio / projects",
    description: "Shows your published projects (portfolio, our work, case studies). Edit projects in the Projects section.",
    fields: {
      heading: { type: "text", label: "Heading", help: "Optional title shown above the projects." },
      intro: { type: "text", label: "Intro text", help: "Optional sentence under the heading." },
      layout: { type: "select", label: "Layout", options: ["grid", "list"], help: "Grid of cards or a vertical list." },
      limit: { type: "number", label: "Max projects", help: "Show at most this many." },
      featured_only: { type: "select", label: "Featured only?", options: ["no", "yes"], help: "Yes = only featured projects (e.g. for a homepage)." },
      filter_service: { type: "text", label: "Only this service (slug)", help: "Optional — e.g. website-design. Shows only projects that used it." },
      filter_industry: { type: "text", label: "Only this industry (slug)", help: "Optional — e.g. health-and-wellness." },
      filter_type: { type: "text", label: "Only this project type (slug)", help: "Optional — e.g. website-and-brand." },
    },
    schema: z
      .object({
        heading: z.string().default(""),
        intro: z.string().default(""),
        layout: z.enum(["grid", "list"]).default("grid"),
        limit: z.number().int().positive().max(60).default(12),
        featured_only: z.enum(["no", "yes"]).default("no"),
        filter_service: z.string().default(""),
        filter_industry: z.string().default(""),
        filter_type: z.string().default(""),
      })
      .passthrough(),
    defaults: { heading: "Our work", layout: "grid", limit: 12, featured_only: "no", filter_service: "", filter_industry: "", filter_type: "" },
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
      cta_label: { type: "text", label: "Link label", help: "Optional link under the questions, e.g. See all FAQs." },
      cta_href: { type: "url", label: "Link target", help: "Where the link goes — e.g. /faq." },
    },
    schema: z
      .object({
        heading: z.string().default("FAQ"),
        items: z
          .array(z.object({ question: z.string().default(""), answer: z.string().default("") }))
          .default([]),
        cta_label: z.string().default(""),
        cta_href: z.string().default(""),
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
  split_hero: {
    kind: "split_hero",
    label: "Split hero",
    description: "Homepage hero: headline + script accent + button on the left, large photo on the right, watercolor wash behind.",
    fields: {
      heading: { type: "text", label: "Headline", help: "The big opening line of the page." },
      script_line: { type: "text", label: "Script accent", help: "Short handwritten-style line under the headline, e.g. real. authentic. you." },
      body: { type: "text", label: "Supporting text", help: "One or two sentences under the accent line." },
      cta_label: { type: "text", label: "Button label", help: "Text on the gold button. Leave empty for no button." },
      cta_href: { type: "url", label: "Button link", help: "Where the button goes — e.g. /book." },
      image: { type: "image", label: "Photo", help: "The full-width photo behind the hero; the watercolor wash overlays its left side." },
      wash_image: { type: "image", label: "Watercolor overlay", help: "Texture laid over the photo behind the text, fading out to the right." },
      arrow_image: { type: "image", label: "Arrow image", help: "Optional hand-drawn arrow shown beside the button." },
    },
    schema: z
      .object({
        heading: z.string().default(""),
        script_line: z.string().default(""),
        body: z.string().default(""),
        cta_label: z.string().default(""),
        cta_href: z.string().default(""),
        image,
        wash_image: image,
        arrow_image: image,
      })
      .passthrough(),
    defaults: { heading: "Your headline", script_line: "", body: "", cta_label: "", cta_href: "" },
  },
  intro_split: {
    kind: "intro_split",
    label: "Text + photo split",
    description: "Eyebrow, heading, paragraphs and optional buttons beside a large photo. Used for intros, bios and service pitches.",
    fields: {
      eyebrow: { type: "text", label: "Eyebrow", help: "Tiny uppercase label above the heading, e.g. WHAT WE DO." },
      heading: { type: "text", label: "Heading", help: "The section heading. Line breaks are kept." },
      body: { type: "text", label: "Paragraphs", help: "The section text. Leave an empty line between paragraphs." },
      script_line: { type: "text", label: "Script accent", help: "Optional handwritten-style line after the text, e.g. Real. Warm. Human." },
      image: { type: "image", label: "Photo", help: "The image beside the text." },
      image_side: { type: "select", label: "Photo side", options: ["right", "left"], help: "Which side the photo sits on (desktop)." },
      image_position: { type: "text", label: "Photo focus point", help: "Which part of the photo stays visible when it's cropped — e.g. right top, center, left bottom. Leave empty for center." },
      image_style: { type: "select", label: "Photo style", options: ["full", "framed"], help: "Full = photo fills its half edge-to-edge. Framed = smaller polaroid-style photo with a white border." },
      background: { type: "select", label: "Background", options: ["cream", "white"], help: "Section background colour." },
      cta_label: { type: "text", label: "Button label", help: "Optional gold button text." },
      cta_href: { type: "url", label: "Button link", help: "Where the gold button goes." },
      arrow_image: { type: "image", label: "Arrow image", help: "Optional hand-drawn arrow shown beside the button." },
      wash_image: { type: "image", label: "Watercolor behind text", help: "Optional watercolor texture shown softly behind the text column." },
      cta2_label: { type: "text", label: "Second button label", help: "Optional outlined button text." },
      cta2_href: { type: "url", label: "Second button link", help: "Where the outlined button goes." },
    },
    schema: z
      .object({
        eyebrow: z.string().default(""),
        heading: z.string().default(""),
        body: z.string().default(""),
        script_line: z.string().default(""),
        image,
        image_side: z.enum(["right", "left"]).default("right"),
        image_position: z.string().default(""),
        image_style: z.enum(["full", "framed"]).default("full"),
        background: z.enum(["cream", "white"]).default("cream"),
        cta_label: z.string().default(""),
        cta_href: z.string().default(""),
        arrow_image: image,
        wash_image: image,
        cta2_label: z.string().default(""),
        cta2_href: z.string().default(""),
      })
      .passthrough(),
    defaults: { eyebrow: "", heading: "Section heading", body: "", image_side: "right", background: "cream" },
  },
  icon_columns: {
    kind: "icon_columns",
    label: "Icon columns",
    description: "Centered heading with icon + title + text columns. Used for pain points, benefit grids and 'we bridge the gap' sections.",
    fields: {
      script_line: { type: "text", label: "Script accent", help: "Optional handwritten-style line above everything." },
      eyebrow: { type: "text", label: "Eyebrow", help: "Tiny uppercase label above the heading." },
      heading: { type: "text", label: "Heading", help: "The section heading, centered." },
      heading_tone: { type: "select", label: "Heading colour", options: ["primary", "accent"], help: "Teal (primary) or gold (accent) heading." },
      intro: { type: "text", label: "Intro text", help: "Optional paragraph under the heading." },
      bridge_text: { type: "text", label: "Statement line", help: "Optional bold uppercase line, e.g. WE BRIDGE THAT GAP." },
      items: {
        type: "list",
        label: "Columns",
        help: "Each column: an icon, a short title and optional text.",
        item: {
          icon: { type: "image", label: "Icon", help: "Small illustration for this point." },
          title: { type: "text", label: "Title", help: "Short heading for this point." },
          body: { type: "text", label: "Text", help: "Optional supporting text." },
        },
      },
      style: { type: "select", label: "Background style", options: ["plain", "mint", "watercolor", "dark"], help: "Plain white, soft cream, a watercolor wash image, or dark teal with light text." },
      wash_image: { type: "image", label: "Background image", help: "Used when style is watercolor or dark." },
      dividers: { type: "select", label: "Gold lines between columns?", options: ["no", "yes"], help: "Yes = a thin gold vertical line separates the columns." },
    },
    schema: z
      .object({
        script_line: z.string().default(""),
        eyebrow: z.string().default(""),
        heading: z.string().default(""),
        heading_tone: z.enum(["primary", "accent"]).default("primary"),
        intro: z.string().default(""),
        bridge_text: z.string().default(""),
        items: z
          .array(z.object({ icon: image, title: z.string().default(""), body: z.string().default("") }))
          .default([]),
        style: z.enum(["plain", "mint", "watercolor", "dark"]).default("plain"),
        wash_image: image,
        dividers: z.enum(["no", "yes"]).default("no"),
      })
      .passthrough(),
    defaults: { heading: "Section heading", style: "plain", items: [] },
  },
  process_steps: {
    kind: "process_steps",
    label: "Process steps",
    description: "Numbered steps with a connecting line that draws itself as visitors scroll.",
    fields: {
      eyebrow: { type: "text", label: "Eyebrow", help: "Tiny uppercase label above the heading." },
      heading: { type: "text", label: "Heading", help: "E.g. Four steps to a brand you're proud of." },
      intro: { type: "text", label: "Intro text", help: "Optional paragraph under the heading." },
      steps: {
        type: "list",
        label: "Steps",
        help: "Each step gets a number automatically.",
        item: {
          title: { type: "text", label: "Title", help: "Short step name, e.g. Book a consult." },
          body: { type: "text", label: "Text", help: "What happens in this step." },
        },
      },
    },
    schema: z
      .object({
        eyebrow: z.string().default(""),
        heading: z.string().default(""),
        intro: z.string().default(""),
        steps: z
          .array(z.object({ title: z.string().default(""), body: z.string().default("") }))
          .default([]),
      })
      .passthrough(),
    defaults: { heading: "How it works", steps: [{ title: "Step one", body: "Describe it here." }] },
  },
  testimonial_carousel: {
    kind: "testimonial_carousel",
    label: "Testimonial carousel",
    description: "Swipeable cards with stars, a bold headline quote and the full quote. Pulls from the Testimonials section (published + permission confirmed).",
    fields: {
      heading: { type: "text", label: "Heading", help: "E.g. Real Impact. Real Results." },
      intro: { type: "text", label: "Intro text", help: "Optional sentence under the heading." },
      limit: { type: "number", label: "Max testimonials", help: "Show at most this many cards." },
      featured_only: { type: "select", label: "Featured only?", options: ["no", "yes"], help: "Yes = only testimonials marked featured." },
      quote_icon: { type: "image", label: "Quote mark image", help: "Optional decorative quote-mark image on each card." },
      cta_label: { type: "text", label: "Link label", help: "Optional link under the carousel, e.g. Read all client stories." },
      cta_href: { type: "url", label: "Link target", help: "Where the link goes — e.g. /testimonials." },
    },
    schema: z
      .object({
        heading: z.string().default(""),
        intro: z.string().default(""),
        limit: z.number().int().positive().max(50).default(12),
        featured_only: z.enum(["no", "yes"]).default("no"),
        quote_icon: image,
        cta_label: z.string().default(""),
        cta_href: z.string().default(""),
      })
      .passthrough(),
    defaults: { heading: "What clients say", limit: 12, featured_only: "no" },
  },
  service_cards: {
    kind: "service_cards",
    label: "Service cards",
    description: "Clickable cards with photo, title and text — e.g. One Team. Three Main Services.",
    fields: {
      eyebrow: { type: "text", label: "Eyebrow", help: "Tiny uppercase label above the heading." },
      heading: { type: "text", label: "Heading", help: "The section heading, centered." },
      intro: { type: "text", label: "Intro text", help: "Optional paragraph under the heading." },
      items: {
        type: "list",
        label: "Cards",
        help: "One card per service.",
        item: {
          image: { type: "image", label: "Photo", help: "Card image (real client work beats stock)." },
          title: { type: "text", label: "Title", help: "Service name." },
          body: { type: "text", label: "Text", help: "One-sentence pitch." },
          link_label: { type: "text", label: "Link label", help: "Defaults to Learn more." },
          href: { type: "url", label: "Link", help: "Where the card goes." },
        },
      },
      cta_label: { type: "text", label: "Button label", help: "Optional gold button under the cards." },
      cta_href: { type: "url", label: "Button link", help: "Where the gold button goes." },
      cta2_label: { type: "text", label: "Second button label", help: "Optional outlined button." },
      cta2_href: { type: "url", label: "Second button link", help: "Where it goes." },
    },
    schema: z
      .object({
        eyebrow: z.string().default(""),
        heading: z.string().default(""),
        intro: z.string().default(""),
        items: z
          .array(
            z.object({
              image,
              title: z.string().default(""),
              body: z.string().default(""),
              link_label: z.string().default(""),
              href: z.string().default(""),
            }),
          )
          .default([]),
        cta_label: z.string().default(""),
        cta_href: z.string().default(""),
        cta2_label: z.string().default(""),
        cta2_href: z.string().default(""),
      })
      .passthrough(),
    defaults: { heading: "Our services", items: [] },
  },
  cta_banner: {
    kind: "cta_banner",
    label: "Big call-to-action banner",
    description: "Full-width dark banner with a heading, a sentence and up to three buttons.",
    fields: {
      heading: { type: "text", label: "Heading", help: "The closing ask, e.g. Ready to look as credible online as you are in person?" },
      body: { type: "text", label: "Text", help: "One short supporting paragraph." },
      buttons: {
        type: "list",
        label: "Buttons",
        help: "First button is gold; the rest are outlined.",
        item: {
          label: { type: "text", label: "Label", help: "Button text." },
          href: { type: "url", label: "Link", help: "Where it goes." },
        },
      },
      bg_image: { type: "image", label: "Background image", help: "Optional dark textured background." },
    },
    schema: z
      .object({
        heading: z.string().default(""),
        body: z.string().default(""),
        buttons: z.array(z.object({ label: z.string().default(""), href: z.string().default("") })).default([]),
        bg_image: image,
      })
      .passthrough(),
    defaults: { heading: "Ready to get started?", buttons: [{ label: "Book a call", href: "/book" }] },
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
