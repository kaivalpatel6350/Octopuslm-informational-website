#!/usr/bin/env node
/**
 * build-blog.js
 * Reusable build script: converts markdown files in blog/blog-md/ into
 * full HTML pages in blog/, and appends cards to blog/index.html and
 * URLs to sitemap.xml.
 *
 * Safe to re-run: existing HTML pages are regenerated (kept in sync with
 * their markdown source), but index.html cards and sitemap.xml entries are
 * only added for NEW posts — no duplicates are created.
 *
 * To add a new blog post:
 *   1. Drop a new .md file into blog/blog-md/
 *   2. Run: node scripts/build-blog.js
 *
 * Markdown conventions supported:
 *   - Title from first "# H1" or frontmatter "title:"
 *   - Optional frontmatter: title, description, pubDate (YYYY-MM-DD)
 *   - Optional metadata lines: **Category:**, **Estimated Read Time:**
 */

const fs = require('fs');
const path = require('path');

// marked >= 13 ships ESM only; load it via dynamic import so this CommonJS
// script keeps working on Node versions without require(esm) support.
let marked;

const ROOT = path.resolve(__dirname, '..');
const MD_DIR = path.join(ROOT, 'blog', 'blog-md');
const BLOG_DIR = path.join(ROOT, 'blog');
const SITE = 'https://octopuslm.co';
const DEFAULT_DATE = '2026-08-18';

// ---------------------------------------------------------------------------
// Category mapping: internal category -> { label, color }
// ---------------------------------------------------------------------------
const CATEGORY_MAP = {
    'Direct Counters': { label: 'Record Review', color: 'brand' },
    'Their Gaps — Nobody Covers These': { label: 'Workflow', color: 'purple' },
    'Case-Type Series': { label: 'Case Types', color: 'green' },
    'Canada — All Three Competitors Ignore This': { label: 'Canadian Practice', color: 'red' },
    'Trust Posts — Your Strongest Theme': { label: 'Defensibility', color: 'yellow' },
    'AI Prompts': { label: 'AI Prompts', color: 'brand' },
};

// Brand descriptor appended to every <title> so "OctopusLM" is never shown
// bare (avoids conflation with Octopus CRM / Deploy / Energy in SERPs).
const TITLE_SUFFIX = 'OctopusLM Medical Chronology AI';

// ---------------------------------------------------------------------------
// Solutions pages (Phase 2 landing pages). Blog posts link to the ones that
// match their category and/or slug so the blog funnels into commercial pages,
// not only the generic pricing CTA.
// ---------------------------------------------------------------------------
const SOLUTIONS = {
    'insurance-carriers': { title: 'For Insurance Carriers', blurb: 'Medical record review software for claims organizations.' },
    'tpas': { title: 'For TPAs', blurb: 'Consistent chronologies across every client program.' },
    'claims-adjusters': { title: 'For Claims Adjusters', blurb: 'Summarize a medical file before the first call.' },
    'workers-compensation': { title: 'Workers\u2019 Compensation', blurb: 'Workers\u2019 comp medical chronologies, WSIB and CNESST included.' },
    'ime-qme': { title: 'IME / QME Physicians', blurb: 'Independent medical evaluation record review, page-cited.' },
    'disability-claims': { title: 'Disability Claims', blurb: 'LTD, STD and SSDI files with long treatment histories.' },
    'auto-bodily-injury': { title: 'Auto / Bodily Injury', blurb: 'MVA and BI claims, including Ontario SABS and OCF forms.' },
};

// slug substring -> solution slugs (first match wins, evaluated in order)
const SLUG_SOLUTION_RULES = [
    [/wsib|cnesst|workplace-injury/, ['workers-compensation', 'claims-adjusters']],
    [/sabs|ocf-18|lat-hearings|mva|slip-and-fall/, ['auto-bodily-injury', 'claims-adjusters']],
    [/ime|psychiatr|examiner|122-ime/, ['ime-qme', 'insurance-carriers']],
    [/chronic-pain|life-care/, ['disability-claims', 'insurance-carriers']],
    [/plaintiff|pi-lawyers|opposing-counsel/, ['auto-bodily-injury', 'ime-qme']],
];

