# OctopusLM SEO Action Plan — Working Checklist

Companion to the SEO audit. Items marked **[site]** are implemented in this repo;
items marked **[manual]** happen outside the repo and are tracked here so the
plan lives next to the code.

## Canonical product description (paste everywhere)

Use this exact text on AlternativeTo, Legaltech Hub, G2, Capterra, directories,
and in the boilerplate of every press release. It is the single source of truth
and matches `index.html`.

> **OctopusLM — AI Medical Chronology & Medical Record Review Software**
> OctopusLM is web-based AI medical record review software (nothing to install).
> Upload PDF medical records and get a narrative summary and a dated chronology,
> with every line cited to the page it came from. Built for IME physicians, legal
> nurse consultants, attorneys, and insurance claims teams. HIPAA & PIPEDA
> compliant; records are never used to train models.
> **Pricing:** credit-based, no subscription — $0.10 per page, $0.05 with a $300
> top-up, $0.04 with a $4,000 top-up; 1,000 free trial pages. Insurance & Legal
> plan: $0.04 per page, 1,000,000-page minimum, setup fee separate. A product of Neopric Inc. — https://octopuslm.co

Never describe it as a desktop app. Never quote $99–299/mo or $250/month unlimited (stale).

## Phase 1 — Foundation

- [x] **[site]** Desktop-vs-cloud resolved on site: hero, meta description, JSON-LD,
      and blog footers all say "web-based, nothing to install".
- [ ] **[manual]** Update AlternativeTo listing description + pricing using the block above.
- [ ] **[manual]** Update Legaltech Hub profile using the block above.
- [x] **[site]** Pricing consistent everywhere: `index.html`, `pricing.html`, JSON-LD `offers`.
- [x] **[site]** Brand disambiguation: every `<title>` pairs OctopusLM with a descriptor
      (`| OctopusLM Medical Chronology AI`). Enforced by `TITLE_SUFFIX` in both build scripts.
- [x] **[site]** Homepage trust signals: Verified Healthcare Professional quote, product-fact stats,
      "Featured in" row (WorkCompCentral, Legaltech Hub, AlternativeTo). `Review` in JSON-LD.
- [ ] **[manual]** Claim G2 vendor profile — Medical Record Review / Legal Case Management.
- [ ] **[manual]** Claim Capterra vendor profile — same categories.
- [ ] **[manual]** Ask 5–10 current users (start with Dr. Luczak) for G2/Capterra reviews.

## Phase 2 — Insurance / claims landing pages

Source: `solutions/solutions-md/*.md` → `node scripts/build-solutions.js`

- [x] `/solutions/insurance-carriers.html`
- [x] `/solutions/tpas.html`
- [x] `/solutions/claims-adjusters.html`
- [x] `/solutions/workers-compensation.html`
- [x] `/solutions/ime-qme.html`
- [x] `/solutions/disability-claims.html`
- [x] `/solutions/auto-bodily-injury.html`

## Phase 3 — Bottom of funnel

- [x] `/compare/octopuslm-vs-wisedocs.html`
- [x] `/compare/best-medical-chronology-software-insurance-carriers.html`
- [x] `/pricing.html` — FAQPage + Offer schema
- [x] `/roi-calculator.html` — vanilla JS, client-side only
- [ ] **[manual]** Re-verify competitor claims on the two compare pages quarterly
      (Wisedocs / DigitalOwl public sites). Both carry an "as of this writing" disclaimer.

## Phase 4 — Link building & PR (ongoing, all manual)

- [ ] Claims Journal / Digital Insurance / Carrier Management — Bradford Hill causation angle.
      Source `blog/bradford-hill-criteria.html` → link to `/solutions/insurance-carriers.html`.
- [ ] WorkCompCentral follow-up — WSIB FAF / adjudicator content angle
      → `/solutions/workers-compensation.html`.
- [ ] AALNC and LNC associations — `marketing-lnc-practice`, `deposition-preparation`,
      `documentation-gaps` as member resources.
- [ ] AI tool directories (tooldirectory.ai, There's An AI For That, Futurepedia…) —
      use the canonical description above.
- [ ] Ontario / Québec insurance & legal trade press — SABS / OCF / LAT / WSIB / CNESST posts
      → `/solutions/auto-bodily-injury.html`, `/solutions/workers-compensation.html`.

## Phase 5 — Technical

- [x] **[site]** `sitemap.xml` includes all new URLs; homepage `lastmod` bumped.
- [ ] **[manual]** Submit sitemap in Google Search Console + Bing Webmaster Tools;
      request indexing for the 11 new URLs.
- [x] **[site]** Structured data: home `SoftwareApplication`+`Organization`+`Review`;
      pricing `SoftwareApplication` offers + `FAQPage`; solutions/compare `WebPage` +
      `BreadcrumbList` + `FAQPage`; all 35 posts `BlogPosting` + `BreadcrumbList`.
- [x] **[site]** Internal links: every blog post has a "Put this into practice" block →
      two relevant solutions pages; all navs/footers link Solutions, Pricing, ROI, vs Wisedocs.
- [ ] **[manual]** Rank tracking — load the keyword list below into your tracker (or GSC filters).

## Keyword targets

| Page | Primary | Supporting |
|---|---|---|
| /solutions/insurance-carriers | medical record review software for insurance carriers | claims medical chronology AI, medical summary software for insurance carriers |
| /solutions/tpas | TPA medical record review software | insurance claims document AI |
| /solutions/claims-adjusters | medical record AI for adjusters | claims medical record summarization |
| /solutions/workers-compensation | workers compensation medical chronology software | workers comp medical record review AI |
| /solutions/ime-qme | IME medical record review software | independent medical evaluation record review AI, QME medical record review |
| /solutions/disability-claims | disability claims medical record AI | SSDI/LTD medical chronology software |
| /solutions/auto-bodily-injury | auto bodily injury claims AI | bodily injury claims medical review AI, subrogation medical record review |
| /compare/octopuslm-vs-wisedocs | Wisedocs alternative | Wisedocs vs OctopusLM |
| /compare/best-medical-chronology-software-insurance-carriers | best medical chronology software for insurance carriers | medical chronology software comparison |
| /pricing | medical chronology software pricing | medical record review software cost, medical record review cost per page |
| / | OctopusLM | AI medical chronology software, medical record review software |

## Success metrics

| Metric | Baseline | Target |
|---|---|---|
| Indexed pages (GSC) | 37 | 48+ (all sitemap URLs) |
| Referring domains | ~3 | 15+ in 90 days |
| G2 + Capterra reviews | 0 | 10+ in 60 days |
| Impressions / clicks on keyword list | — | track monthly |
| "OctopusLM" SERP free of Octopus CRM/Deploy/Energy in top 3 | — | track monthly |

## Maintenance

- New blog post → `.md` in `blog/blog-md/`, run `node scripts/build-blog.js`.
- New landing page → `.md` in `solutions/solutions-md/`, run `node scripts/build-solutions.js`
  (`outDir: compare` in frontmatter for comparison pages).
- Hand-written legacy posts (no `.md`) → `node scripts/patch-legacy-posts.js` (idempotent).
- Price change → update `index.html`, `pricing.html` (copy + JSON-LD), `roi-calculator.html`
  constants, the canonical block above, and any landing-page markdown that quotes a price.
