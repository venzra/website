# 6. Delivery and operations

## Phasing

Seven workstreams, ordered by dependency. Each ends in something reviewable, and phases 1–3 can run
before any content exists.

### Phase 1 — Foundation

Scaffold Angular 22 (standalone, zoneless, `outputMode: "static"`), configure the Firebase project on
Blaze, wire `firebase.json` and `.firebaserc`, deploy a placeholder to Hosting to prove the path end
to end, and set up GitHub Actions with build, lint and test on pull requests.

*Done when:* a commit to `main` reaches a live Firebase Hosting URL automatically.

### Phase 2 — Design system

Tokens, typography, the twelve UI primitives, the layout shell, dark mode, and the image pipeline
script. Build these against a `/styleguide` route that is excluded from prerendering and from the
sitemap, so components can be reviewed in isolation without a Storybook dependency.

*Done when:* every primitive exists, is keyboard accessible, and passes axe.

### Phase 3 — Contact pipeline

The whole of [04-contact-pipeline.md](04-contact-pipeline.md): the callable function, Firestore rules
and TTL policies, App Check in monitor mode, the Trigger Email extension, SPF/DKIM/DMARC on
`venzra.com`, the Signal Forms client, and the synthetic monitoring function.

Built early and deliberately, because it is the one part that has to work and the one part that
failed last time.

*Done when:* a submission from the deployed preview arrives in the inbox, the Firestore record
exists, and the acknowledgement reaches the sender.

### Phase 4 — Pages and content

All nine routes, per the briefs in [02-positioning-and-content.md](02-positioning-and-content.md).
`/work` and the case studies are gated on the client list arriving — build the components against
placeholder data so the blocker does not stall the rest.

*Done when:* every route prerenders, is responsive, and reads as finished rather than drafted.

### Phase 5 — SEO, analytics and performance

Per-route metadata, JSON-LD, generated sitemap, canonicals, analytics with conversion events, the v1
redirect map, and Lighthouse budgets enforced in CI.

*Done when:* the budget table in [03-architecture.md](03-architecture.md) passes in CI.

### Phase 6 — Hardening

App Check moved from monitor to enforcement, Cloud Monitoring alerts live, the erasure procedure
documented and tested, privacy notice and terms reviewed, manual keyboard and screen reader passes,
and cross-browser checks.

*Done when:* the launch checklist below is fully green.

### Phase 7 — Launch

DNS cutover, redirects verified live, Search Console and sitemap submitted, and a monitored period
afterwards.

## Environments

| Environment | Firebase project | Domain | Purpose |
| --- | --- | --- | --- |
| Local | Emulator Suite | `localhost:4200` | Development. Functions, Firestore and Hosting all emulated |
| Preview | `venzra-web-staging` | Hosting preview channel per PR | Review; auto-expires after 7 days |
| Production | `venzra-web-prod` | `venzra.com` | Live |

Two Firebase projects, not one. Sharing a project between staging and production means test
submissions land in the production Firestore and real notification emails fire from preview
deployments.

The Emulator Suite matters more than usual here: it runs Functions and Firestore locally, so the
entire contact pipeline can be developed and tested without deploying and without sending mail.

## CI/CD

GitHub Actions, replacing the dead CircleCI setup.

**On pull request:** install, lint (ESLint with `@angular-eslint`), type-check, unit tests, build,
Playwright end-to-end tests against the built output, Lighthouse CI against the budgets, then deploy
to a Hosting preview channel and comment the URL on the PR.

**On merge to `main`:** the same checks, then deploy Hosting and Functions to production, and smoke
test the live site including a synthetic contact submission.

Authentication via Workload Identity Federation rather than a long-lived service account key
committed as a secret.

### Secrets

| Secret | Where it lives |
| --- | --- |
| SMTP credentials | Trigger Email extension configuration. Never in the repo |
| `NOTIFY_EMAIL` | Cloud Secret Manager, bound to the function |
| reCAPTCHA Enterprise site key | Public by design; ships in the client bundle |
| reCAPTCHA Enterprise secret | Firebase App Check configuration |
| Firebase deploy credentials | GitHub OIDC via Workload Identity Federation |

The Firebase web config (API key, project ID) is public by design and belongs in the client bundle.
It is not a secret; security comes from Firestore rules and App Check, which is why the rules in
[04-contact-pipeline.md](04-contact-pipeline.md) deny everything.

## Testing

v1 had no tests at all, and its contact form broke without anyone noticing. The strategy here is
deliberately modest but non-zero.