// category fallback
const CATEGORY_SOLUTIONS = {
    'Direct Counters': ['insurance-carriers', 'ime-qme'],
    'Their Gaps — Nobody Covers These': ['claims-adjusters', 'ime-qme'],
    'Case-Type Series': ['claims-adjusters', 'disability-claims'],
    'Canada — All Three Competitors Ignore This': ['workers-compensation', 'auto-bodily-injury'],
    'Trust Posts — Your Strongest Theme': ['insurance-carriers', 'ime-qme'],
    'AI Prompts': ['ime-qme', 'insurance-carriers'],
};

function solutionsForPost(post) {
    for (const [re, slugs] of SLUG_SOLUTION_RULES) {
        if (re.test(post.slug)) return slugs;
    }
    return CATEGORY_SOLUTIONS[post.category] || CATEGORY_SOLUTIONS['AI Prompts'];
}

const COLOR_CLASSES = {
    brand: 'bg-brand-500/20 border-brand-500/30 text-brand-300',
    purple: 'bg-purple-500/20 border-purple-500/30 text-purple-300',
    green: 'bg-green-500/20 border-green-500/30 text-green-300',
    red: 'bg-red-500/20 border-red-500/30 text-red-300',
    yellow: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function slugFromFilename(filename) {
    let base = filename.replace(/\.md$/, '');
    // Strip numeric series prefix 01- through 21-
    if (/^(0\d|1\d|2[01])-/.test(base)) base = base.replace(/^\d{2}-/, '');
    // Strip "blog-" prefix
    base = base.replace(/^blog-/, '');
    return base;
}

function escapeHtml(s) {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function escapeAttr(s) {
    return escapeHtml(s);
}

function stripMd(s) {
    return s
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/`(.+?)`/g, '$1')
        .replace(/\[(.+?)\]\(.+?\)/g, '$1')
        .replace(/\s+/g, ' ')
        .trim();
}

function truncate(s, n) {
    if (s.length <= n) return s;
    return s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…';
}

function formatDate(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[m - 1]} ${d}, ${y}`;
}

// ---------------------------------------------------------------------------
// Parse a markdown file into { title, category, readTime, date, description, bodyMd }
// ---------------------------------------------------------------------------
function parsePost(raw, filename) {
    let md = raw.replace(/\r\n/g, '\n').trim();
    const meta = {
        title: null,
        category: 'AI Prompts',
        readTime: null,
        date: DEFAULT_DATE,
        description: null,
        tags: [],
    };

    // Frontmatter
    if (md.startsWith('---\n')) {
        const end = md.indexOf('\n---', 4);
        if (end !== -1) {
            const fm = md.slice(4, end);
            md = md.slice(end + 4).trim();
            const get = (key) => {
                const m = fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
                return m ? m[1].trim().replace(/^"(.*)"$/, '$1') : null;
            };
            if (get('title')) meta.title = get('title');
            if (get('description')) meta.description = get('description');
            if (get('pubDate')) meta.date = get('pubDate');
            if (get('keywords')) meta.keywords = get('keywords');
        }
    }

    // Title from first H1
    const h1 = md.match(/^#\s+(.+)$/m);
    if (h1) {
        if (!meta.title) meta.title = stripMd(h1[1]);
        md = md.replace(h1[0], '').trim();
    }

    // Metadata block (**Category:** ... etc.)
    const cat = md.match(/^\*\*Category:\*\*\s*(.+?)\s*$/m);
    if (cat) meta.category = cat[1].trim();
    const rt = md.match(/^\*\*Estimated Read Time:\*\*\s*(\d+)\s*minutes?\s*$/m);
    if (rt) meta.readTime = `${rt[1]} min read`;

    // Remove the metadata block lines
    md = md
        .replace(/^\*\*Category:\*\*.*$/m, '')
        .replace(/^\*\*Target Audience:\*\*.*$/m, '')
        .replace(/^\*\*Estimated Read Time:\*\*.*$/m, '')
        .trim();

    // Remove leading horizontal rule(s)
    md = md.replace(/^(---\s*\n)+/, '').trim();

    // Remove trailing placeholder footer block, e.g.:
    //   *Published: [Date]*
    //   *Author: [Your Name]*
    //   *Category: ...*
    //   *Tags: ...*
    // (possibly preceded by a horizontal rule)
    md = md.replace(/(\n---\s*)?\n\*Published:[^\n]*\n(\*(Author|Category|Tags):[^\n]*\n?)*\s*$/i, '').trim();
    // Remove any leftover trailing horizontal rule(s)
    md = md.replace(/(\n---\s*)+$/, '').trim();

    // Description: first meaningful paragraph
    if (!meta.description) {
        const lines = md.split('\n');
        let para = [];
        for (const line of lines) {
            const t = line.trim();
            if (!t) { if (para.length) break; continue; }
            if (t.startsWith('#') || t === '---' || t.startsWith('|') || t.startsWith('```')) {
                if (para.length) break; continue;
            }
            para.push(t);
        }
        meta.description = truncate(stripMd(para.join(' ')), 160);
    }

    // Read time fallback: word count / 200 wpm
    if (!meta.readTime) {
        const words = md.split(/\s+/).length;
        meta.readTime = `${Math.max(3, Math.round(words / 200))} min read`;
    }

    return { ...meta, bodyMd: md };
}

