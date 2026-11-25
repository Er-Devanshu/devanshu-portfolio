# Er. Devanshu Tayal — Portfolio Website

The personal portfolio of **Er. Devanshu Tayal, Senior Tech Lead – Data & AI** (Aegis Soft Tech, Ahmedabad).
Live address: **https://www.devanshutayal.com**

This README explains everything about the project: what it is, how it is built, how content is edited, how it is
published, how quality and security are checked, and what was done while building it. Every folder inside `src/`,
`scripts/` and `.github/` also has its own README with the details for that folder.

> **Just want to change some text, a job, a certification or a photo?** Read [CONTENT-GUIDE.md](CONTENT-GUIDE.md).
> It is written for non-developers. You only ever edit JSON files in `src/content/`, then push.

---

## Contents

1. [What the site is](#1-what-the-site-is)
2. [How it works in one picture](#2-how-it-works-in-one-picture)
3. [Tech stack](#3-tech-stack)
4. [Folder map](#4-folder-map)
5. [Pages](#5-pages)
6. [Editing content](#6-editing-content)
7. [Running it on your computer](#7-running-it-on-your-computer)
8. [Publishing: push and it goes live](#8-publishing-push-and-it-goes-live)
9. [Quality checks](#9-quality-checks)
10. [Security](#10-security)
11. [SEO, sharing and AI search](#11-seo-sharing-and-ai-search)
12. [Accessibility](#12-accessibility)
13. [Performance](#13-performance)
14. [The CV](#14-the-cv)
15. [Design system](#15-design-system)
16. [Decisions and history](#16-decisions-and-history)
17. [Troubleshooting](#17-troubleshooting)

---

## 1. What the site is

A fast, static website (no server code, no database, no CMS) that presents Devanshu's work to recruiters, hiring
managers and consulting clients. It is open about availability: full-time, part-time, freelance and consulting.

- **All words, numbers, dates and links live in JSON files** in `src/content/`. Nothing important is hard-coded in
  the page code.
- **Some facts update themselves**: years of experience (counted from 9 Feb 2018), current job title and company,
  number of companies, certification list and count, and number of communities.
- **Publishing is automatic**: push to the `main` branch on GitHub, a GitHub Action builds the site and puts the
  finished files on the `hostinger` branch, and Hostinger pulls that branch into the live website.

## 2. How it works in one picture

```
 you edit src/content/*.json
            │  git push (main)
            ▼
 GitHub Actions (.github/workflows/build.yml)
   1. npm ci            install exact package versions
   2. npm run lint      code style checks
   3. npm run build     ├─ scripts/validate-content.mjs   (stops the build if content is broken)
                        ├─ vite build                     (React app → dist/)
                        ├─ scripts/build-cv.mjs           (CV PDF generated from the same content)
                        └─ scripts/prerender.mjs          (one HTML file per page + SEO files)
   4. publish dist/ → branch "hostinger"
            │  webhook
            ▼
 Hostinger Git deployment → public_html → https://www.devanshutayal.com
```

If any step fails, nothing is published and the live site keeps the previous version.

## 3. Tech stack

| Part | What we use | Why |
|---|---|---|
| UI | React 19 | Component model, fast, well known |
| Build tool | Vite 8 | Fast builds, code splitting per page |
| Routing | react-router-dom 7 | Clean URLs like `/experience` |
| Icons | lucide-react (+ hand-drawn LinkedIn/GitHub marks) | Consistent line icons |
| Fonts | @fontsource (self-hosted Inter, Instrument Serif, IBM Plex Mono) | No calls to Google, faster first paint |
| Styling | Plain CSS with design tokens (`src/styles/tokens.css`) | No framework, full control |
| Hosting | Hostinger (Apache) | Existing domain host |
| CI/CD | GitHub Actions + Hostinger Git deploy | Push to publish, no secrets needed |

There is no backend, no tracking, no cookies and no analytics.

## 4. Folder map

```
.
├── .github/                 GitHub Actions workflow and Dependabot  → .github/README.md
├── public/                  Files copied to the website as-is (see below)
│   ├── .htaccess            Apache rules: redirects, clean URLs, caching, security headers
│   ├── images/
│   │   ├── badges/          Official certification badges (Microsoft, Salesforce, AWS)
│   │   ├── covers/          Community cover images (800 px WebP)
│   │   ├── logo-dt.png      "DT" logo
│   │   └── portrait-*.webp  Portraits for Home, About, Contact (+ 640 px phone versions)
│   ├── og-image.jpg         1200×630 image shown when the link is shared on LinkedIn/WhatsApp/X
│   ├── favicon.png, apple-touch-icon.png, site.webmanifest, robots.txt
├── scripts/                 Build-time scripts (content checks, prerendering)  → scripts/README.md
├── src/                     The React app  → src/README.md
│   ├── content/             ★ All editable content (JSON)  → src/content/README.md
│   ├── components/          Reusable building blocks  → src/components/README.md
│   ├── pages/               One file per page  → src/pages/README.md
│   ├── layouts/             Header + main + footer frame  → src/layouts/README.md
│   ├── lib/                 Content loading and auto-calculated facts  → src/lib/README.md
│   ├── hooks/               Page title/SEO and scroll-reveal hooks  → src/hooks/README.md
│   └── styles/              Tokens, typography, global styles  → src/styles/README.md
├── index.html               HTML template (the prerender script fills it per page)
├── vite.config.js           Vite config (also detects whether the CV PDF exists)
├── eslint.config.js         Lint rules
├── CONTENT-GUIDE.md         How to edit content (for non-developers)
└── README.md                This file
```

**Why there is no README inside `public/`:** everything in `public/` is copied onto the live website, so a README
there would become a public web page. That folder is documented here instead.

### `public/` in detail

| File / folder | Purpose | Notes |
|---|---|---|
| `.htaccess` | Apache configuration for Hostinger | See [Security](#10-security) and [Performance](#13-performance). It is hidden (starts with a dot); keep it when uploading manually. |
| `images/badges/` | `microsoft-certified-associate.svg` (official Microsoft Associate badge, used for DP-600/700/800), `agentforce-specialist.png` (from Salesforce's badge pack), `aws-ai-practitioner.png` | Referenced from `credentials.json` → `logo`. |
| `images/covers/*-800.webp` | Community cover art, resized to 800 px wide | Referenced from `beyond.json` → `communities[].cover`. |
| `images/portrait-*.webp` | Finished portrait composites supplied by Devanshu | `-640` versions are served to phones via `srcset`. |
| `og-image.jpg` | Share preview image | Name, role and "Microsoft Fabric · Power BI · GenAI". Regenerate if the title changes. |
| `site.webmanifest` | Name and icons when saved to a phone home screen | |
| `robots.txt` | Lets all crawlers in and points to the sitemap | |

## 5. Pages

| URL | File | What it shows |
|---|---|---|
| `/` | `src/pages/HomePage.jsx` | Name, current role at Aegis, tagline with availability, Work with me / View my work / Download CV, six headline stats in one line, four client case studies with results, testimonials |
| `/about` | `AboutPage.jsx` | Intro, bio (with auto facts), background, interactive skills chart, professional skills, career list |
| `/experience` | `ExperiencePage.jsx` | Every role: years, title, company, dates, duration, summary, results (count up), bullets |
| `/projects` | `ProjectsPage.jsx` | Featured project + project cards with "What it shows", category filters with counts |
| `/beyond` | `BeyondPage.jsx` | Roles & recognition (Tableau Ambassador, Guest Faculty BITS, Packt reviewer), community cards |
| `/credentials` | `CredentialsPage.jsx` | Badge shelf, education, "What they cover" table |
| `/contact` | `ContactPage.jsx` | "Let's talk", availability line, location, LinkedIn, Email me, Copy email, CV, other profiles |
| anything else | `NotFoundPage.jsx` | Friendly 404 with quick links (real 404 status on the server) |

## 6. Editing content

All content is in `src/content/`:

| File | Controls |
|---|---|
| `site.json` | Name, role, tagline, photos, email, location, career start, stats, CV path, contact text, social links, SEO titles/descriptions |
| `about.json` | About intro, bio paragraphs, skills (groups → items with "use" lines) |
| `experience.json` | Roles, dates, summaries, results, bullets |
| `projects.json` | Project cards, categories, Home client case studies |
| `beyond.json` | Achievements/roles, communities, testimonials |
| `credentials.json` | Education and certifications (badge, what it covers, areas) |
| `navigation.json` | Menu links |

**Placeholders** you can type inside any text and that fill themselves in: `{years}`, `{role}`, `{company}`,
`{companies}`, `{certifications}`, `{certCount}`, `{communities}`. Full guide: [CONTENT-GUIDE.md](CONTENT-GUIDE.md)
and [src/content/README.md](src/content/README.md).

Workflow: edit JSON → `npm run check:content` (optional, the build does it too) → commit → push → live in ~2 minutes.

## 7. Running it on your computer

Requires **Node 22**.

```bash
npm install            # once, installs exact versions from package-lock.json
npm run dev            # local dev server with hot reload (http://localhost:5173)
npm run check:content  # validate the JSON content files
npm run lint           # code style checks (ESLint)
npm run build          # content check + production build into dist/ + prerendered pages
npm run preview        # serve the built dist/ (http://localhost:4173)
```

## 8. Publishing: push and it goes live

1. Push to `main`.
2. GitHub Actions (`.github/workflows/build.yml`) runs lint, the content check and the build, then force-publishes
   `dist/` to the **`hostinger`** branch. No passwords or secrets are used (only the built-in `GITHUB_TOKEN`).
3. Hostinger's Git deployment pulls the `hostinger` branch into `public_html` (via a webhook).

### One-time Hostinger setup (about 5 minutes)

Required before pushes go live. Until this is done, the domain keeps serving whatever is already in `public_html`.

1. **hPanel → Files → File Manager**: back up, then empty `public_html` (Hostinger deploys only into an empty folder).
2. **hPanel → Websites → Manage → Advanced → GIT**: create a repository
   - Repository: `https://github.com/Er-Devanshu/devanshu-portfolio.git`
   - Branch: `hostinger`
   - Directory: leave empty (deploys straight into `public_html`)
3. Click **Deploy** once.
4. Turn on **Auto Deployment** and copy the **Webhook URL**.
5. **GitHub → repo → Settings → Webhooks → Add webhook**: paste it as Payload URL, choose "Just the push event", save.
6. Make sure **SSL** is on for the domain (the site forces HTTPS).

### Manual fallback

`npm run build`, then upload **everything inside `dist/`** (including the hidden `.htaccess`) into `public_html`.

## 9. Quality checks

| Check | Where | What it catches |
|---|---|---|
| Content validator | `scripts/validate-content.mjs` (runs before every build) | Broken JSON, missing required fields, bad links (only `https://`, `/` or `mailto:` allowed), wrong date formats, more than one "Present" job, unknown `{placeholders}`, missing image files, image values that are not `/images/...` paths, unknown icon names, bad result directions, project categories not in the list |
| ESLint | `eslint.config.js` | Code mistakes, React hooks rules |
| `npm audit` | — | Known vulnerable packages (currently 0) |
| Dependabot | `.github/dependabot.yml` | Monthly update pull requests for npm packages and pinned GitHub Actions |

Before launch the site was reviewed by separate design, content/recruiter, HR, SEO/SEM, engineering/QA/accessibility
and security (penetration test) passes, and every finding was fixed.

## 10. Security

Configured in `public/.htaccess` and tested against a local Apache server:

- **HTTPS only**, one canonical host (`https://www.devanshutayal.com`); redirects use the fixed domain so a spoofed
  `Host` header cannot redirect visitors elsewhere.
- **Security headers on every response**: Content-Security-Policy (`script-src 'self'`, no third-party resources),
  Strict-Transport-Security, X-Content-Type-Options `nosniff`, Referrer-Policy, X-Frame-Options `SAMEORIGIN`,
  Permissions-Policy (camera/microphone/location off).
- **No directory listing**; folder addresses and hidden files are refused (403) and show the branded "Page not found" page; missing pages return a real 404.
- **No email address in the page**: "Email me" opens the mail app only on click and "Copy email" copies it, so bots
  that scan pages cannot harvest it. (It does appear inside the CV PDF, as a CV needs it.)
- **No secrets** anywhere; GitHub Actions are pinned to exact commit SHAs; the build job is read-only; only the
  publish job can write, and only to the `hostinger` branch.
- **Content is never rendered as raw HTML**, so text in JSON cannot inject script.

## 11. SEO, sharing and AI search

Generated by `scripts/prerender.mjs` at build time:

- **One real HTML file per page** with its own title (≤60 characters), description (≤160), canonical URL,
  Open Graph and Twitter tags (large image card), so link previews and crawlers see the right text without running
  JavaScript.
- **Structured data (JSON-LD)** describing the Person: name with "Er." as honorific and "Devanshu Tayal" as alternate
  name, job title, employer, Ahmedabad address, education, certifications, award, communities, skills, services
  offered (`makesOffer`) and social profiles.
- **`sitemap.xml`** (all pages + the CV), **`robots.txt`**, a real **404** page (noindex).
- **`llms.txt`**: a plain summary for AI assistants with a Facts block (role, location, availability, experience,
  certifications, CV link, contact).
- **Search Console / Bing**: paste verification codes into `site.json` → `seo.googleVerification` /
  `seo.bingVerification` and they are added to every page automatically.

## 12. Accessibility

- Skip link, landmarks, one `h1` per page, headings in order, focus moved to the new page's heading after navigation
  and announced to screen readers.
- Every image has alt text; every button and link has a name; visible focus outlines.
- Colour contrast checked (body and muted text pass WCAG AA).
- Keyboard support for the menu (Escape returns focus), testimonials (arrow keys), skills chart (arrows, Enter,
  Escape) and project filters.
- Animated numbers keep the real final value in the page text for screen readers and copy/paste.
- Everything animated respects the "reduce motion" setting.

## 13. Performance

- Each page's code loads only when visited (lazy routes); a stale-file reload guard handles deploys.
- Fonts are self-hosted Latin subsets with `font-display: swap`.
- Portraits use responsive `srcset` (640 px on phones); community covers are 800 px WebP; total images ~1 MB.
- Caching: build files under `/assets/` are cached for a year (their names change on every build), images for a
  week, HTML is always re-checked so new deploys appear immediately. Text files are gzip-compressed.

## 14. The CV

**The CV is generated from the website content on every build**, so it can never disagree with the site. Change a
job, number, certification or community in `src/content/` and push: the website and the CV update together.

- Script: `scripts/build-cv.mjs` (runs automatically in `npm run build`; on its own: `npm run build:cv` after a build).
- Output: `dist/cv/Devanshu-Tayal-CV.pdf` (the path comes from `site.json` → `cv`). It is not stored in the repo.
- Design: the same as Devanshu's own resume — serif type (Charis SIL, an open-licence version of Charter, bundled
  so it looks identical on every machine), green `#316C56` name and headings, olive-gold rules, dash bullets, bold
  right-aligned dates, italic job titles, US Letter.
- Content sources:

| CV section | Comes from |
|---|---|
| Name, contact line | `site.json` (name, location, email, LinkedIn and GitHub from `socials`) |
| Summary | `cv.json` → `summary` (CV-only text; placeholders work) |
| Core Technical Expertise | `about.json` skill groups |
| Professional Skills | `about.json` → `softSkills` |
| Experience | `experience.json`: title, company, dates, `highlights`, plus each result's `impact[].cv` sentence |
| Projects | `projects.json` items that have `points` (the Analytix platform and DataPilot) |
| Education, Certifications | `credentials.json` (official names: "Microsoft Certified: …", "Salesforce Certified …") |
| Leadership & Community | `beyond.json` achievements + `cv.json` → `communities` |

- A job bullet whose figures already appear in that company's client project is left out, so no number is said
  twice. CV bullets are written without "I".
- It is printed to PDF by headless Chrome (pre-installed on GitHub's build machines and on Macs; set `CHROME_PATH`
  if needed), then its document properties (Title, Author, Subject, Keywords) are set with `pdf-lib`.
- The text is real text in reading order, so ATS software reads each company with its dates, then its bullets.

## 15. Design system

Dark charcoal background (`#101415`), ivory text (`#f1ebe2`), orange accent (`#ef9148`); Instrument Serif for
headings, Inter for body text. All colours, spacing, radii and type sizes are tokens in `src/styles/tokens.css`. One
section-heading size (`--section-title`) is used everywhere. Details: [src/styles/README.md](src/styles/README.md).

## 16. Decisions and history

Key decisions made with Devanshu while building the site:

- **Content in JSON, not a CMS or Google Sheet**, so updates are a commit and a push.
- **Devanshu pushes to GitHub himself**; tooling never pushes without his say-so.
- **No visible email address** anywhere on the site; contact through LinkedIn, Email me (on click) or Copy email.
- **Name shown as "Er. Devanshu Tayal"**; current role Senior Tech Lead – Data & AI at Aegis Soft Tech (team of 10+).
- **Availability stated in words** (full-time, part-time, freelance, consulting), not as a badge.
- **Each number appears once per page**; results live with the work they came from.
- **Client work** (with results) is on Home and Experience; the Projects page is only for public, linked projects.
- **Certifications show official badges without external links**.
- **No serial numbers and no page-edge divider lines** anywhere.
- **Full testimonials**, exactly as written, with name and designation only.

## 17. Troubleshooting

| Problem | Fix |
|---|---|
| Red X in GitHub **Actions** | Open the failed run; the content check prints the file and field to fix |
| Pushed but the live site didn't change | Check the Hostinger one-time setup (section 8); check the webhook in GitHub settings |
| Build says "CV not built: Google Chrome … was not found" | Install Chrome locally or set `CHROME_PATH`; GitHub's build machines already have it |
| Download CV button missing | `site.json` → `cv` is empty |
| A new image doesn't show | Put it under `public/images/` and reference it as `/images/name.webp`; the build fails if the file is missing |
| Text shows `{something}` | Use only the placeholders listed in section 6; the build rejects unknown ones |
