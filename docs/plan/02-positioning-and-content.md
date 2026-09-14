# 2. Positioning, sitemap and content

## Who this site is for

Venzra Limited is a London-based software consultancy, founded 2018, that builds bespoke software
using AI. The site has one job: **convert a qualified enquiry into a conversation.** Everything else
is in service of that.

The visitor we are writing for is a decision-maker — a founder, a CTO, a head of product, or an
innovation lead — who has a problem they suspect software could solve, has probably been pitched
"AI" by three vendors already, and is trying to work out whether you can actually deliver. They are
not shopping for a framework. They want evidence.

Three questions the site must answer above the fold, or at most one scroll below it:

1. What do you build?
2. Who have you built it for?
3. How do I start a conversation?

## Positioning

The differentiator is not "we use AI". Every agency says that in 2026 and it has stopped meaning
anything. The differentiator is the combination of **20+ years of shipping production software** with
AI-native delivery — which is to say, you were doing architecture, CI/CD, testing and data modelling
properly long before the models arrived, and the models make that faster rather than replacing it.

That reads as: *bespoke software, built properly, delivered at a pace that only works if you know
what you are doing.* Credibility comes from named clients and specific outcomes, not from adjectives.

Two things to avoid, both of which v1 did:

- **Feature-listing without outcomes.** v1 had a wall of cards saying "Analytics", "Security",
  "Agile". They say nothing a buyer can act on.
- **Claiming scale you do not have.** v1 wrote about "all our customers, small, large and everything
  in between" as a one-person company. Specificity beats puffery: one named client with a real
  outcome outperforms a paragraph of generalities.

## Sitemap

Nine routes. All prerendered at build time.

| Route | Page | Purpose |
| --- | --- | --- |
| `/` | Home | The whole pitch on one page, with a CTA every screen or two |
| `/services` | What we do | The engagement types, in the buyer's language |
| `/work` | Our work | Client logos, engagements, outcomes — the credibility page |
| `/work/:slug` | Case study | Deep dive on one engagement. Prerendered per slug |
| `/approach` | How we work | Delivery model, where AI fits, what a project actually looks like |
| `/about` | About | Andrew, the company, why it exists |
| `/contact` | Contact | The form, plus the alternatives to it |
| `/privacy` | Privacy policy | GDPR obligation, triggered by the contact form |
| `/terms` | Terms | Website terms of use |

`/work/:slug` uses `getPrerenderParams` to enumerate slugs from the content source at build time, so
every case study is a static HTML file. `PrerenderFallback.Client` covers anything not yet built.

Deliberately not included: a blog, a pricing page, a careers page, a login. A blog that goes stale is
worse than no blog. Pricing on a bespoke consultancy site invites the wrong conversation. All three
can be added later without restructuring anything.

Deliberately dropped from v1: `/product`, `/pricing`, `/support`, `/register`, `/registered`,
`/prizes`, `/contacted`, `/legal/:page`. See the redirect table in
[06-delivery-and-operations.md](06-delivery-and-operations.md).

## Page-by-page brief

### `/` Home

| Section | Content |
| --- | --- |
| Hero | One-line proposition, one-line qualifier, primary CTA to `/contact`, secondary to `/work`. No carousel. |
| Client proof | Logo strip, immediately below the hero. This is the highest-value element on the site and it must not be buried. |
| What we do | Three or four service cards, each stating the problem it solves, linking to `/services` |
| Selected work | Two or three case study cards with a headline outcome each, linking to `/work` |
| How we work | Short version of `/approach` — three or four steps, honest about what the client has to do |
| Why AI matters here | The one section allowed to talk about AI directly. Concrete: what it changes about cost, speed and what is now feasible. No hype. |
| Closing CTA | Contact form embedded inline, or a strong link to `/contact` |

### `/services`

Organised by what the client is trying to achieve, not by technology. A first cut, to be confirmed:

- **Greenfield product build** — idea to production. The LinkedIn profile explicitly says greenfield
  is where the work principally sits, so this leads.
- **AI-enabled features in existing products** — retrieval, agents, document and data extraction,
  wired into software that already exists.
