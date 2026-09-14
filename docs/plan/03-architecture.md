# 3. Architecture

## Summary

A fully prerendered Angular 22 application served as static files from Firebase Hosting, with one
callable Cloud Function handling contact form submissions into Firestore. No server to run, no
container to keep warm, no cold starts on page load.

```
Browser
   │
   ├─ GET /work/acme          Firebase Hosting (global CDN)
   │                          └─ static HTML prerendered at build time
   │
   └─ callable: submitEnquiry Cloud Functions 2nd gen (Node 22, europe-west2)
                              ├─ App Check + honeypot + rate limit
                              ├─ write → Firestore  enquiries/{id}
                              └─ write → Firestore  mail/{id}
                                                     └─ Trigger Email extension → SMTP → inbox
```

## Angular 22

Angular v22.0.0 shipped 3 June 2026 and is the right target. Relevant defaults, all of which we
simply accept rather than configure:

- **Zoneless by default** for new applications. No `zone.js` in the bundle.
- **`OnPush` by default** for new components. No longer needs declaring.
- **Signal Forms stable** — this is the API for the contact form, not `ReactiveFormsModule`.
- **`HttpClient` uses `fetch` by default**; `withFetch()` is deprecated and unnecessary.
- **Incremental hydration on by default** with `provideClientHydration()`.
- **Standalone components** throughout. No NgModules anywhere in the codebase.

Everything is signals: `input()`, `output()`, `signal()`, `computed()`, `resource()`. The site is
small enough that there is no reason to write a single manual subscription.

### Rendering: static, not SSR

```jsonc
// angular.json
{
  "projects": {
    "web": {
      "architect": {
        "build": {
          "options": {
            "outputMode": "static"
          }
        }
      }
    }
  }
}
```

With `outputMode: "static"`, Angular prerenders every route to an HTML file at build time and
generates **no server bundle**. Server routes are declared in `app.routes.server.ts`:

```ts
export const serverRoutes: ServerRoute[] = [
  { path: 'work/:slug', renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Client,
    getPrerenderParams: async () => caseStudySlugs.map((slug) => ({ slug })) },
  { path: '**', renderMode: RenderMode.Prerender },
];
```

This is the correct choice here for reasons beyond simplicity:

- Content changes on a rebuild cadence, not per request. Nothing on the page is user-specific.
- Static HTML from a CDN is the fastest thing that exists. Largest Contentful Paint is a CDN round
  trip and an image decode.
- Crawlers get complete HTML with no JavaScript execution required.
- There is no server to patch, scale, or pay for when idle.

### Hosting: the trap to avoid

Firebase has two hosting products and the distinction matters.

**Firebase Hosting** serves static assets from a global CDN. **Firebase App Hosting** (GA since April
2025) builds and runs server-rendered frameworks on Cloud Run.

Firebase Hosting also has a *framework-aware* mode that detects an Angular app, builds it, and
deploys the SSR half to Cloud Functions automatically. **Do not build on it.** Google's own
documentation states that new participation in the Hosting frameworks experiment has been closed
permanently for Angular developers, and directs existing users to graduate to App Hosting. It was
never covered by an SLA or a deprecation policy.

Building static output sidesteps this entirely. `firebase.json` points `public` at the browser build
directory and Firebase Hosting serves it as plain files — a mature, fully supported path with no
framework detection involved.

```jsonc
// firebase.json
{
  "hosting": {
    "public": "dist/web/browser",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "cleanUrls": true,
    "trailingSlash": false,
    "headers": [
      { "source": "**/*.@(js|css)",
        "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] },
      { "source": "**/*.@(avif|webp|jpg|png|svg|woff2)",
        "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] },
      { "source": "**/*.html",
        "headers": [{ "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" }] }
    ]
  },
  "functions": { "source": "functions", "runtime": "nodejs22" },
  "firestore": { "rules": "firestore.rules" }
}
```

Note there is **no SPA rewrite to `index.html`**. Every route has its own prerendered HTML file, and
a catch-all rewrite would serve the homepage's HTML for a genuinely missing URL — returning 200 where
a 404 belongs, which search engines treat as a soft 404. A `404.html` at the root is what Firebase
Hosting serves for unmatched paths.

**If the site later needs true SSR** — a CMS-backed blog, personalisation, anything rendered per
request — Firebase App Hosting is the migration target. That is a hosting change, not a rewrite: the
Angular app moves from `outputMode: "static"` to `"server"` and gets deployed to App Hosting instead.
Worth knowing about, not worth pre-building for.

One App Hosting gotcha, recorded here for whenever that day comes: Angular's server engine only
trusts `X-Forwarded-*` headers when configured to, and App Hosting's proxy sets several. If Angular
does not trust the full set, it silently de-optimises to client-side rendering on every request.

## Cloud Functions

**2nd generation, Node 22, `europe-west2` (London).**

Node 22 is GA in Cloud Functions for Firebase and deprecates 30 April 2027. Node 24 is GA on Cloud
Run functions and has landed in the Firebase CLI with beta status — a worthwhile upgrade once it is
GA in Firebase, but not the version to start a production site on today. Pinned in both places:

```jsonc
// functions/package.json
{ "engines": { "node": "22" } }
```

`europe-west2` keeps the function, Firestore and the data in the UK, which simplifies the privacy
notice and keeps latency low for UK visitors. The Trigger Email extension must be installed in the
same region.

