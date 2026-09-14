# 7. Open decisions and inputs needed

## Blocking

Work cannot finish without these. Phases 1–3 can proceed in parallel, so nothing is idle while they
are resolved, but the site cannot launch.

### 1. The client list

**This is the one thing that cannot be found.** LinkedIn serves the experience section only to a
signed-in browser — public search surfaces the profile summary and nothing more. The list of
companies Venzra has delivered for has to come from you.

For each engagement:

| Field | Needed |
| --- | --- |
| Client name | Or an anonymised descriptor if restricted |
| Logo | SVG preferred |
| What was built | One or two sentences |
| Outcome | The measurable result |
| Stack | Brief |
| Dates | Optional |
| **Permission to name them publicly** | **Explicit yes or no** |

The fastest route: export your LinkedIn profile as PDF (Profile → Resources → Save to PDF) and drop
it into the repository or attach it to a follow-up. That gives the full history in one step, and the
outcomes and permissions can be filled in afterwards.

Pick three to five for full case studies. One properly written case study with a real number in it
outperforms ten logo tiles.

### 2. Naming permission

Consultancy contracts commonly restrict naming the client or using their marks. Every name on `/work`
needs checking against its engagement contract. Anonymised descriptors — "a FTSE 250 insurer", "a
national logistics operator" — are a credible and widely used fallback.

### 3. Domain and registrar access

Confirm you still control the `venzra.com` registration and the Route53 hosted zone, and that the AWS
account with the old S3, CloudFront and CloudFormation stacks is still accessible. `venzra.com`
currently returns HTTP 500, so something is still deployed and broken. Recovering dormant cloud
account access is the classic silent blocker on a project like this — worth verifying in week one
rather than at cutover.

### 4. Firebase project and billing

A Google account to own the Firebase projects, and a billing account on the Blaze plan. Blaze is
required for Cloud Functions. Expected spend is effectively zero, but the account must exist before
Phase 1 can complete.

## Decisions to make

### 5. Analytics

| Option | Cost | Cookie banner | Recommendation |
| --- | --- | --- | --- |
| GA4 | Free | Required | Depth you will not use |
| Plausible / Fathom / Simple Analytics | ~£8–15/mo | Not required | **Recommended** |
| Firebase Analytics | Free | Required | GA4 with the same implications |

The argument for privacy-first: the entire funnel is "did they reach `/contact` and submit". GA4's
depth is wasted, and avoiding the banner removes a consent-management integration, a legal surface,
and the first thing every visitor has to do being dismiss a dialogue.

### 6. SMTP provider

| Option | Free tier | Note |
| --- | --- | --- |
| Resend | 3,000/month | Cleanest developer experience |
| Postmark | 100/month | Best transactional deliverability reputation |
| SendGrid | 100/day | Most widely documented with the Firebase extension |
| Mailgun | Trial only | |

Any is adequate at this volume. **Not a personal Gmail account** — deliverability and credential
management both argue against it. Whichever is chosen, SPF, DKIM and DMARC on `venzra.com` are
mandatory.

### 7. Brand direction

Three options:

1. **Keep `#673ab7` as-is.** Zero cost, preserves recognition, but it is a Material default and
   purple is the category cliché in 2026 AI branding.
2. **Keep the purple, darken the interactive shade** for contrast headroom, and let a strong accent
   carry the personality. **Recommended.** Preserves continuity, fixes the accessibility ceiling.
3. **Full rebrand.** Justified only if the purple no longer represents where the company is going —
   but that is a business decision, not a technical one.

Related: does a clean SVG of the Venzra logo still exist? v1 shipped a PNG from a CDN that is now
dead. If not, it needs redrawing.

### 8. Firestore region

`europe-west2` (London) is the recommendation — it keeps enquiry data in the UK, simplifies the
privacy notice, and minimises latency for UK visitors. Firestore's location **cannot be changed after
the database is created**, so this needs deciding before Phase 1, not discovered in Phase 3.

The Trigger Email extension must be installed in the same region.

### 9. Retention period

How long should enquiries be kept in Firestore? 24 months is a defensible default for business
enquiries. Whatever is chosen goes in the privacy notice and gets enforced by a scheduled function,
because a retention policy that exists only as an intention is not a retention policy.

### 10. Response commitment

What goes on `/contact` and in the acknowledgement email? v1 promised "9am to 5pm every weekday".
Only publish a commitment you will actually meet — an unanswered promise is worse than none.

## Lower priority

### 11. Blog

Deliberately excluded from launch. A blog that goes stale signals a dormant company, which is the
exact impression to avoid. If you will genuinely publish, it can be added later without restructuring
anything — but it does change the rendering story, since a CMS-backed blog is the main reason this
site would ever need Firebase App Hosting instead of Hosting.

### 12. Bedrock

It is public, MIT-licensed, and archived in practice if not in fact. Options: leave it, archive it
formally on GitHub with a README note pointing at this site, or deprecate the npm package. A
consultancy's public GitHub is a shop window, and a library last touched in 2020 with seven open
issues is not the strongest exhibit. Archiving is tidy and honest.

### 13. `website-old`

Already archived. Nothing to do, but keep it — it is the only record of what v1 said, and the
`/legal` content it referenced is otherwise gone entirely.

### 14. Dormant subdomains

`cdn.venzra.com`, `api.venzra.com`, `admin.venzra.com`, `bedrock.venzra.com` and `demo.venzra.io` all
appeared in v1. Any that still have DNS records pointing at deprovisioned cloud resources are a
subdomain-takeover risk. Audit and remove during the domain migration.

## Summary of what to send

1. The client list, ideally as a LinkedIn PDF export, with permission noted per client
2. Confirmation of domain, Route53 and AWS account access
3. A Google account and billing account for Firebase
4. Decisions on analytics (5), SMTP provider (6), brand direction (7), region (9), retention (10)
5. The Venzra logo as SVG, if it exists
6. A photograph of you for `/about`
7. Adobe Stock account confirmation, and whether it is an individual, teams or enterprise plan —
   enterprise licensing terms differ from the Standard License described in
   [05-design-and-imagery.md](05-design-and-imagery.md)
