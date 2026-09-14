# 5. Design and imagery

## Brand starting point

Venzra has one piece of documented brand: the deep purple `#673ab7` that ran through both v1 and
Bedrock. It is Material Design's Deep Purple 500 — a framework default rather than a considered
brand choice, but it has eight years of association behind it and is a reasonable anchor.

Bedrock's fuller palette:

| Role | Hex | Note |
| --- | --- | --- |
| Primary | `#673ab7` | Deep purple. Carried from v1 |
| Accent | `#b7af3a` | Olive/gold. Complements the primary |
| Success | `#3a94b7` | Teal |
| Warning | `#b7703a` | Orange-brown |
| Error | `#b73a67` | Rose |
| Text dark | `#222222` | |
| Surface light | `#faf8fa` | |
| Surface grey | `#eeeeee` | |

Two honest reservations about carrying it forward unchanged:

1. **Purple is everywhere in AI branding in 2026.** It reads as the default choice for the category
   rather than as distinctive.
2. **`#673ab7` on `#ffffff` gives a contrast ratio of about 5.9:1** — fine for body text at AA, but
   it fails AA for large text used as a subtle accent and leaves no headroom for AAA. Any primary
   used for text or interactive elements needs its contrast verified rather than assumed.

Proposal: **keep the purple as the brand anchor, but darken the interactive shade** so contrast is
comfortable, and let a strong accent carry the personality. This preserves recognition while fixing
accessibility. Worth a genuine design pass before committing — flagged in
[07-decisions-and-inputs.md](07-decisions-and-inputs.md).

## Tokens

CSS custom properties. This is the whole system; there is no framework underneath it.

```css
:root {
  /* Brand */
  --vz-primary:        #673ab7;
  --vz-primary-strong: #4f2d8c;  /* interactive/text use — verify ≥ 4.5:1 on white */
  --vz-primary-soft:   #ede7f6;
  --vz-accent:         #b7af3a;

  /* Neutrals */
  --vz-ink:            #16141a;
  --vz-ink-muted:      #55505f;
  --vz-surface:        #ffffff;
  --vz-surface-alt:    #faf8fa;
  --vz-border:         #e4e0ea;

  /* Status */
  --vz-success: #2f7d55;
  --vz-warning: #b7703a;
  --vz-error:   #b3283f;

  /* Type — fluid, no breakpoint jumps */
  --vz-font-sans: 'InterVariable', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --vz-step--1: clamp(0.83rem, 0.79rem + 0.2vw,  0.94rem);
  --vz-step-0:  clamp(1rem,    0.95rem + 0.25vw, 1.13rem);
  --vz-step-1:  clamp(1.2rem,  1.11rem + 0.45vw, 1.5rem);
  --vz-step-2:  clamp(1.44rem, 1.29rem + 0.75vw, 2rem);
  --vz-step-3:  clamp(1.73rem, 1.48rem + 1.25vw, 2.66rem);
  --vz-step-4:  clamp(2.07rem, 1.68rem + 1.97vw, 3.55rem);

  /* Space — 4px base */
  --vz-space-1: 0.25rem;  --vz-space-2: 0.5rem;   --vz-space-3: 0.75rem;
  --vz-space-4: 1rem;     --vz-space-6: 1.5rem;   --vz-space-8: 2rem;
  --vz-space-12: 3rem;    --vz-space-16: 4rem;    --vz-space-24: 6rem;

  /* Shape — from Bedrock */
  --vz-radius-sm: 4px;
  --vz-radius-lg: 10px;

  --vz-measure: 68ch;  /* maximum line length for body copy */
}
```

Dark mode via `prefers-color-scheme` with the same token names reassigned. Because every colour is a
custom property, this costs one media query block rather than a parallel stylesheet.

## Typography

One variable font, self-hosted, subset to Latin, preloaded as WOFF2. A variable font gives the full
weight range in a single file of roughly 25–40KB compressed.

Self-hosting rather than Google Fonts: it removes a third-party request from the critical path, keeps
the privacy notice simpler (no visitor IPs sent to Google on page load), and eliminates a
render-blocking dependency on a domain outside our control. v1 loaded four separate Roboto weights
from Google Fonts.

`font-display: swap`, with metric-compatible fallbacks declared so the swap does not shift layout.

## Component inventory

Twelve or so primitives cover the entire site:

| Component | Notes |
| --- | --- |
| Button | Primary, secondary, ghost. Renders as `<a>` or `<button>` correctly |
| Card | Case study, service, generic |
| Field | Label, control, hint, error. Wraps input, textarea, select, checkbox |
| Logo wall | Client logos, greyscale until hover, graceful with any count |
| Section | Consistent vertical rhythm and background alternation |
| Hero | Home variant and interior variant |
| Stat | A number and a label. Used for case study outcomes |
| Quote | Pull quote with attribution |
| Nav | Header with mobile disclosure. Keyboard and focus-trap correct |
| Footer | Links, company registration details, social |
| Picture | Responsive image wrapper. Detail below |
| Skip link | First focusable element on the page |

Built as standalone Angular components under `web/src/app/ui/`. Bedrock's component APIs are a useful
reference for the form controls.

## Accessibility

