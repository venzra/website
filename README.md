# Venzra Website

The marketing website for [Venzra Limited](https://venzra.com) — a London software consultancy
building bespoke software with AI.

This is version 2. Version 1 is archived at
[`venzra/website-old`](https://github.com/venzra/website-old) and was a 2018 Angular 7 site for a
different business entirely; none of its content or code carries over.

## Status

Planning. Nothing is scaffolded yet.

The build plan is in [`docs/plan`](docs/plan/README.md) — start with the
[overview](docs/plan/README.md), and see
[open decisions and inputs](docs/plan/07-decisions-and-inputs.md) for what is needed to proceed.

## Intended stack

- **Angular 22** — standalone, zoneless, signals, fully prerendered (`outputMode: "static"`)
- **Firebase Hosting** — static assets on a global CDN
- **Cloud Functions for Firebase** (2nd gen, Node 22) — contact form handling
- **Cloud Firestore** — enquiry storage, locked to server-side writes only
- **Trigger Email from Firestore** — notification delivery
