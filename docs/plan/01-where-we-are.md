# 1. Where we are

## The three repositories

| Repository | State | Relevance to v2 |
| --- | --- | --- |
| `venzra/website` (this one) | Empty except a one-line README | The v2 home |
| `venzra/website-old` | Archived. Last commit 19 Oct 2018 | Historical reference; content does not transfer |
| `venzra/bedrock` | Public, MIT, last commit 26 Feb 2020 | Design reference only |

## What v1 actually was

`venzra/website-old` is `venzra-website@2.0.0`, authored by SYSEN LIMITED, tagged `v1.0.0`. It is an
Angular 7 progressive web app marketing a **self-serve eCommerce SaaS platform** — not a consultancy.

Its pitch, verbatim from the homepage hero:

> **Start selling online today.** Venzra helps get your business online. Growing with your business
> needs it is ideal for entrepreneurs, start-ups and small businesses.

Pricing was a free Start-up tier at 6% + 30p per transaction and a £15/month Small Business tier at
3.5% + 30p. The site had a sign-up funnel (`/register` → `/registered`), a product tour with an
embedded YouTube video, a demo store at `demo.venzra.io`, an FAQ about PCI-DSS and Stripe payouts,
and a prize-draw page sponsoring Twisted Stone Golf Course.

The company timeline on `/about` runs June 2017 (research) → January 2018 (private alpha) → June 2018
(beta launch at Surrey Business Expo, Guildford) → November 2018 (WebSummit Lisbon, written in the
future tense). Development stopped a month before that last entry.

### Technical shape of v1

| Aspect | v1 |
| --- | --- |
| Framework | Angular 7.0.0, Angular Material 7, Flex Layout 7.0.0-beta.19 |
| TypeScript | 3.1.3, targeting ES5 |
| Node | 8 |
| Architecture | NgModules, one monolithic `VenzraModule` declaring every page |
| Rendering | Client-side only, with a service worker for PWA |
| Routes | `/`, `/product`, `/pricing`, `/support`, `/about`, `/contact`, `/contacted`, `/register`, `/registered`, `/prizes`, `/legal/:page` |
| Styling | SCSS over Angular Material's deep purple palette (`#673ab7`), Roboto, normalize.css |
| Images | All external, on `cdn.venzra.com` — nothing in the repo |
| Backend | `api.venzra.com`, a separate service not in any public repo |
| Hosting | AWS S3 + CloudFront + Route53, provisioned by CloudFormation in `eu-west-1` |
| CI | CircleCI on Node 8, lint-only, plus DashboardHub build notifications |
| Analytics | Google Analytics Universal Analytics, `UA-112514044-1` |
| Tests | None. No spec files, no Karma, no e2e, no `ng test` target |

### What is dead

- **Universal Analytics** was switched off by Google in 2023. The property ID is worthless.
- **`api.venzra.com`** backed the contact form, the registration flow, and the Terms and Privacy
  pages, which were fetched as Markdown at runtime. The legal copy is therefore *not in the repo* and
  is presumed gone with the API. Both documents need writing from scratch.
- **`cdn.venzra.com`** held every image on the site. Assume none of it is recoverable or wanted.
- **CircleCI + CloudFormation + DashboardHub** is an obsolete pipeline for a stack we are leaving.
- **`www.venzra.com`** currently returns HTTP 500, so whatever is behind the old CloudFront
  distribution is broken. DNS still resolves.

## Bedrock: reference, not dependency

`@venzra/bedrock@0.5.0` (published 26 Feb 2020) is a 15-component Angular library — button, card,
input, select, checkbox, date picker, time picker, autocomplete, pagination, expansion panels,
alerts, image input with EXIF correction, plus a Markdown directive and a URL validator. The form
components all implement `ControlValueAccessor` properly, which is the genuinely hard part of a form
library.

It will not build on Angular 22. The blockers are not cosmetic:

- Peer-locked to Angular 9, with `enableIvy: false` in the production build — View Engine has been
  gone since Angular 13.
- Every component ships in its own NgModule; Angular's default is standalone components.
- TypeScript 3.7.5; Angular 22 dropped support for TypeScript below 6.0.
- TSLint and Codelyzer for linting, both long since retired.
- `marked` and `exif-js` accessed off `window` as globals, with `marked`'s removed `sanitize: true`.
- Sass `lighten()` / `darken()` throughout, deprecated in Dart Sass.

Upgrading through eleven major Angular versions for a dormant library with no tests and no
accessibility story would cost far more than it returns on a site this size.

**What we do take from it:** the colour palette, which is the closest thing to a documented Venzra
brand, and the API shapes where we build equivalent form controls.

```scss
// venzra/bedrock — src/lib/core/palette.scss
brand.primary.dark: #673ab7   // deep purple — matches v1's Material primary
brand.accent.dark:  #b7af3a   // olive / gold
success:            #3a94b7   // teal
warning:            #b7703a   // orange-brown
error:              #b73a67   // rose
font.dark:  #222222    font.light: #faf8fa
background.dark: #eeeeee    background.light: #faf8fa
```

Border radii were 4px on inputs and buttons, 10px on cards and panels. Input padding 0.5rem. The
docs site used Oxygen at a 20px base with weight 300.

## What this means for v2

The honest framing: **v2 shares a brand and a domain with v1 and nothing else.** There is no
migration path for the code, no content to port, and no backend to reconnect to. Treating it as a
greenfield build against the existing brand is both faster and more truthful than pretending it is an
upgrade.

The three things worth carrying forward are the deep purple, the `venzra.com` domain and its SEO
history, and the lesson that shipping a marketing site with zero automated tests is how you end up
with a site that 500s and nobody notices.
