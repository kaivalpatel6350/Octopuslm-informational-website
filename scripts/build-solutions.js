#!/usr/bin/env node
/**
 * build-solutions.js
 * Generates the keyword-targeted landing pages in solutions/ (and compare/)
 * from markdown sources in solutions/solutions-md/, and adds their URLs to
 * sitemap.xml (idempotent — existing URLs are never duplicated).
 *
 * To add a landing page:
 *   1. Drop a new .md file into solutions/solutions-md/
 *   2. Run: node scripts/build-solutions.js
 *
 * Frontmatter (all keys except title/description optional):
 *   title:        <title> text (brand suffix is appended automatically)
 *   description:  meta description (<= ~160 chars)
 *   h1:           page headline (defaults to title)
 *   subtitle:     lead paragraph under the H1
 *   keywords:     comma-separated meta keywords
 *   outDir:       "solutions" (default) or "compare"
 *   eyebrow:      small label above the H1, e.g. "For Insurance Carriers"
 *   testimonial:  true to render the Dr. Luczak quote card
 *   related:      comma-separated blog slugs to list under "Related reading"
 *   faq:          multiline list in the body under a "## FAQ" heading — each
 *                 "### question" followed by its answer paragraph(s) is turned
 *                 into FAQPage JSON-LD automatically.
 */

const fs = require('fs');
const path = require('path');

let marked;

const ROOT = path.resolve(__dirname, '..');
const MD_DIR = path.join(ROOT, 'solutions', 'solutions-md');
const SITE = 'https://octopuslm.co';
const TITLE_SUFFIX = 'OctopusLM Medical Chronology AI';
const TODAY = new Date().toISOString().slice(0, 10);

const TESTIMONIAL = {
    quote: "It's cutting my record review time significantly and extracting useful insights and summaries from otherwise complex time consuming files.",
    author: 'Verified Healthcare Professional',
    role: 'Psychiatrist',
};

