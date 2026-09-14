# 4. The contact pipeline

The contact form is the only dynamic part of the site and the only thing that matters commercially.
It gets more attention here than its size suggests because a silently failing contact form on a
consultancy site is an invisible, indefinite revenue leak — and it is exactly what happened to v1,
whose form posted to an API that no longer exists.

## Design principles

1. **Never lose an enquiry.** The submission is persisted to Firestore *before* any email is
   attempted. If mail delivery fails, the enquiry still exists and is recoverable.
2. **The client never chooses the recipient.** The destination address is server-side configuration.
   A form that lets the caller specify `to` is an open relay.
3. **No CAPTCHA puzzle.** Spam is handled invisibly. Making a prospect identify traffic lights to
   contact you is a conversion tax.
4. **Failures are visible.** A broken pipeline should page you, not sit quietly.

## Flow

```
1. Visitor completes the form
2. Angular obtains a limited-use App Check token (reCAPTCHA Enterprise)
3. httpsCallable('submitEnquiry') with the payload
4. Function:
   a. App Check token verified and consumed          → reject if invalid
   b. Honeypot field checked                         → accept silently, discard
   c. Minimum time-on-form checked                   → reject if implausibly fast
   d. Rate limit checked, per IP and per email        → reject with 429
   e. Payload validated and sanitised                → reject with field errors
   f. Write enquiries/{id}
   g. Write mail/{id} for the Trigger Email extension
   h. Return { ok: true, reference }
5. Trigger Email extension picks up mail/{id} → SMTP → inbox
6. UI confirms inline with the reference; no navigation
```

## The client

Signal Forms, stable as of Angular 22, replaces `ReactiveFormsModule`.

| Field | Type | Validation |
| --- | --- | --- |
| `name` | text | Required, 2–100 chars |
| `email` | email | Required, valid, ≤ 254 chars |
| `company` | text | Optional, ≤ 100 chars |
| `enquiryType` | select | Required. New project / Existing product / Advisory / Other |
| `message` | textarea | Required, 20–5000 chars |
| `consent` | checkbox | Required. Explicit acknowledgement of the privacy notice |
| `website` | hidden | Honeypot. Must be empty |

Submission is confirmed **inline**, replacing the form with a success panel. v1 navigated to a
separate `/contacted` page, which loses the back button and breaks the flow for no benefit.

Behaviour that matters:

- Validation messages appear on blur and on submit, never on every keystroke.
- The submit button enters a pending state and cannot be double-fired.
- Server-side field errors map back onto the specific fields.
- On any failure, the entered values survive and the direct email address is offered as a fallback —
  a prospect who has typed 400 words should never lose them.
- `aria-live` region announces success and failure; errors are associated to inputs by `aria-describedby`.

## The function

```ts
export const submitEnquiry = onCall(
  {
    region: 'europe-west2',
    enforceAppCheck: true,      // reject missing or invalid App Check tokens
    consumeAppCheckToken: true, // single-use, blocks replay
    cors: ['https://venzra.com', 'https://www.venzra.com'],
    maxInstances: 10,           // cost ceiling
    memory: '256MiB',
    timeoutSeconds: 30,
    secrets: ['NOTIFY_EMAIL'],
  },
  async (request) => { /* ... */ },
);
```

`maxInstances` is a deliberate cost control: it caps the blast radius of an attack or a bug on a
pay-per-invocation platform.

### Validation

Zod, shared between client and function so the rules cannot drift. The function re-validates
everything; client-side validation is a user-experience feature, never a security control.

Beyond shape: strip control characters, reject newlines in `name` and `email` (header-injection
defence), normalise whitespace, cap total payload size, and reject `email` addresses whose domain has
no MX record.

### Spam defence, in layers

| Layer | Mechanism | Stops |
| --- | --- | --- |
| App Check | reCAPTCHA Enterprise, enforced and consumed | Scripted submission from outside a real browser |
| Honeypot | `website` field, hidden from humans by CSS | Naive form-filling bots |
| Time gate | Reject submissions under ~3 seconds from form render | Automation that fills instantly |
| Rate limit | 5 per IP and 3 per email address per hour | Volume floods |
| Content heuristics | Link count, known spam phrasing → flagged, not rejected | Low-effort marketing spam |

