# `scripts/` — build-time scripts

Two Node scripts that run automatically as part of `npm run build`. They never run in the visitor's browser.

| Script | Runs | Purpose |
|---|---|---|
| `validate-content.mjs` | **before** the build (`prebuild`) and with `npm run check:content` | Stops the build if any content file is broken |
| `build-cv.mjs` | **after** the build (`postbuild`), before prerender | Generates the CV PDF from the content (see below) |
| `prerender.mjs` | **after** the build (`postbuild`) | Writes one SEO-ready HTML file per page, plus the 404, sitemap and llms.txt |

---

## `validate-content.mjs` — content safety net

Reads every JSON file in `src/content/` and prints friendly errors. If there is any error the build stops, so a
mistake can never reach the live site. Warnings (like a missing CV) don't stop the build.

What it checks:

| Area | Rule |
|---|---|
| All files | Valid JSON |
| Required text | Fields like `name`, `role`, `email`, `careerStart`, role titles, companies, periods, community names must be non-empty text |
| Lists | Required lists (roles, highlights, socials, education, certifications…) must have at least one item |
| Links | Must start with `https://`, `/` or `mailto:` (so `javascript:`, `http://` or `//evil.com` are rejected) |
| Dates | `careerStart` like `2018-02-09`; job periods like `Jan 2022 – Jan 2026` or `Jul 2026 – Present`; achievement periods must contain a year |
| Current job | Only one role may end in "Present" (it drives `{role}` and `{company}`) |
| Results | Each `impact` entry needs a value and label; `direction` must be `up` or `down` |
| Projects | `category` must be one of `categories`; `shows` must be text if present; a link is required unless the project has a `client` (client work has no public link); `points` (CV bullets) must be a list |
| Skills | Each skill item needs a `name` and a `use` line |
| Images | Any `logo`, `cover`, `image` or `photo…` value that looks like a path must be `/images/...` **and** the file must exist in `public/` (bare names like a project cover style `"fraud"` are allowed) |
| Icons | `icon` values must be names the `Icon` component knows (read from `src/components/ui/Icon.jsx`) |
| Placeholders | Any `{word}` in any text must be a known placeholder (read from `src/lib/derive.js`): `years`, `role`, `company`, `companies`, `certifications`, `certCount`, `communities` |
| CV | `site.json` → `cv` must be a `.pdf` path; `cv.json` needs a `summary`, and `communities` (if present) a `title` and `points` |

Testing a deliberately broken copy: set `CONTENT_DIR=/path/to/copy/of/content` and run the script; the real files
are not touched.

---

## `prerender.mjs` — real pages for search engines and link previews

The site is a React app, but crawlers and LinkedIn/WhatsApp previews don't run JavaScript. After `vite build`, this
script takes the built `dist/index.html` template and writes a finished HTML file for every route listed in
`site.json` → `seo.pages`:

```
dist/index.html, dist/about/index.html, dist/experience/index.html, dist/projects/index.html,
dist/beyond/index.html, dist/credentials/index.html, dist/contact/index.html, dist/404.html
```

For each page it fills in:

- `<title>` and meta description (placeholders like `{role}` are filled from content)
- canonical URL, `og:url`, `og:title`, `og:description`, `og:image:alt`, Twitter title/description
- a **preload** for that page's portrait only (Home, About, Contact)
- **JSON-LD** structured data: `Person` (name, honorific "Er.", alternate name, job title, employer, Ahmedabad
  address, services offered, education, certifications, award, communities, skills, profiles), `WebSite`, and a
  `ProfilePage`/`WebPage` for the route. `<` is escaped so content can't break out of the script tag.
- a `<noscript>` text fallback with links
- Search Console / Bing verification `<meta>` tags, only if `seo.googleVerification` / `seo.bingVerification` are set

It also writes:

- **`404.html`** — marked `noindex`, without canonical or `og:url`
- **`sitemap.xml`** — every page, plus the CV PDF if it exists
- **`llms.txt`** — a short summary for AI assistants: description, a **Facts** block (current role and company,
  location and work modes, availability, years of experience, certifications, CV link, contact page), all pages with
  descriptions, and profile links

The site origin is set at the top of the file: `const ORIGIN = "https://www.devanshutayal.com";`.

---

## `build-cv.mjs` — the CV, generated from the content

1. Reads `site.json`, `about.json`, `experience.json`, `projects.json`, `beyond.json`, `credentials.json` and
   `cv.json`, and fills placeholders with the same `makeFill()` the website uses.
2. Builds an HTML page in the resume design (fonts from `node_modules/@fontsource/charis-sil`).
3. Prints it to PDF with headless Chrome (`CHROME_PATH`, or the usual Chrome/Chromium locations on macOS, Linux
   and Windows). If Chrome can't be found, the build stops with a clear message.
4. Sets Title, Author, Subject and Keywords with `pdf-lib` and writes `dist/<site.cv>`.

Rules it applies: Microsoft certifications are written "Microsoft Certified: …" and Salesforce ones "Salesforce
Certified …"; achievement text starting with "I " is rewritten without it; a job bullet is skipped if its numbers are
already in that company's client project in the Projects section; result lines come from `impact[].cv`.

The site's Download CV button shows whenever `site.json` → `cv` is set (`vite.config.js` defines `__HAS_CV__`).
The sitemap and llms.txt list the CV because `prerender.mjs` runs after the CV is built.