- **Data-heavy interfaces** — capturing, consuming and presenting data innovatively; this is
  described as a core strength and it is a real, specific niche.
- **Technical architecture and delivery consulting** — architecture, CI/CD, test strategy, cloud and
  DevOps for teams that have an engineering function but need direction.

Each entry: the problem, what you do about it, what the client ends up with, and a link to a case
study demonstrating it.

### `/work` — the page that needs input

This is the most important page and the one that cannot be drafted yet. LinkedIn does not expose
employment history to anything but a signed-in browser, so the list of companies you have worked for
is not retrievable programmatically. It has to come from you.

What each entry needs:

| Field | Notes |
| --- | --- |
| Client name | Or an anonymised descriptor if under NDA — "a FTSE 250 insurer" works |
| Logo | SVG preferred. Check the client's brand guidelines for logo-use permission |
| Engagement | One line on what was built |
| Outcome | The number that mattered. Time saved, revenue enabled, cost removed, users served |
| Stack | Brief, and only where it is a credential rather than trivia |
| Dates | Optional, but recency builds confidence |
| Permission | Explicit yes/no on naming them publicly. Assume no until confirmed |

**Before publishing any client name, check the engagement contract.** Consultancy contracts routinely
restrict naming the client or using their marks. Anonymised descriptors are a perfectly credible
fallback and are what most consultancies use for their regulated-sector work.

If only a handful of names can be published, publish those and describe the rest in aggregate — "we
have delivered for organisations in insurance, logistics and public sector" — rather than padding the
page.

### `/work/:slug` — case studies

Three to five to launch. The shape:

1. Client and context — who they are, what was happening
2. The problem — in their words where possible
3. What we built — enough technical detail to be credible, not a README
4. The outcome — measured
5. A pull quote, if you can get one
6. CTA to `/contact`

One strong case study beats five thin ones. If only two can be written properly, launch with two.

### `/approach`

Where AI actually enters the story. The claim worth making: AI-assisted delivery compresses the
build, but the reason the result holds up is the twenty years of architecture, testing and DevOps
discipline underneath it. Be specific about your delivery model — discovery, architecture, iterative
delivery, handover — and honest about what you need from the client to make it work.

### `/about`

Andrew, first person, with a photograph. For a one-person consultancy, the founder *is* the product,
and hiding that behind corporate "we" costs trust. The v1 site used an anonymous caricature and named
nobody; do the opposite.

Cover the 20+ years, the polyglot range (Angular, React, Next, Node, Nest, Firestore, Mongo,
Postgres, MySQL), the Venzra story including the 2018 eCommerce platform — a founder who has built
and run their own product is a credential, not something to hide — and the open-source work
(Bedrock, Code Mortals, the starter repos). Registered company details in the footer.

### `/contact`

The form, plus every alternative to it: direct email address, LinkedIn, and a realistic response
commitment. v1 promised "9am to 5pm every weekday" — only say that if it is true. Explain what
happens after submission and what information helps you respond usefully.

Mechanics are in [04-contact-pipeline.md](04-contact-pipeline.md).

### `/privacy` and `/terms`

Not optional. The contact form collects and stores personal data in Firestore, so a UK GDPR-compliant
privacy notice is a legal requirement, not a nicety. The v1 versions lived on a dead API and are
gone. These need writing fresh, ideally reviewed by someone qualified.

The privacy notice must cover: what the form collects, the lawful basis (legitimate interest in
responding to a business enquiry), where it is stored (Google Cloud, region to be confirmed —
see [07-decisions-and-inputs.md](07-decisions-and-inputs.md)), how long it is kept, who it is shared
with (Google as processor, the email provider), data subject rights, and a contact route for
exercising them.

## Tone

British English. Plain, specific, confident without swagger. Short sentences. Concrete nouns. If a
sentence would survive being read aloud to a sceptical CTO, it stays.

Ban list, all of which v1 leaned on: "cutting-edge", "seamless", "revolutionary", "leverage" as a
verb, "solutions" where a specific noun exists, and any sentence that could appear unchanged on a
competitor's site.
