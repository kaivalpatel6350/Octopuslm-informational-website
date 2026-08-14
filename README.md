# OctopusLM — Informational Website

Marketing site for [OctopusLM](https://octopuslm.co), a product of Neopric Inc.
OctopusLM turns PDF medical records into a narrative summary and a dated
chronology, with every line citing its source page.

Static HTML + Tailwind (CDN). No build step, no dependencies.

## Structure

```
.
├── index.html          # Homepage — hero, demo video, how it works, pricing
├── terms.html          # Terms of Service (noindex)
├── 404.html            # Custom error page (served by GitHub Pages)
├── blog/               # Blog listing + 10 articles
├── favicon/            # Favicon set
├── 1.png               # Open Graph / social share image
├── logo.svg            # Logo used in structured data
├── robots.txt
├── sitemap.xml
├── CNAME               # Custom domain: octopuslm.co
└── .github/workflows/deploy.yml
```

## Local development

No tooling required — serve the folder over HTTP:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

> Use a local server rather than opening `index.html` from disk. Over `file://`
> YouTube refuses to embed the demo video, so the page falls back to opening it
> on youtube.com instead.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which publishes the
repository to GitHub Pages as-is. No build step runs.

```bash
git push origin main
```

One-time setup in the repo: **Settings → Pages → Source: GitHub Actions**, and
point the `octopuslm.co` DNS at GitHub Pages.

## SEO notes

- Every page has a unique `<title>`, meta description, canonical URL, and exactly one `<h1>`.
- `index.html` carries `SoftwareApplication` and `Organization` JSON-LD; blog posts carry `Article` JSON-LD.
- `terms.html` and `404.html` are `noindex` and deliberately excluded from `sitemap.xml`.
- Social previews use `1.png` via Open Graph and Twitter Card tags.

When updating pricing or product claims, update the copy **and** the JSON-LD
`offers` block in `index.html` so structured data doesn't drift from the page.

## License

Copyright © 2026 Neopric Inc. All rights reserved.
