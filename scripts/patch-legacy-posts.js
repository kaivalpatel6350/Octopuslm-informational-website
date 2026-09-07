#!/usr/bin/env node
/**
 * patch-legacy-posts.js
 * Idempotent SEO patch for the hand-written blog posts that have no markdown
 * source in blog/blog-md/ (so build-blog.js does not regenerate them).
 *
 *   - <title> gets the brand descriptor suffix
 *   - og:/twitter: descriptions are synced to each page's own meta description
 *   - nav/footer/CTA links point to pricing.html and include Solutions
 *   - BreadcrumbList JSON-LD is added
 *   - a "Put this into practice" block linking to /solutions/ is inserted
 *     before "Related Articles"
 *
 * Run: node scripts/patch-legacy-posts.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BLOG_DIR = path.join(ROOT, 'blog');
const SITE = 'https://octopuslm.co';
const TITLE_SUFFIX = 'OctopusLM Medical Chronology AI';

const SOLUTIONS = {
    'insurance-carriers': { title: 'For Insurance Carriers', blurb: 'Medical record review software for claims organizations.' },
    'tpas': { title: 'For TPAs', blurb: 'Consistent chronologies across every client program.' },
    'claims-adjusters': { title: 'For Claims Adjusters', blurb: 'Summarize a medical file before the first call.' },
    'workers-compensation': { title: 'Workers\u2019 Compensation', blurb: 'Workers\u2019 comp medical chronologies, WSIB and CNESST included.' },
    'ime-qme': { title: 'IME / QME Physicians', blurb: 'Independent medical evaluation record review, page-cited.' },
    'disability-claims': { title: 'Disability Claims', blurb: 'LTD, STD and SSDI files with long treatment histories.' },
    'auto-bodily-injury': { title: 'Auto / Bodily Injury', blurb: 'MVA and BI claims, including Ontario SABS and OCF forms.' },
};

// slug -> two most relevant solution pages
const LEGACY_POSTS = {
    'ai-medical-record-review': ['insurance-carriers', 'ime-qme'],
    'defensible-medical-chronologies': ['ime-qme', 'insurance-carriers'],
    'bradford-hill-criteria': ['insurance-carriers', 'auto-bodily-injury'],
    'hipaa-pipeda-compliance': ['insurance-carriers', 'tpas'],
    'documentation-gaps': ['claims-adjusters', 'disability-claims'],
    'cut-review-time-70-percent': ['tpas', 'claims-adjusters'],
    'deposition-preparation': ['ime-qme', 'auto-bodily-injury'],
    'marketing-lnc-practice': ['ime-qme', 'insurance-carriers'],
    'beyond-deduplication-medical-platforms': ['insurance-carriers', 'tpas'],
    'organizing-not-enough-personal-injury': ['auto-bodily-injury', 'claims-adjusters'],
};

function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function solutionCards(solutionSlugs) {
    return solutionSlugs.map(s => {
        const sol = SOLUTIONS[s];
        return `                    <a href="../solutions/${s}.html" class="glass-card p-6 rounded-xl group block">
                        <p class="text-xs uppercase tracking-wider text-brand-400 mb-2">OctopusLM for</p>
                        <h4 class="text-lg font-bold text-white mb-2 group-hover:text-brand-400 transition-colors">${escapeHtml(sol.title)}</h4>
                        <p class="text-sm text-gray-400">${escapeHtml(sol.blurb)}</p>
                    </a>`;
    }).join('\n');
}

function patch(slug, solutionSlugs) {
    const file = path.join(BLOG_DIR, `${slug}.html`);
    let html = fs.readFileSync(file, 'utf8');
    const before = html;
    const url = `${SITE}/blog/${slug}.html`;

    // 1. Title suffix
    html = html.replace(/<title>([^<]*?) \| OctopusLM<\/title>/, `<title>$1 | ${TITLE_SUFFIX}</title>`);

    // 2. Sync social descriptions to the page's own meta description
    const descMatch = html.match(/<meta name="description"\s+content="([^"]*)">/);
    if (descMatch) {
        const desc = descMatch[1];
        html = html.replace(/(<meta property="og:description"\s+content=")[^"]*(">)/, `$1${desc}$2`);
        html = html.replace(/(<meta property="twitter:description"\s+content=")[^"]*(">)/, `$1${desc}$2`);
    }

    // 3. Links: pricing anchor -> standalone pricing page
    html = html.replace(/\.\.\/index\.html#pricing/g, '../pricing.html');

    // 4. Nav: add Solutions after "How it Works" (desktop + mobile), once
    if (!html.includes('../index.html#solutions')) {
        html = html.replace(
            /(<a href="\.\.\/index\.html#how-it-works" class="hover:text-white transition-colors">How it Works<\/a>)/,
            `$1\n                        <a href="../index.html#solutions" class="hover:text-white transition-colors">Solutions</a>`
        );
        html = html.replace(
            /(<a href="\.\.\/index\.html#how-it-works" class="block text-gray-300 hover:text-white">How it Works<\/a>)/,
            `$1\n                    <a href="../index.html#solutions" class="block text-gray-300 hover:text-white">Solutions</a>`
        );
    }

    // 5. CTA copy: drop the unsourced "70%" line
    html = html.replace(
        /<p class="text-xl text-brand-100 mb-10">Start using AI to cut medical record review time by 70%<\/p>/,
        '<p class="text-xl text-brand-100 mb-10">Upload one real file. Get a page-cited summary and chronology in minutes. $0.10/page, no commitment.</p>'
    );

    // 6. BreadcrumbList JSON-LD (once)
    if (!html.includes('"BreadcrumbList"')) {
        const titleMatch = html.match(/<title>([^<|]*?)\s*\|/);
        const title = titleMatch ? titleMatch[1].trim().replace(/&amp;/g, '&') : slug;
        const breadcrumb = JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
                { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blog/` },
                { '@type': 'ListItem', position: 3, name: title, item: url },
            ],
        }, null, 6);
        html = html.replace('</head>', `    <script type="application/ld+json">\n    ${breadcrumb}\n    </script>\n</head>`);
    }

    // 7. Solutions block before Related Articles (once)
    if (!html.includes('Put this into practice')) {
        const block = `            <!-- Solutions (internal links to commercial landing pages) -->
            <div class="mt-16 pt-12 border-t border-white/10">
                <h3 class="text-2xl font-heading font-bold text-white mb-2">Put this into practice</h3>
                <p class="text-gray-400 mb-8">See how OctopusLM handles this kind of file in your workflow.</p>
                <div class="grid md:grid-cols-2 gap-6">
${solutionCards(solutionSlugs)}
                </div>
            </div>

`;
        const marker = html.match(/^[ \t]*<!-- Related (Posts|Articles) -->\n/m)
            || html.match(/^[ \t]*<div class="mt-16 pt-16 border-t border-white\/10">\n(?=[ \t]*<h3[^>]*>Related Articles)/m);
        if (marker) {
            html = html.replace(marker[0], block + marker[0]);
        } else {
            html = html.replace(/^[ \t]*<!-- CTA Section -->/m, block + '    <!-- CTA Section -->');
        }
    }

    if (html !== before) {
        fs.writeFileSync(file, html);
        console.log(`✓ patched ${slug}.html`);
    } else {
        console.log(`· ${slug}.html already up to date`);
    }
}

for (const [slug, sols] of Object.entries(LEGACY_POSTS)) patch(slug, sols);