Content heuristics **flag** rather than reject. A false positive that silently discards a real
enquiry is far more expensive than one flagged message in an inbox.

Rate limit state lives in a Firestore collection with a TTL policy, keyed by a hash of the IP rather
than the IP itself — there is no reason to retain raw visitor IP addresses.

**Roll out App Check in monitor mode first.** Run with `enforceAppCheck: false`, watch the metrics in
the Firebase console until legitimate traffic is consistently passing, then enforce. Enabling
enforcement on day one risks silently rejecting real enquiries from browser configurations you have
not seen.

### Firestore schema

```
enquiries/{enquiryId}
  reference      string     // human-readable, e.g. VZ-8F3K2A, quoted back to the sender
  name           string
  email          string
  company        string | null
  enquiryType    string
  message        string
  consentAt      timestamp
  createdAt      timestamp
  status         'new' | 'flagged' | 'responded' | 'archived'
  spamScore      number
  source         { referrer, utm, userAgent }
  mailId         string | null
  ipHash         string     // salted hash, never the raw address

mail/{mailId}                // consumed by the Trigger Email extension
  to             string[]    // from server config, never from the request
  replyTo        string      // the enquirer, so replying just works
  message        { subject, text, html }

rateLimits/{hashedKey}
  count          number
  windowStart    timestamp
  expiresAt      timestamp   // Firestore TTL policy reaps these
```

### Security rules

Total lockdown. Every collection here is written by the Admin SDK inside the function, which bypasses
rules entirely, so the client needs no access at all.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

This is worth stating explicitly because the common failure mode — letting the browser write directly
to a `contacts` collection — hands anyone with the public Firebase config a free database.

## Email delivery

**Trigger Email from Firestore** (`firebase/firestore-send-email`), the official Firebase extension.
The function writes a document to `mail/`; the extension renders and sends it over SMTP.

Why the extension rather than calling an email API from the function: SMTP credentials live in the
extension's secret configuration rather than in the codebase, delivery is retried independently of
the function's lifetime, and the send status is written back onto the document so failures are
inspectable in the console.

The extension's documentation is explicit that the `message` field should only ever be populated by
trusted server code. That is exactly our arrangement.

**SMTP provider** is an open decision — see [07-decisions-and-inputs.md](07-decisions-and-inputs.md).
It must be a transactional provider (Resend, Postmark, SendGrid, Mailgun), not a personal Gmail
account. Whichever is chosen, SPF, DKIM and DMARC records on `venzra.com` are mandatory; without
them, notification mail lands in spam and the pipeline fails in the one way nobody notices.

### Two emails per enquiry

1. **To Venzra** — the full enquiry, `replyTo` set to the enquirer so hitting reply just works, with
   the reference in the subject line.
2. **To the enquirer** — acknowledgement with their reference and a realistic response time. This
   costs nothing and materially improves the impression. It also surfaces typo'd email addresses
   immediately, via the bounce.

## Monitoring

Any of these should reach you without being asked for:

- A Cloud Monitoring alert on `submitEnquiry` error rate above a threshold.
- An alert on the Trigger Email extension writing a `delivery.state` of `ERROR`.
- A scheduled function that runs weekly, submits a synthetic enquiry end to end, verifies it arrives,
  and alerts if not. This is the check that would have caught v1's dead form.

## GDPR

The form collects personal data from UK and EU residents, so this is a compliance surface.

| Requirement | Approach |
| --- | --- |
| Lawful basis | Legitimate interest: responding to an unsolicited business enquiry |
| Transparency | Privacy notice linked directly beside the consent checkbox, not just in the footer |
| Data minimisation | Only the fields above. No tracking beyond referrer and UTM |
| Storage location | Firestore in a UK or EU region — `europe-west2`, to be confirmed |
| Retention | Defined period (24 months suggested), enforced by a scheduled function, not by intent |
| Right of erasure | A documented, tested procedure. Trivial here — delete the document |
| Processors | Google Cloud and the SMTP provider, both named in the privacy notice |
| Breach readiness | Know where the data is and who to notify before you need to |

The consent checkbox is an acknowledgement of the privacy notice, not a marketing opt-in. If a
mailing list ever appears, that is a separate, separately-recorded consent.