// ---------------------------------------------------------------------------
// HTML template
// ---------------------------------------------------------------------------
function pageHtml(post, relatedPosts) {
    const catInfo = CATEGORY_MAP[post.category] || CATEGORY_MAP['AI Prompts'];
    const colorCls = COLOR_CLASSES[catInfo.color];
    const url = `${SITE}/blog/${post.slug}.html`;
    const titleEsc = escapeAttr(post.title);
    const descEsc = escapeAttr(post.description);
    const shortTitle = truncate(post.title, 60);

    const jsonLd = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.description,
        author: { '@type': 'Organization', name: 'OctopusLM' },
        datePublished: post.date,
        dateModified: post.date,
        image: `${SITE}/1.png`,
        mainEntityOfPage: url,
        publisher: {
            '@type': 'Organization',
            name: 'Neopric Inc.',
            logo: { '@type': 'ImageObject', url: `${SITE}/logo.svg` },
        },
    }, null, 6);

    const breadcrumbLd = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blog/` },
            { '@type': 'ListItem', position: 3, name: post.title, item: url },
        ],
    }, null, 6);

    const solutionSlugs = solutionsForPost(post);
    const solutionsHtml = solutionSlugs.map(s => {
        const sol = SOLUTIONS[s];
        return `                    <a href="../solutions/${s}.html" class="glass-card p-6 rounded-xl group block">
                        <p class="text-xs uppercase tracking-wider text-brand-400 mb-2">OctopusLM for</p>
                        <h4 class="text-lg font-bold text-white mb-2 group-hover:text-brand-400 transition-colors">${escapeHtml(sol.title)}</h4>
                        <p class="text-sm text-gray-400">${escapeHtml(sol.blurb)}</p>
                    </a>`;
    }).join('\n');

    const bodyHtml = marked.parse(post.bodyMd);

    const relatedHtml = relatedPosts.map(rp => `                    <a href="${rp.slug}.html" class="glass-card p-6 rounded-xl group">
                        <h4 class="text-lg font-bold text-white mb-2 group-hover:text-brand-400 transition-colors">${escapeHtml(truncate(rp.title, 70))}</h4>
                        <p class="text-sm text-gray-400">${escapeHtml(truncate(rp.description, 110))}</p>
                    </a>`).join('\n');

    return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Primary Meta Tags -->
    <title>${titleEsc} | ${TITLE_SUFFIX}</title>
    <meta name="title" content="${titleEsc}">
    <meta name="description" content="${descEsc}">
    <meta name="keywords" content="${escapeAttr(post.keywords)}">
    <meta name="author" content="OctopusLM Team">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${url}">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${titleEsc}">
    <meta property="og:description" content="${descEsc}">
    <meta property="og:image" content="${SITE}/1.png">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="${url}">
    <meta property="twitter:title" content="${titleEsc}">
    <meta property="twitter:description" content="${descEsc}">
    <meta property="twitter:image" content="${SITE}/1.png">

    <!-- Schema.org BlogPosting -->
    <script type="application/ld+json">
    ${jsonLd}
    </script>
    <script type="application/ld+json">
    ${breadcrumbLd}
    </script>

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="../favicon/favicon.svg">
    <link rel="icon" type="image/x-icon" href="../favicon/favicon.ico">
    <link rel="apple-touch-icon" sizes="180x180" href="../favicon/apple-touch-icon.png">

    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@500;600;700&display=swap"
        rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        heading: ['Outfit', 'sans-serif'],
                    },
                    colors: {
                        brand: {
                            50: '#f0f9ff',
                            100: '#e0f2fe',
                            400: '#38bdf8',
                            500: '#0ea5e9',
                            600: '#0284c7',
                            900: '#0c4a6e',
                        },
                        dark: {
                            900: '#0f172a',
                            800: '#1e293b',
                            700: '#334155',
                        }
                    }
                }
            }
        }
    </script>
    <style>
        body {
            background-color: #0f172a;
            color: #f8fafc;
            overflow-x: hidden;
        }

        .glass-panel {
            background: rgba(30, 41, 59, 0.4);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .glass-card {
            background: linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.6) 100%);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .glass-card:hover {
            transform: translateY(-5px);
            border-color: rgba(56, 189, 248, 0.3);
            box-shadow: 0 20px 40px -10px rgba(14, 165, 233, 0.15);
        }

        .text-gradient {
            background: linear-gradient(135deg, #38bdf8 0%, #818cf8 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .prose h2 {
            color: #fff;
            font-size: 1.875rem;
            font-weight: 700;
            margin-top: 2.5rem;
            margin-bottom: 1.25rem;
            font-family: 'Outfit', sans-serif;
        }

        .prose h3 {
            color: #e0f2fe;
            font-size: 1.5rem;
            font-weight: 600;
            margin-top: 2rem;
            margin-bottom: 1rem;
            font-family: 'Outfit', sans-serif;
        }

        .prose h4 {
            color: #e0f2fe;
            font-size: 1.25rem;
            font-weight: 600;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
            font-family: 'Outfit', sans-serif;
        }

        .prose p {
            color: #cbd5e1;
            line-height: 1.75;
            margin-bottom: 1.25rem;
        }

        .prose ul,
        .prose ol {
            color: #cbd5e1;
            margin-left: 1.5rem;
            margin-bottom: 1.25rem;
            list-style: disc;
        }

        .prose ol {
            list-style: decimal;
        }

        .prose li {
            margin-bottom: 0.5rem;
        }

        .prose strong {
            color: #fff;
            font-weight: 600;
        }

        .prose a {
            color: #38bdf8;
            text-decoration: underline;
        }

        .prose a:hover {
            color: #7dd3fc;
        }

        .prose hr {
            border-color: rgba(255, 255, 255, 0.1);
            margin: 2.5rem 0;
        }

        .prose blockquote {
            border-left: 4px solid #0ea5e9;
            padding-left: 1.25rem;
            margin: 1.5rem 0;
            color: #94a3b8;
            font-style: italic;
        }

        .prose code {
            background: rgba(30, 41, 59, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 0.375rem;
            padding: 0.125rem 0.375rem;
            font-size: 0.875em;
            color: #7dd3fc;
        }

        .prose pre {
            background: rgba(15, 23, 42, 0.9);
            border: 1px solid rgba(56, 189, 248, 0.2);
            border-radius: 0.75rem;
            padding: 1.25rem;
            margin-bottom: 1.5rem;
            overflow-x: auto;
        }

        .prose pre code {
            background: none;
            border: none;
            padding: 0;
            color: #bae6fd;
            font-size: 0.875rem;
            line-height: 1.6;
            white-space: pre-wrap;
        }

        .prose table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 1.5rem;
            font-size: 0.875rem;
        }

        .prose table th {
            background: rgba(30, 41, 59, 0.8);
            color: #fff;
            font-weight: 600;
            text-align: left;
            padding: 0.75rem 1rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .prose table td {
            color: #cbd5e1;
            padding: 0.75rem 1rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
            vertical-align: top;
        }

        .prose table tr:nth-child(even) td {
            background: rgba(30, 41, 59, 0.3);
        }
    </style>
</head>

<body class="antialiased selection:bg-brand-500 selection:text-white">

    <!-- Background Gradients -->
    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div class="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px]">
        </div>
        <div class="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]">
        </div>
    </div>

    <!-- Navigation -->
    <nav class="fixed w-full z-50 transition-all duration-300" id="navbar">
        <div class="glass-panel border-b border-white/5 bg-dark-900/90 backdrop-blur-md">
            <div class="max-w-7xl mx-auto px-6 py-4">
                <div class="flex justify-between items-center">
                    <a href="../index.html" class="flex items-center space-x-3">
                        <span class="text-xl font-heading font-bold tracking-tight text-white">Octopus<span
                                class="text-brand-400">LM</span></span>
                    </a>

                    <div class="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
                        <a href="../index.html#how-it-works" class="hover:text-white transition-colors">How it Works</a>
                        <a href="../index.html#solutions" class="hover:text-white transition-colors">Solutions</a>
                        <a href="index.html" class="text-brand-400 transition-colors">Blog</a>
                        <a href="../press/index.html" class="hover:text-white transition-colors">Press</a>
                        <a href="../pricing.html" class="hover:text-white transition-colors">Pricing</a>
                        <a href="https://app.octopuslm.co/login" class="hover:text-white transition-colors">Log In</a>
                    </div>

                    <div class="flex items-center gap-4">
                        <a href="https://app.octopuslm.co/signup"
                            class="hidden md:block px-5 py-2 bg-brand-500 hover:bg-brand-400 text-white text-sm font-semibold rounded-lg transition-colors">
                            Try It Free
                        </a>
                        <button id="mobile-menu-btn" class="md:hidden text-white focus:outline-none p-2"
                            aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="mobile-menu">
                            <i class="fa-solid fa-bars text-2xl"></i>
                        </button>
                    </div>
                </div>

                <!-- Mobile Menu -->
                <div id="mobile-menu" class="hidden md:hidden mt-4 pb-4 border-t border-white/10 pt-4 space-y-4">
                    <a href="../index.html#how-it-works" class="block text-gray-300 hover:text-white">How it Works</a>
                    <a href="../index.html#solutions" class="block text-gray-300 hover:text-white">Solutions</a>
                    <a href="index.html" class="block text-gray-300 hover:text-white">Blog</a>
                    <a href="../press/index.html" class="block text-gray-300 hover:text-white">Press</a>
                    <a href="../pricing.html" class="block text-gray-300 hover:text-white">Pricing</a>
                    <a href="https://app.octopuslm.co/login" class="block text-gray-300 hover:text-white">Log In</a>
                    <a href="https://app.octopuslm.co/signup"
                        class="block w-full text-center px-5 py-3 bg-brand-500 hover:bg-brand-400 text-white font-semibold rounded-lg transition-colors">
                        Try It Free
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <script>
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
                const icon = mobileMenuBtn.querySelector('i');
                if (mobileMenu.classList.contains('hidden')) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                } else {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-xmark');
                }
            });
        }
    </script>

    <!-- Article -->
    <article class="relative z-10 pt-40 pb-24">
        <div class="max-w-4xl mx-auto px-6">
            <!-- Breadcrumbs -->
            <nav class="text-sm text-gray-400 mb-8">
                <a href="../index.html" class="hover:text-brand-400 transition-colors">Home</a>
                <span class="mx-2">/</span>
                <a href="index.html" class="hover:text-brand-400 transition-colors">Blog</a>
                <span class="mx-2">/</span>
                <span class="text-white">${escapeHtml(shortTitle)}</span>
            </nav>

            <!-- Category & Title -->
            <div
                class="inline-block px-3 py-1 rounded-full ${colorCls.split(' ')[0]} border ${colorCls.split(' ').slice(1).join(' ')} text-xs font-medium uppercase tracking-wider mb-6">
                ${escapeHtml(catInfo.label)}
            </div>

            <h1 class="text-4xl lg:text-5xl font-heading font-bold leading-tight text-white mb-6">
                ${escapeHtml(post.title)}
            </h1>

            <div class="flex items-center gap-6 text-sm text-gray-400 mb-12 pb-8 border-b border-white/10">
                <div class="flex items-center gap-2">
                    <i class="fa-regular fa-calendar"></i>
                    <span>${formatDate(post.date)}</span>
                </div>
                <div class="flex items-center gap-2">
                    <i class="fa-regular fa-clock"></i>
                    <span>${post.readTime}</span>
                </div>
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-user"></i>
                    <span>OctopusLM Team</span>
                </div>
            </div>

            <!-- Article Content -->
            <div class="prose max-w-none">
${bodyHtml}
            </div>

            <!-- Solutions (internal links to commercial landing pages) -->
            <div class="mt-16 pt-12 border-t border-white/10">
                <h3 class="text-2xl font-heading font-bold text-white mb-2">Put this into practice</h3>
                <p class="text-gray-400 mb-8">See how OctopusLM handles this kind of file in your workflow.</p>
                <div class="grid md:grid-cols-2 gap-6">
${solutionsHtml}
                </div>
            </div>

            <!-- Related Posts -->
            <div class="mt-16 pt-16 border-t border-white/10">
                <h3 class="text-2xl font-heading font-bold text-white mb-8">Related Articles</h3>
                <div class="grid md:grid-cols-3 gap-6">
${relatedHtml}
                </div>
            </div>
        </div>
    </article>

    <!-- CTA Section -->
    <section class="relative z-10 py-24 overflow-hidden">
        <div class="absolute inset-0 bg-brand-600">
            <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent"></div>
        </div>
        <div class="max-w-4xl mx-auto px-6 relative z-10 text-center">
            <h2 class="text-4xl md:text-5xl font-heading font-bold text-white mb-6">Ready to transform your workflow?
            </h2>
            <p class="text-xl text-brand-100 mb-10">Upload one real file. Get a page-cited summary and chronology in minutes. $0.10/page, no commitment.</p>
            <a href="../pricing.html"
                class="inline-block bg-white text-brand-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-brand-50 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                Start Free Trial
            </a>
        </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-white/10 bg-dark-900 pt-16 pb-8 relative z-10">
        <div class="max-w-7xl mx-auto px-6">
            <div class="grid md:grid-cols-4 gap-12 mb-12">
                <div class="col-span-2">
                    <div class="flex items-center space-x-3 mb-4">
                        <span class="text-xl font-heading font-bold tracking-tight text-white">Octopus<span
                                class="text-brand-400">LM</span></span>
                    </div>
                    <p class="text-gray-400 text-sm leading-relaxed max-w-xs mb-4">
                        OctopusLM is web-based, HIPAA/PIPEDA compliant AI medical record review software.
                        Page-cited summaries and chronologies for medical-legal and claims professionals.
                    </p>
                    <h4 class="text-white font-semibold mb-3 mt-6">Solutions</h4>
                    <ul class="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-400 max-w-sm">
${Object.entries(SOLUTIONS).map(([s, sol]) => `                        <li><a href="../solutions/${s}.html" class="hover:text-brand-400 transition-colors">${escapeHtml(sol.title)}</a></li>`).join('\n')}
                    </ul>
                </div>
                <div>
                    <h4 class="text-white font-semibold mb-4">Product</h4>
                    <ul class="space-y-2 text-sm text-gray-400">
                        <li><a href="../index.html#how-it-works" class="hover:text-brand-400 transition-colors">How it Works</a></li>
                        <li><a href="../index.html#demo" class="hover:text-brand-400 transition-colors">Demo</a></li>
                        <li><a href="../pricing.html" class="hover:text-brand-400 transition-colors">Pricing</a></li>
                        <li><a href="../roi-calculator.html" class="hover:text-brand-400 transition-colors">ROI Calculator</a></li>
                        <li><a href="../compare/octopuslm-vs-wisedocs.html" class="hover:text-brand-400 transition-colors">vs Wisedocs</a></li>
                        <li><a href="index.html" class="hover:text-brand-400 transition-colors">Blog</a></li>
                        <li><a href="../press/index.html" class="hover:text-brand-400 transition-colors">Press</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-white font-semibold mb-4">Company</h4>
                    <ul class="space-y-2 text-sm text-gray-400">
                        <li><a href="../terms.html" class="hover:text-brand-400 transition-colors">Terms of Service</a></li>
                        <li><a href="https://outlook.office.com/book/OctopusLM15minDemo@neopric.com/" target="_blank"
                                rel="noopener noreferrer" class="hover:text-brand-400 transition-colors">Book a Demo</a></li>
                        <li><a href="https://www.linkedin.com/company/clinexa-co" target="_blank"
                                rel="noopener noreferrer" class="hover:text-brand-400 transition-colors">LinkedIn</a></li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p class="text-gray-500 text-xs">© 2026 Neopric Inc, Canada. All rights reserved.</p>
            </div>
        </div>
    </footer>

</body>

</html>
`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
    ({ marked } = await import('marked'));
    marked.setOptions({ gfm: true, breaks: false });

    if (!fs.existsSync(MD_DIR)) {
        console.log(`No markdown folder found at ${MD_DIR} — create it and add .md files to publish new posts.`);
        return;
    }
    const files = fs.readdirSync(MD_DIR).filter(f => f.endsWith('.md')).sort();
    const posts = [];

    for (const file of files) {
        const raw = fs.readFileSync(path.join(MD_DIR, file), 'utf8');
        const parsed = parsePost(raw, file);
        const slug = slugFromFilename(file);
        const keywords = parsed.keywords
            || `${parsed.title.toLowerCase()}, medical record review software, AI medical chronology, IME medical record review, legal nurse consultant, OctopusLM`;
        posts.push({ ...parsed, slug, keywords, file });
    }

    // Generate each page with 3 related posts (same category preferred)
    for (const post of posts) {
        const sameCat = posts.filter(p => p !== post && p.category === post.category);
        const others = posts.filter(p => p !== post && p.category !== post.category);
        const related = [...sameCat, ...others].slice(0, 3);
        const html = pageHtml(post, related);
        const outPath = path.join(BLOG_DIR, `${post.slug}.html`);
        fs.writeFileSync(outPath, html);
        console.log(`✓ ${post.slug}.html  (${post.readTime}, ${CATEGORY_MAP[post.category] ? CATEGORY_MAP[post.category].label : 'AI Prompts'})`);
    }

    // ------------------------------------------------------------------
    // Update blog/index.html (only add cards for posts not already listed)
    // ------------------------------------------------------------------
    const indexPath = path.join(BLOG_DIR, 'index.html');
    let indexHtml = fs.readFileSync(indexPath, 'utf8');

    const newForIndex = posts.filter(post => !indexHtml.includes(`window.location.href='${post.slug}.html'`));
    const cards = newForIndex.map(post => {
        const catInfo = CATEGORY_MAP[post.category] || CATEGORY_MAP['AI Prompts'];
        const colorCls = COLOR_CLASSES[catInfo.color];
        return `                <!-- ${post.slug} -->
                <article class="glass-card p-6 rounded-2xl group cursor-pointer"
                    onclick="window.location.href='${post.slug}.html'">
                    <div
                        class="inline-block px-3 py-1 rounded-full ${colorCls.split(' ')[0]} border ${colorCls.split(' ').slice(1).join(' ')} text-xs font-medium uppercase tracking-wider mb-4">
                        ${escapeHtml(catInfo.label)}
                    </div>
                    <h2 class="text-2xl font-heading font-bold text-white mb-3 group-hover:text-brand-400 transition-colors">
                        ${escapeHtml(post.title)}
                    </h2>
                    <p class="text-gray-400 text-sm leading-relaxed mb-4">
                        ${escapeHtml(truncate(post.description, 150))}
                    </p>
                    <div class="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-white/10">
                        <span><i class="fa-regular fa-calendar mr-2"></i>${formatDate(post.date).replace(/(\w+) (\d+), (\d+)/, (m, mo, d, y) => mo.slice(0, 3) + ' ' + d + ', ' + y)}</span>
                        <span><i class="fa-regular fa-clock mr-2"></i>${post.readTime}</span>
                    </div>
                </article>`;
    }).join('\n\n');

    const indexMarker = '\n            </div>\n        </div>\n    </section>\n\n    <!-- CTA Section -->';
    if (newForIndex.length === 0) {
        console.log('✓ blog/index.html already up to date (no new cards needed)');
    } else if (!indexHtml.includes(indexMarker)) {
        console.error('✗ index.html marker not found — cards not inserted');
    } else {
        indexHtml = indexHtml.replace(indexMarker, `\n${cards}\n${indexMarker}`);
        fs.writeFileSync(indexPath, indexHtml);
        console.log(`✓ blog/index.html updated with ${newForIndex.length} new card(s)`);
    }

    // ------------------------------------------------------------------
    // Update sitemap.xml (only add URLs not already listed)
    // ------------------------------------------------------------------
    const sitemapPath = path.join(ROOT, 'sitemap.xml');
    let sitemap = fs.readFileSync(sitemapPath, 'utf8');
    const newForSitemap = posts.filter(post => !sitemap.includes(`<loc>${SITE}/blog/${post.slug}.html</loc>`));
    if (newForSitemap.length === 0) {
        console.log('✓ sitemap.xml already up to date (no new URLs needed)');
    } else {
        const entries = newForSitemap.map(post => `  <url>
    <loc>${SITE}/blog/${post.slug}.html</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`).join('\n');

        sitemap = sitemap.replace('</urlset>', `${entries}\n</urlset>`);
        fs.writeFileSync(sitemapPath, sitemap);
        console.log(`✓ sitemap.xml updated with ${newForSitemap.length} new URL(s)`);
    }
}

main().catch(err => { console.error(err); process.exit(1); });