| Layer | Tool | Scope |
| --- | --- | --- |
| Unit | Vitest | UI primitives, validation schemas, content helpers |
| Function | Vitest + Firebase Emulator | Validation, rate limiting, spam layers, Firestore writes |
| Component | Angular testing utilities + axe | Accessibility and rendering of each primitive |
| End-to-end | Playwright | Navigation, the contact form happy path, the contact form failure path |
| Visual | Playwright screenshots | Key pages at three viewports, to catch unintended drift |
| Performance | Lighthouse CI | Budgets from [03-architecture.md](03-architecture.md) |
| Synthetic | Scheduled Cloud Function | Weekly end-to-end enquiry against production |

The e2e failure-path test is as important as the happy path: it asserts that when the function
returns an error, the user's typed message survives and the fallback email address appears.

## Domain migration

`venzra.com` currently resolves but returns HTTP 500 from the old AWS CloudFront distribution. The
cutover is therefore a live migration.

Sequence:

1. Confirm who controls the domain registration and the Route53 hosted zone, and that access still
   works. This is the first thing to verify, not the last — it is the classic blocker on a project
   returning to dormant infrastructure.
2. Add `venzra.com` and `www.venzra.com` as custom domains in Firebase Hosting; Firebase provisions
   the certificate.
3. Lower the DNS TTL well ahead of the cutover so a rollback is quick.
4. Verify the redirect map against the preview deployment.
5. Switch the A/AAAA records to Firebase, keeping `www` redirecting to the apex (or the reverse —
   pick one and be consistent, since v1 canonicalised on `www`).
6. Confirm certificate issuance and HTTPS, then raise the TTL again.
7. Submit the new sitemap to Search Console and monitor coverage.
8. Decommission the AWS S3 bucket, CloudFront distribution and CloudFormation stacks **only after**
   the new site is confirmed stable. Take a backup of the bucket first.

### Redirect map

Every v1 URL needs a 301. Losing these discards eight years of accumulated link equity.

| v1 URL | v2 destination | Rationale |
| --- | --- | --- |
| `/product` | `/services` | Nearest equivalent intent |
| `/pricing` | `/services` | No pricing page in v2 |
| `/support` | `/contact` | No self-serve product to support |
| `/about` | `/about` | Unchanged path |
| `/contact` | `/contact` | Unchanged path |
| `/contacted` | `/contact` | Confirmation is now inline |
| `/register` | `/contact` | No sign-up funnel |
| `/registered` | `/contact` | No sign-up funnel |
| `/prizes` | `/` | No equivalent |
| `/legal/terms-of-service` | `/terms` | |
| `/legal/privacy-policy` | `/privacy` | |
| `/legal/*` | `/terms` | Catch-all for any other legal slug |

Configured in `firebase.json` under `hosting.redirects` with `"type": 301`.

Also worth checking: whether `cdn.venzra.com`, `api.venzra.com`, `admin.venzra.com`, `demo.venzra.io`
or `bedrock.venzra.com` still have live DNS records. Dangling records pointing at deprovisioned cloud
resources are a subdomain-takeover risk and should be removed rather than left.

## Running cost

| Item | Expected | Notes |
| --- | --- | --- |
| Firebase Hosting | £0 | 10GB storage and 360MB/day transfer free; a static marketing site is nowhere near it |
| Cloud Functions | £0 | 2M invocations/month free. A contact form uses a handful |
| Firestore | £0 | 1GiB and 50k reads/day free |
| App Check / reCAPTCHA Enterprise | £0 | Free tier well above this volume |
| SMTP provider | £0–15/mo | Resend and Postmark both have free tiers adequate here |
| Analytics | £0–15/mo | Free if GA4; £8–15 for a privacy-first service |
| Domain | ~£12/yr | Existing |
| **Total** | **~£0–30/month** | |

The Blaze plan is required for Cloud Functions and is pay-as-you-go, so realistically this runs at or
near zero. **Set a budget alert on the billing account anyway** — the whole point of `maxInstances` on
the function is to cap the downside, and a budget alert is the second line of that defence.

## Launch checklist

- [ ] All routes prerender and return 200 with correct, unique titles and descriptions
- [ ] Contact form verified end to end on production: Firestore record, notification, acknowledgement
- [ ] App Check enforcing, with clean metrics from the monitor period
- [ ] SPF, DKIM and DMARC verified on `venzra.com`; test mail lands in the inbox, not spam
- [ ] Firestore rules deny all client access; verified with the rules emulator
- [ ] All v1 redirects return 301 to the right place
- [ ] `sitemap.xml` and `robots.txt` correct and submitted to Search Console
- [ ] Lighthouse ≥ 95 performance, 100 accessibility, 100 SEO on every route
- [ ] Manual keyboard-only pass and screen reader pass completed
- [ ] Privacy notice and terms published, accurate, and reviewed
- [ ] Every published client name confirmed permitted in writing
- [ ] Adobe Stock licence register complete; no originals in the public repository
- [ ] Monitoring alerts live and tested by deliberately breaking something
- [ ] Billing budget alert configured
- [ ] Dangling DNS records for dead subdomains removed
