# Lola Media — design & asset notes

Running notes so every future section stays consistent. Applies to the
`new-site` (Lola Media) build; reuse for other client sites via the same tokens.

## Script font (Ballomont)

- **Always `font-weight: 100 !important`.** Browsers synthesise a faux-bold on
  weights they don't have; Ballomont only ships Regular, so without the override
  it renders heavy and muddy. The `!important` turns faux-bold off.
- **Larger than you think.** Script is decorative — set it at ~2.2–2.9rem so it's
  legible, never body size.
- **Lowercase.** All script phrases render `text-transform: lowercase`. Write the
  copy naturally; the CSS lowercases it (e.g. "Real. Warm. Human." → "real. warm. human.").
- Defined once on the global `.lm-script` rule in `SiteFrame.astro`; per-block
  sizes only bump `font-size`.

## Images (every image, every page)

- **Format:** `.webp`, quality 84–88, `method=6`. Photos ~84, art/logos ~88.
- **Max dimension:** ~1600–2200px on the long edge (full-bleed backgrounds up to
  2200; cards/portraits ~1600). Never ship the raw 3000–4500px originals.
- **Keep alpha** (RGBA) for logos, watercolors, knocked-out device screens; flatten
  photos to RGB.
- **SEO/AEO filenames:** kebab-case, descriptive, brand + subject + context, no
  generic names. e.g. `lola-media-brand-design-style-guide-flatlay.webp`,
  `brand-photography-wellness-portrait-street.webp`. This is the alt-text-in-the-URL
  that helps image search and AI answer engines.
- **Alt text:** always set, describing the subject + who/where, not "image of…".
- Assets live in `apps/site-engine/public/assets/lola/home/` (served at
  `/assets/lola/home/…`). Uploading through the admin puts them in the
  `site-assets` bucket instead — either works.

## Device mockups (iPad/laptop screenshot carousels)

- Knock the **screen area to transparent** so the screenshot sits *behind* the
  device frame — the bezel then hides any overflow and it looks real. Overlaying a
  screenshot *on top* never lines up.
- Measure the screen rectangle as **percentages** of the photo and store them on
  the block (`screen_left/top/width/height`) so it scales at any width.
- Screenshot layer is sized a touch **larger** than the hole (overhang) and has
  **square corners** — the device's rounded glass provides the corners.

## Copy rules

- **No em-dashes (—). Ever, unless the client explicitly asks for one.** The
  client has repeatedly asked for these to be removed. Rewrite the sentence, use
  a comma, a full stop, or a spaced hyphen ( - ) instead. Applies to all copy on
  every page and to seeded content.

## Buttons

- **Primary buttons (gold `.lm-btn`) carry no arrow** unless a design explicitly
  calls for one (e.g. the hero's hand-drawn gold arrow beside "Let's make that
  happen"). Default = label only.
- **Secondary action** = text label + arrow using `.lm-rise` / `.lm-secondary`:
  no underline at rest; on hover the label underlines and the label + arrow rise
  together. The arrow is **gold** (`var(--c-accent)`), never teal.

## Colour / interaction

- Primary teal `#008378`, deep teal `#0a5c52`, gold accent `#b79762`, cream `#f8f3ec`.
- Cards (services, testimonials) **lift + deepen shadow on hover** — the quiet
  "this is clickable" cue.
- Secondary CTAs that aren't the main action are **text-links**, not filled/outlined
  buttons — they gain a shadow and lift on hover rather than a solid colour.
- Motion is CSS + IntersectionObserver, always gated by `prefers-reduced-motion`.

## Logos

- Square foil logo → hero (overlay header), sized large.
- Light teal foil logo → footer, left-aligned with the blurb, links home.
- Horizontal logo → reserved for a future sticky/scroll menu.
