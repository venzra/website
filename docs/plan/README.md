# Venzra Website v2 — Build Plan

This directory holds the plan for rebuilding venzra.com. It is a plan for review, not an
implementation. Nothing in `/workspace` has been scaffolded yet beyond these documents.

## The short version

The v1 site (`venzra/website-old`, archived) is a 2018 Angular 7 marketing site for a completely
different business: a self-serve eCommerce SaaS platform with pricing tiers, Stripe payouts and
a sign-up funnel. v2 is a consultancy site for a firm that builds bespoke software with AI. Almost
none of the v1 content transfers. Calling this "version 2" is accurate for the brand and the domain,
but the content is a rewrite and the codebase is a greenfield build.

The recommendation is a **fully prerendered (SSG) Angular 22 app on Firebase Hosting**, with a
**single callable Cloud Function** behind the contact form writing to Firestore and sending mail via
the Trigger Email extension. That matches the requested "Firebase Hosting and Functions" stack
exactly, keeps the running cost near zero, and avoids the one Firebase trap that would otherwise bite
this project (see "Hosting" in [03-architecture.md](03-architecture.md)).

## Documents

| Document | What it covers |
| --- | --- |
| [01-where-we-are.md](01-where-we-are.md) | What v1 actually is, what's still running, what is salvageable |
| [02-positioning-and-content.md](02-positioning-and-content.md) | Positioning, sitemap, page-by-page content brief |
| [03-architecture.md](03-architecture.md) | Angular 22, Firebase Hosting, Functions, repo layout |
| [04-contact-pipeline.md](04-contact-pipeline.md) | Contact form end to end: schema, spam, email, GDPR |
| [05-design-and-imagery.md](05-design-and-imagery.md) | Brand, design tokens, Adobe Stock pipeline and licensing |
| [06-delivery-and-operations.md](06-delivery-and-operations.md) | Phasing, environments, CI/CD, testing, cost |
| [07-decisions-and-inputs.md](07-decisions-and-inputs.md) | Open decisions and the inputs needed from Andrew |

## Headline decisions

| Decision | Choice | Why |
| --- | --- | --- |
| Framework | Angular 22, standalone, zoneless, signals | Latest stable (June 2026); plays to existing Angular expertise |
| Rendering | Fully static prerender (`outputMode: "static"`) | Marketing site with fixed routes; perfect SEO, no server to run |
| Hosting | Firebase Hosting | As requested; ideal for static output; global CDN included |
| Backend | Cloud Functions for Firebase, 2nd gen, Node 22 | As requested; one callable function is all the site needs |
| Contact storage | Firestore, locked down, server-write only | Durable record of enquiries independent of email deliverability |
| Contact delivery | Trigger Email from Firestore extension | Official, maintained, keeps SMTP credentials out of the codebase |
| Spam protection | App Check with reCAPTCHA Enterprise, plus honeypot and rate limit | Layered; no user-facing CAPTCHA puzzle |
| Styling | Hand-rolled tokens on modern CSS, no component framework | Small site; avoids inheriting a framework's opinions |
| Bedrock (`@venzra/bedrock`) | Reference only, not a dependency | Angular 9 / View Engine, dormant since 2020; will not build on v22 |
| CI/CD | GitHub Actions to Firebase Hosting, preview channels on PRs | Replaces the dead CircleCI and AWS CloudFormation setup |
| Images | Adobe Stock under Standard License, processed to AVIF/WebP | Standard License covers unrestricted web display |

## Biggest risks to flag now

1. **The client list is not publicly retrievable.** LinkedIn does not expose the experience section
   to anything but a signed-in browser, so the "companies we have worked for" section cannot be
   drafted without Andrew supplying it. This is the single blocking content input.
2. **This repository is public.** Committing Adobe Stock originals into it would sit badly against
   the licence term prohibiting distribution of the standalone file. See
   [05-design-and-imagery.md](05-design-and-imagery.md) for the mitigation.
3. **Naming real clients usually needs permission.** Consultancy engagements are frequently under
   NDA or have logo-use clauses. This is a legal check, not a design one.
4. **venzra.com currently returns HTTP 500.** DNS still resolves and something answers, so the
   cutover is a live migration off the old AWS stack, not a fresh domain setup.