WCAG 2.2 AA is the target, and the Lighthouse accessibility budget is set to 100 rather than 95
because there is no excuse for less on a site this simple.

Non-negotiables: real semantic landmarks; a visible focus indicator that meets the 2.2 focus
appearance criteria; keyboard operability for every interactive element including the mobile nav;
`prefers-reduced-motion` honoured for all animation; form errors associated by `aria-describedby`;
all imagery carrying meaningful `alt` text or explicitly marked decorative; 4.5:1 contrast on body
text and 3:1 on interface elements, verified with a tool rather than by eye.

Automated checks (axe in the component tests, Lighthouse in CI) catch perhaps half of real
accessibility problems. A manual keyboard-only pass and a screen reader pass before launch catch the
rest.

## Imagery

### Licensing — read this before committing anything

The Adobe Stock **Standard License** grants a non-exclusive, perpetual, worldwide licence to use,
reproduce, modify and display the work for advertising, marketing and promotional purposes. For our
purposes the critical points are:

- **Website display is unlimited.** The 500,000-use cap applies to printed materials and to
  productions or programmes with an audience over 500,000; the audience restriction explicitly does
  not apply to works displayed only on websites, social media sites or mobile applications.
- **Modification is permitted.** Crop, recolour, composite freely.
- **You may not distribute the standalone file.** The licence covers the image *as used in your
  work*, not redistribution of the asset itself.
- **You may not create merchandise or templates for resale** where the image is the primary value.
- **Attribution** is required for editorial works, for audiovisual productions, and where any other
  stock provider is credited on the same page. Standard commercial web use of a non-editorial asset
  does not require a visible credit line.
- **Editorial-use assets cannot be used commercially at all.** Check each asset's designation before
  licensing it — an editorial photograph on a company homepage is a breach regardless of licence
  tier.

### The public-repository problem

**`venzra/website` is a public repository.** Committing full-resolution Adobe Stock originals into it
would place the standalone licensed files on a public mirror, which sits badly against the
prohibition on distributing the standalone file — and GitHub history is effectively permanent, so it
is not fixable by a later deletion.

Mitigation, in order of preference:

1. **Commit only processed derivatives.** Cropped, resized to web dimensions, recompressed to
   AVIF/WebP, and where possible composited or overlaid. These are the work, not the asset.
2. **Keep originals out of the repository.** A private Drive folder or Cloud Storage bucket, with the
   licence certificates alongside them.
3. **If full-resolution originals must be versioned,** make the repository private or use a private
   assets repository.

Option 1 is the recommendation. It also happens to be correct on performance grounds — nobody should
be shipping a 6000px original to a browser anyway.

### Licence register

`docs/assets/licences.md`, maintained as assets are added:

| File | Adobe Stock ID | Licence type | Licence date | Editorial? | Where used |
| --- | --- | --- | --- | --- | --- |

Adobe Stock licences are perpetual, but proving you hold one requires the record. Keep the licence
certificate PDFs with the originals, outside the repository.

### Art direction

The risk with stock imagery on a consultancy site is that it looks like stock imagery — the handshake
in the boardroom, the glowing blue neural network, the diverse team pointing at a monitor. That
imagery actively signals "we had nothing real to show".

Guidance:

- **Prefer abstract and textural over literal.** Architecture, materials, light, structure. They
  carry mood without making a false claim.
- **Never use stock people as if they were the team.** A real photograph of Andrew on `/about` is
  worth more than any stock portrait.
- **Never use stock screenshots as if they were client work.** Case study imagery should be real
  product screenshots (with permission) or abstract representations, clearly not claiming to be the
  deliverable.
- **Apply a consistent treatment** — a duotone in the brand purple, a consistent grade, a consistent
  crop ratio — so licensed images read as one deliberate set rather than a stock library.
- **Be sparing.** Two or three strong images beat fifteen decorative ones, and each one costs
  Largest Contentful Paint.

### Pipeline

A build-time step (`sharp`) takes each source image and emits:

- **AVIF** primary, **WebP** fallback. JPEG only where a hard fallback is genuinely needed.
- Widths at 400, 800, 1200, 1600 and 2400, wired into `srcset` with correct `sizes`.
- A tiny blurred placeholder inlined as a data URI to prevent layout shift.
- Intrinsic `width` and `height` on every `<img>`, always.

Rules:

- `loading="lazy"` and `decoding="async"` on everything except the hero image.
- The hero image gets `fetchpriority="high"` and a `<link rel="preload">` — it is the Largest
  Contentful Paint element and everything else is downstream of it.
- Logos and icons as inline SVG, optimised with SVGO. Never a raster logo; v1 used a PNG.
- A hard budget: **no single image over 200KB after compression.**

### Non-stock assets still needed

Adobe Stock does not cover:

- **The Venzra logo**, as clean SVG. v1's was a PNG on a dead CDN and may need redrawing.
- **Client logos**, which come from the clients and are covered by their brand guidelines, not by
  Adobe Stock.
- **A photograph of Andrew** for `/about`. Worth doing properly; it is the single most humanising
  asset on the site.
- **Favicons and app icons** at the full size range, plus the Open Graph share image at 1200×630.