const SOLUTION_NAV = [
    ['insurance-carriers', 'Insurance Carriers'],
    ['tpas', 'TPAs'],
    ['claims-adjusters', 'Claims Adjusters'],
    ['workers-compensation', 'Workers\u2019 Compensation'],
    ['ime-qme', 'IME / QME'],
    ['disability-claims', 'Disability Claims'],
    ['auto-bodily-injury', 'Auto / Bodily Injury'],
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function stripMd(s) {
    return s.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1').replace(/`(.+?)`/g, '$1')
        .replace(/\[(.+?)\]\(.+?\)/g, '$1').replace(/\s+/g, ' ').trim();
}

function parseFrontmatter(raw) {
    let md = raw.replace(/\r\n/g, '\n').trim();
    const meta = {};
    if (md.startsWith('---\n')) {
        const end = md.indexOf('\n---', 4);
        if (end !== -1) {
            const fm = md.slice(4, end);
            md = md.slice(end + 4).trim();
            for (const line of fm.split('\n')) {
                const m = line.match(/^([a-zA-Z]+):\s*(.*)$/);
                if (m) meta[m[1]] = m[2].trim().replace(/^"(.*)"$/, '$1');
            }
        }
    }
    return { meta, md };
}

// Pull "## FAQ" section out of the body: returns { bodyMd, faq: [{q, a}] }
function extractFaq(md) {
    const idx = md.search(/^## (FAQ|Frequently Asked Questions)\s*$/m);
    if (idx === -1) return { bodyMd: md, faq: [] };
    const before = md.slice(0, idx).trim();
    let faqMd = md.slice(idx).replace(/^## [^\n]*\n/, '');
    // Stop at the next H2 if any
    const nextH2 = faqMd.search(/^## /m);
    let after = '';
    if (nextH2 !== -1) { after = faqMd.slice(nextH2); faqMd = faqMd.slice(0, nextH2); }
    const faq = [];
    const parts = faqMd.split(/^### /m).slice(1);
    for (const part of parts) {
        const nl = part.indexOf('\n');
        const q = stripMd(part.slice(0, nl).trim());
        const a = stripMd(part.slice(nl + 1).trim());
        if (q && a) faq.push({ q, a });
    }
    return { bodyMd: [before, after].filter(Boolean).join('\n\n'), faq };
}

// Blog post title lookup (from generated blog HTML) for "Related reading"
function blogTitle(slug) {
    const file = path.join(ROOT, 'blog', `${slug}.html`);
    if (!fs.existsSync(file)) return null;
    const html = fs.readFileSync(file, 'utf8');
    const m = html.match(/<title>([^<|]*?)\s*\|/);
    return m ? m[1].trim().replace(/&amp;/g, '&').replace(/&#39;/g, "'") : slug;
}

function jsonLdBlocks(page) {
    const { url, title, description, faq, sectionLabel, h1 } = page;
    const fullTitle = `${title} | ${TITLE_SUFFIX}`;
    const breadcrumb = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
            { '@type': 'ListItem', position: 2, name: sectionLabel, item: `${SITE}/#solutions` },
            { '@type': 'ListItem', position: 3, name: h1, item: url },
        ],
    };
    const webPage = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: fullTitle,
        description,
        url,
        isPartOf: { '@type': 'WebSite', name: 'OctopusLM', url: `${SITE}/` },
        about: { '@type': 'SoftwareApplication', name: 'OctopusLM', url: `${SITE}/`, applicationCategory: 'MedicalApplication', operatingSystem: 'Web' },
        publisher: { '@type': 'Organization', name: 'Neopric Inc.', url: SITE, logo: { '@type': 'ImageObject', url: `${SITE}/logo.svg` } },
        dateModified: TODAY,
    };
    const faqLd = faq.length ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.map(f => ({
            '@type': 'Question', name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
    } : null;
    return [webPage, breadcrumb, faqLd].filter(Boolean)
        .map(o => `    <script type="application/ld+json">\n    ${JSON.stringify(o, null, 6)}\n    </script>`).join('\n');
}

const PAGE_CSS = `
        body { background-color: #0f172a; color: #e2e8f0; font-family: 'Inter', sans-serif; }
        .glass-card { background: linear-gradient(180deg, rgba(30,41,59,.7) 0%, rgba(15,23,42,.6) 100%); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,.08); transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease; }
        .glass-card:hover { transform: translateY(-4px); border-color: rgba(56,189,248,.3); box-shadow: 0 20px 40px -10px rgba(14,165,233,.15); }
        .hero-glow::before { content: ''; position: absolute; top: -180px; left: 50%; transform: translateX(-50%); width: 700px; height: 400px; background: radial-gradient(circle, rgba(14,165,233,.18) 0%, transparent 65%); pointer-events: none; z-index: 0; }
        .prose h2 { color: #fff; font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 1.75rem; margin: 2.75rem 0 1rem; }
        .prose h3 { color: #e0f2fe; font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 1.25rem; margin: 1.75rem 0 .75rem; }
        .prose p { color: #cbd5e1; line-height: 1.75; margin-bottom: 1.15rem; }
        .prose ul, .prose ol { color: #cbd5e1; margin: 0 0 1.25rem 1.5rem; }
        .prose ul { list-style: disc; } .prose ol { list-style: decimal; }
        .prose li { margin-bottom: .5rem; line-height: 1.7; }
        .prose strong { color: #fff; font-weight: 600; }
        .prose a { color: #38bdf8; text-decoration: underline; } .prose a:hover { color: #7dd3fc; }
        .prose blockquote { border-left: 4px solid #0ea5e9; padding-left: 1.25rem; margin: 1.5rem 0; color: #94a3b8; font-style: italic; }
        .prose table { width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; font-size: .9rem; }
        .prose th { background: rgba(30,41,59,.8); color: #fff; font-weight: 600; text-align: left; padding: .75rem 1rem; border: 1px solid rgba(255,255,255,.1); }
        .prose td { color: #cbd5e1; padding: .75rem 1rem; border: 1px solid rgba(255,255,255,.1); vertical-align: top; }
        .prose tr:nth-child(even) td { background: rgba(30,41,59,.3); }
        .prose hr { border-color: rgba(255,255,255,.1); margin: 2.5rem 0; }
        details summary { cursor: pointer; list-style: none; }
        details summary::-webkit-details-marker { display: none; }
        details[open] summary i { transform: rotate(180deg); }
`;

function headHtml(page) {
    const { url, title, description, keywords } = page;
    const fullTitle = escapeHtml(`${title} | ${TITLE_SUFFIX}`);
    const desc = escapeHtml(description);
    return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Primary Meta Tags -->
    <title>${fullTitle}</title>
    <meta name="title" content="${fullTitle}">
    <meta name="description" content="${desc}">
    <meta name="keywords" content="${escapeHtml(keywords)}">
    <meta name="author" content="Neopric Inc.">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
    <meta name="theme-color" content="#0f172a">
    <link rel="canonical" href="${url}">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${fullTitle}">
    <meta property="og:description" content="${desc}">
    <meta property="og:image" content="${SITE}/1.png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:site_name" content="OctopusLM">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="${url}">
    <meta property="twitter:title" content="${fullTitle}">
    <meta property="twitter:description" content="${desc}">
    <meta property="twitter:image" content="${SITE}/1.png">

    <!-- Favicons -->
    <link rel="icon" type="image/x-icon" href="../favicon/favicon.ico">
    <link rel="icon" type="image/svg+xml" href="../favicon/favicon.svg">
    <link rel="apple-touch-icon" sizes="180x180" href="../favicon/apple-touch-icon.png">

    <!-- Structured Data -->
${jsonLdBlocks(page)}

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@600;700;800&display=swap"
        rel="stylesheet">

    <!-- Tailwind -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: { sans: ['Inter', 'sans-serif'], heading: ['Outfit', 'sans-serif'] },
                    colors: {
                        brand: { 50: '#f0f9ff', 100: '#e0f2fe', 200: '#bae6fd', 300: '#7dd3fc', 400: '#38bdf8', 500: '#0ea5e9', 600: '#0284c7', 900: '#0c4a6e' },
                        dark: { 900: '#0f172a', 800: '#1e293b', 700: '#334155' }
                    }
                }
            }
        }
    </script>
    <style>${PAGE_CSS}    </style>
</head>
`;
}

function navHtml() {
    return `    <!-- ─── Nav ──────────────────────────────────────────────────────────── -->
    <nav class="sticky top-0 z-50 bg-dark-900/80 backdrop-blur-md border-b border-white/5">
        <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <a href="../index.html" class="flex items-center" aria-label="OctopusLM home">
                <span class="font-heading font-bold text-white text-xl tracking-tight">Octopus<span class="text-brand-400">LM</span></span>
            </a>
            <div class="flex items-center gap-6">
                <a href="../index.html#how-it-works" class="hidden sm:block text-sm text-gray-300 hover:text-white transition-colors">How it Works</a>
                <a href="../index.html#solutions" class="hidden sm:block text-sm text-gray-300 hover:text-white transition-colors">Solutions</a>
                <a href="../blog/index.html" class="hidden sm:block text-sm text-gray-300 hover:text-white transition-colors">Blog</a>
                <a href="../pricing.html" class="hidden sm:block text-sm text-gray-300 hover:text-white transition-colors">Pricing</a>
                <a href="https://app.octopuslm.co/login" class="text-sm text-gray-300 hover:text-white transition-colors">Log In</a>
                <a href="https://app.octopuslm.co/signup" class="px-4 py-2 bg-brand-500 hover:bg-brand-400 text-white text-sm font-semibold rounded-lg transition-colors">Try It Free</a>
            </div>
        </div>
    </nav>
`;
}

function faqSection(faq) {
    if (!faq.length) return '';
    return `
        <!-- ─── FAQ ──────────────────────────────────────────────────────── -->
        <section class="py-14 border-t border-white/5" aria-labelledby="faq-heading">
            <div class="max-w-3xl mx-auto px-6">
                <h2 id="faq-heading" class="font-heading font-bold text-white text-3xl mb-8">Frequently asked questions</h2>
                <div class="space-y-3">
${faq.map(f => `                    <details class="glass-card rounded-xl p-5">
                        <summary class="flex items-start justify-between gap-4 text-white font-semibold">
                            <span>${escapeHtml(f.q)}</span>
                            <i class="fa-solid fa-chevron-down text-brand-400 text-xs mt-1.5 transition-transform" aria-hidden="true"></i>
                        </summary>
                        <p class="mt-3 text-gray-300 text-sm leading-relaxed">${escapeHtml(f.a)}</p>
                    </details>`).join('\n')}
                </div>
            </div>
        </section>`;
}

function testimonialSection(show) {
    if (!show) return '';
    return `
        <!-- ─── Testimonial ──────────────────────────────────────────────── -->
        <section class="py-14 border-t border-white/5">
            <figure class="max-w-3xl mx-auto px-6 text-center">
                <i class="fa-solid fa-quote-left text-brand-400 text-2xl mb-4" aria-hidden="true"></i>
                <blockquote class="text-xl text-gray-100 leading-relaxed">“${escapeHtml(TESTIMONIAL.quote)}”</blockquote>
                <figcaption class="mt-5 text-sm text-gray-400"><span class="text-white font-semibold">${TESTIMONIAL.author}</span> — ${TESTIMONIAL.role}</figcaption>
            </figure>
        </section>`;
}

function relatedSection(related) {
    const items = related.map(s => ({ slug: s, title: blogTitle(s) })).filter(r => r.title);
    if (!items.length) return '';
    return `
        <!-- ─── Related reading ──────────────────────────────────────────── -->
        <section class="py-14 border-t border-white/5" aria-labelledby="related-heading">
            <div class="max-w-5xl mx-auto px-6">
                <h2 id="related-heading" class="font-heading font-bold text-white text-2xl mb-6">Related reading from the OctopusLM blog</h2>
                <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
${items.map(r => `                    <a href="../blog/${r.slug}.html" class="glass-card p-5 rounded-xl block">
                        <p class="text-xs uppercase tracking-wider text-brand-400 mb-2">Article</p>
                        <h3 class="text-white font-semibold leading-snug">${escapeHtml(r.title)}</h3>
                    </a>`).join('\n')}
                </div>
            </div>
        </section>`;
}

function otherSolutionsSection(slug) {
    const chip = (href, label) => `                    <a href="${href}" class="px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:border-brand-500/40 transition-colors">${escapeHtml(label)}</a>`;
    return `
        <!-- ─── Other solutions ──────────────────────────────────────────── -->
        <section class="py-14 border-t border-white/5" aria-labelledby="other-heading">
            <div class="max-w-5xl mx-auto px-6">
                <h2 id="other-heading" class="font-heading font-bold text-white text-2xl mb-6">OctopusLM for other teams</h2>
                <div class="flex flex-wrap gap-3 text-sm">
${SOLUTION_NAV.filter(([s]) => s !== slug).map(([s, label]) => chip(`../solutions/${s}.html`, label)).join('\n')}
${slug === 'octopuslm-vs-wisedocs' ? '' : chip('../compare/octopuslm-vs-wisedocs.html', 'vs Wisedocs')}
${chip('../roi-calculator.html', 'ROI calculator')}
                </div>
            </div>
        </section>`;
}

function bodyHtml(page) {
    const { h1, subtitle, eyebrow, contentHtml, faq, related, slug, testimonial, sectionLabel } = page;
    return `
<body class="antialiased">

${navHtml()}
    <main>
        <!-- ─── Hero ─────────────────────────────────────────────────────── -->
        <section class="relative hero-glow overflow-hidden">
            <div class="relative z-10 max-w-4xl mx-auto px-6 pt-16 pb-12">
                <nav class="text-sm text-gray-400 mb-6" aria-label="Breadcrumb">
                    <a href="../index.html" class="hover:text-brand-400 transition-colors">Home</a>
                    <span class="mx-2">/</span>
                    <a href="../index.html#solutions" class="hover:text-brand-400 transition-colors">${escapeHtml(sectionLabel)}</a>
                    <span class="mx-2">/</span>
                    <span class="text-white">${escapeHtml(eyebrow || h1)}</span>
                </nav>
                ${eyebrow ? `<p class="text-brand-400 text-sm font-semibold uppercase tracking-wider mb-3">${escapeHtml(eyebrow)}</p>` : ''}
                <h1 class="font-heading font-extrabold text-white text-4xl sm:text-5xl leading-tight tracking-tight">${escapeHtml(h1)}</h1>
                ${subtitle ? `<p class="mt-6 text-lg text-gray-300 max-w-2xl leading-relaxed">${escapeHtml(subtitle)}</p>` : ''}
                <div class="mt-8 flex flex-col sm:flex-row items-start gap-3">
                    <a href="https://app.octopuslm.co/signup" class="w-full sm:w-auto text-center px-7 py-3.5 bg-brand-500 hover:bg-brand-400 text-white font-semibold rounded-lg transition-colors">Try it on a real file</a>
                    <a href="https://outlook.office.com/book/OctopusLM15minDemo@neopric.com/" target="_blank" rel="noopener noreferrer" class="w-full sm:w-auto text-center px-7 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-lg transition-colors">Book a 15-minute demo</a>
                </div>
                <p class="mt-5 text-sm text-gray-500">1,000 free pages &nbsp;·&nbsp; $0.10/page, down to $0.04 &nbsp;·&nbsp; No subscription &nbsp;·&nbsp; HIPAA &amp; PIPEDA compliant &nbsp;·&nbsp; Web-based, nothing to install</p>
            </div>
        </section>

        <!-- ─── Content ──────────────────────────────────────────────────── -->
        <section class="py-10">
            <div class="max-w-3xl mx-auto px-6 prose">
${contentHtml}
            </div>
        </section>
${testimonialSection(testimonial)}
${faqSection(faq)}
${relatedSection(related)}
${otherSolutionsSection(slug)}

        <!-- ─── Closing CTA ──────────────────────────────────────────────── -->
        <section class="py-20 border-t border-white/5">
            <div class="max-w-2xl mx-auto px-6 text-center">
                <h2 class="font-heading font-bold text-white text-3xl mb-4">Run one real file.</h2>
                <p class="text-gray-400 mb-8">That's the fastest way to know if this is useful to you. Takes about five minutes, $0.10 a page.</p>
                <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a href="https://app.octopuslm.co/signup" class="inline-block px-8 py-3.5 bg-brand-500 hover:bg-brand-400 text-white font-semibold rounded-lg transition-colors">Try It Free</a>
                    <a href="../pricing.html" class="inline-block px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-lg transition-colors">See pricing</a>
                </div>
            </div>
        </section>
    </main>

${footerHtml()}
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" media="print" onload="this.media='all'">
</body>

</html>
`;
}

function footerHtml() {
    return `    <!-- ─── Footer ───────────────────────────────────────────────────────── -->
    <footer class="border-t border-white/5 py-10">
        <div class="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div class="text-gray-400 text-sm">
                <span class="font-heading font-bold text-white">Octopus<span class="text-brand-400">LM</span></span>
                — a product of <span class="text-gray-300">Neopric Inc.</span>
            </div>
            <div class="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
                <a href="../index.html#solutions" class="hover:text-white transition-colors">Solutions</a>
                <a href="../pricing.html" class="hover:text-white transition-colors">Pricing</a>
                <a href="../roi-calculator.html" class="hover:text-white transition-colors">ROI Calculator</a>
                <a href="../blog/index.html" class="hover:text-white transition-colors">Blog</a>
                <a href="../press/index.html" class="hover:text-white transition-colors">Press</a>
                <a href="../terms.html" class="hover:text-white transition-colors">Terms</a>
                <a href="https://outlook.office.com/book/OctopusLM15minDemo@neopric.com/" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors">Book a demo</a>
            </div>
        </div>
        <p class="text-center text-gray-600 text-xs mt-6">&copy; 2026 Neopric Inc. All rights reserved.</p>
    </footer>
`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
    ({ marked } = await import('marked'));
    marked.setOptions({ gfm: true, breaks: false });

    if (!fs.existsSync(MD_DIR)) {
        console.log(`No markdown folder found at ${MD_DIR}`);
        return;
    }

    const files = fs.readdirSync(MD_DIR).filter(f => f.endsWith('.md')).sort();
    const built = [];

    for (const file of files) {
        const raw = fs.readFileSync(path.join(MD_DIR, file), 'utf8');
        const { meta, md } = parseFrontmatter(raw);
        if (!meta.title || !meta.description) {
            console.error(`✗ ${file}: frontmatter needs title and description`);
            continue;
        }
        const slug = file.replace(/\.md$/, '');
        const outDir = meta.outDir === 'compare' ? 'compare' : 'solutions';
        const sectionLabel = outDir === 'compare' ? 'Compare' : 'Solutions';
        const { bodyMd, faq } = extractFaq(md);
        const url = `${SITE}/${outDir}/${slug}.html`;

        const page = {
            slug, url, outDir, sectionLabel, faq,
            title: meta.title,
            description: meta.description,
            h1: meta.h1 || meta.title,
            subtitle: meta.subtitle || '',
            eyebrow: meta.eyebrow || '',
            keywords: meta.keywords || `${meta.title}, OctopusLM, medical record review software, AI medical chronology`,
            testimonial: /^true$/i.test(meta.testimonial || ''),
            related: (meta.related || '').split(',').map(s => s.trim()).filter(Boolean),
            contentHtml: marked.parse(bodyMd),
        };

        const outPath = path.join(ROOT, outDir, `${slug}.html`);
        fs.mkdirSync(path.dirname(outPath), { recursive: true });
        fs.writeFileSync(outPath, headHtml(page) + bodyHtml(page));
        built.push({ url });
        console.log(`✓ ${outDir}/${slug}.html  (${faq.length} FAQ, ${page.related.length} related)`);
    }

    // Sitemap (add only URLs not already present)
    const sitemapPath = path.join(ROOT, 'sitemap.xml');
    let sitemap = fs.readFileSync(sitemapPath, 'utf8');
    const missing = built.filter(b => !sitemap.includes(`<loc>${b.url}</loc>`));
    if (missing.length) {
        const entries = missing.map(b => `  <url>
    <loc>${b.url}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
`).join('\n');
        sitemap = sitemap.replace('</urlset>', `${entries}\n</urlset>`);
        fs.writeFileSync(sitemapPath, sitemap);
        console.log(`✓ sitemap.xml updated with ${missing.length} new URL(s)`);
    } else {
        console.log('✓ sitemap.xml already up to date');
    }
}

main().catch(err => { console.error(err); process.exit(1); });