The function surface is deliberately tiny — one callable, `submitEnquiry`, detailed in
[04-contact-pipeline.md](04-contact-pipeline.md). Cloud Functions requires the **Blaze** plan. For a
marketing site's traffic this lands inside the free tier, but a billing account must exist.

## Repository layout

Single repository, npm workspaces, deployed as one unit.

```
/
├── .github/workflows/
│   ├── ci.yml                  build, lint, test, Lighthouse on every PR
│   ├── preview.yml             deploy PR to a Hosting preview channel
│   └── release.yml             deploy main to production
├── docs/plan/                  these documents
├── web/                        the Angular application
│   ├── src/app/
│   │   ├── core/               config, analytics, structured data, SEO service
│   │   ├── ui/                 design-system primitives (button, card, field, ...)
│   │   ├── layout/             header, footer, shell
│   │   ├── pages/              one folder per route, standalone components
│   │   ├── features/contact/   the form and its client
│   │   ├── content/            case studies, services, client list as typed data
│   │   ├── app.routes.ts
│   │   └── app.routes.server.ts
│   ├── src/styles/             tokens, reset, typography
│   └── public/                 favicons, robots.txt, processed images
├── functions/                  Cloud Functions source (TypeScript)
│   └── src/
│       ├── index.ts
│       ├── enquiry/            validation, rate limiting, mail composition
│       └── lib/
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
└── .firebaserc
```

### Content as typed data

Case studies, services and the client list live in the repo as typed TypeScript objects — no CMS, no
runtime fetch, no headless service to pay for and keep alive.

```ts
export interface CaseStudy {
  slug: string;
  client: string;
  anonymised: boolean;     // true when the contract prevents naming them
  logo?: string;
  summary: string;
  problem: string;
  solution: string;
  outcome: { metric: string; value: string }[];
  stack: string[];
  quote?: { text: string; attribution: string };
  published: boolean;      // gates prerendering — draft studies never ship
}
```

This gives compile-time safety on content, keeps `getPrerenderParams` trivial, and means a content
change is a reviewable pull request. If publishing cadence ever outgrows that, a headless CMS can be
introduced behind the same interface without touching the components.

## Styling

Hand-rolled tokens on modern CSS. No Angular Material, no Tailwind, no component framework.

The site needs perhaps a dozen components. A framework would mean inheriting its opinions, its bundle
weight, and its upgrade treadmill for negligible benefit — and v1 demonstrated exactly how that ends,
with a Material 7 theme frozen in 2018.

- CSS custom properties for tokens, so runtime theming is free if ever wanted.
- Native CSS nesting, `@layer`, `clamp()` for fluid type, container queries for component-level
  responsiveness. All broadly supported in 2026.
- Component styles scoped by Angular's default view encapsulation.
- Sass only if a genuine need appears; plain CSS is likely sufficient.

Tokens and brand values are in [05-design-and-imagery.md](05-design-and-imagery.md).

## Analytics

Universal Analytics is dead and the v1 property ID is worthless. Options:

1. **GA4** — free, comprehensive, requires a cookie banner and adds a consent-management dependency.
2. **A privacy-first analytics service** (Plausible, Fathom, Simple Analytics) — cookieless,
   typically no banner needed, roughly £8–15/month, far less data.
3. **Firebase Analytics** — already in the stack, but it is GA4 underneath with the same consent
   implications.

Recommendation: **privacy-first analytics**. For a site whose entire conversion funnel is "did they
reach `/contact` and submit", GA4's depth is unused, and skipping the cookie banner removes a
consent-management integration, a legal surface, and the first interaction every visitor has with the
site being a dismissal dialogue. Decision flagged in
[07-decisions-and-inputs.md](07-decisions-and-inputs.md).

Conversion tracking regardless of choice: contact form submitted, email link clicked, case study
read to completion.

## SEO and structured data

- Per-route `<title>` and meta description, set via Angular's `Title` and `Meta` services and baked
  into the prerendered HTML.
- Open Graph and Twitter Card tags per route, with a per-page share image.
- `Organization` and `ProfessionalService` JSON-LD sitewide; `Article` on case studies.
- `sitemap.xml` generated from the route manifest at build time, not hand-maintained. v1's was
  hand-written, listed `/legal/terms-of-service` twice, and omitted the privacy policy.
- `robots.txt` allowing everything, pointing at the sitemap. v1 disallowed `/contact` — actively
  harmful for a site whose goal is enquiries.
- Canonical link tags, absolute, on every page.
- Redirects from every v1 URL (table in
  [06-delivery-and-operations.md](06-delivery-and-operations.md)) to preserve link equity.

## Performance budget

Enforced in CI; a pull request that breaches it fails.

| Metric | Budget |
| --- | --- |
| Largest Contentful Paint | < 1.5s on 4G |
| Cumulative Layout Shift | < 0.05 |
| Interaction to Next Paint | < 100ms |
| Initial JavaScript, compressed | < 100KB |
| Lighthouse Performance | ≥ 95 |
| Lighthouse Accessibility | 100 |
| Lighthouse SEO | 100 |

Zoneless Angular with static HTML makes these comfortably achievable. The realistic threat to all of
them is images, which is why [05-design-and-imagery.md](05-design-and-imagery.md) treats the asset
pipeline as an engineering problem rather than a design one.
