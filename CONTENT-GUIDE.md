# Content guide (no coding needed)

Everything you can read on the website (and in your CV) comes from the JSON files in `src/content/`. To change the site:

1. Open the file on **github.com** (click the file, then the pencil icon) or in any text editor.
2. Change the text between the double quotes.
3. **Commit** (on GitHub: "Commit changes" on the `main` branch) or `git push`.
4. About 2 minutes later the change is live (once the one-time Hostinger setup in the README is done).

If you make a mistake, the site does **not** break: the build stops, GitHub shows a red X with the exact problem, and
the live site keeps its previous version. Fix it and commit again.

For the developer-level reference of every field, see [src/content/README.md](src/content/README.md).

---

## Which file does what

| File | What it controls |
|---|---|
| `site.json` | Your name, job title, tagline, photos, email (never shown, only used by the Email buttons), location, career start date, the six stats on Home, the CV file, the Contact page text, social links, and Google titles/descriptions for every page |
| `about.json` | About page: heading, intro, bio paragraphs, the skills chart (each skill has a short "what it's for" line) and your professional (soft) skills, which also appear in the CV |
| `experience.json` | Experience page: every job, its dates, summary, results (the counting numbers) and bullet points |
| `projects.json` | Projects page cards, the category filters, and the four **client work** cards on Home |
| `beyond.json` | Beyond Code page (roles & recognition, community cards) and the testimonials on Home |
| `credentials.json` | Credentials page: education and certifications (badges, "What they cover" table) |
| `navigation.json` | The menu links |
| `cv.json` | CV-only text: the summary and the community line |

---

## Common tasks

### Change your job (new role)

In `experience.json`, add a new block at the **top** of `roles`:

```json
{
  "role": "Your New Title",
  "company": "New Company Pvt. Ltd.",
  "period": "Mar 2027 – Present",
  "summary": "One sentence on what you lead or own.",
  "impact": [
    { "value": "40%", "direction": "down", "label": "Manual effort", "note": "what caused it" }
  ],
  "highlights": [
    "First bullet.",
    "Second bullet."
  ]
}
```

Then change the old job's `"Present"` to its end month, e.g. `"Feb 2026 – Feb 2027"`.
The Home hero, About intro, page titles, Google data and AI summary all switch to the new title and company
automatically. Only one job may end in "Present".

### Add a certification

1. Save the badge image in `public/images/badges/` (PNG or SVG).
2. In `credentials.json` → `certifications`, add:

```json
{
  "name": "Official Certification Name (CODE-123)",
  "issuer": "Microsoft",
  "logo": "/images/badges/your-badge.png",
  "areas": ["Data engineering", "Generative AI"],
  "short": "CODE-123",
  "headline": true
}
```

`areas` are the rows it ticks in the "What they cover" table. `short` + `headline: true` make it appear in the About
bio sentence. The certification count on Home updates by itself.

### Add a project (Projects page)

In `projects.json` → `items`:

```json
{
  "title": "Project Name",
  "summary": "One sentence on what it does.",
  "shows": "What it proves to a hiring manager, e.g. Forecasting for planning",
  "category": "Forecasting",
  "tags": ["Python", "Prophet"],
  "url": "https://github.com/Er-Devanshu/your-repo",
  "image": "",
  "cover": ""
}
```

- `category` must be one of the names in `categories`.
- The **first** project in the list is the big featured card.
- `cover` picks a built-in illustration (leave empty for a pattern); `image` can instead point to your own picture in
  `public/images/`.
- Add `"hidden": true` to keep a project in the file but off the website.
- GitHub links show "View code"; Tableau Public links show "View live dashboard".

### Change a Home client-work card

`projects.json` → `caseStudies` (Home shows the first four): `title`, `company`, `year`, `problem`, and
`result` with `value` (e.g. `"$200K"`) and `label`. Client names are never shown.

### Add a testimonial

`beyond.json` → `testimonials`: `name`, `role` (their designation), `quote` (their full words), `highlight` (an exact
phrase copied from the quote, which is underlined). Order in the file = order on the site.

### Add a community

`beyond.json` → `communities`: `name`, `role`, `scope` (`"Gujarat"` or `"India"`), `url`, `text`, and `cover`
(an image in `public/images/covers/`, about 800 px wide WebP).

### Change the Home stats

`site.json` → `stats` (six items, one line on desktop). `value` is text like `"80+"`, or `"auto:years"` /
`"auto:certifications"` to calculate it. `icon` can be `briefcase`, `users`, `workflow`, `github`, `chart`, `award`,
`mic`, `pen`, `linkedin`, `mail`.

### Your CV updates itself

You don't edit the CV. It is rebuilt from these same files every time you push, in your resume's design, so it always
matches the website. A few things are CV-only and live in `cv.json`: the summary paragraph and the community line.
For a result number to appear in the CV as a sentence, give it a `cv` line in `experience.json`, e.g.
`"cv": "Reduced the fraud rate by 23%."`. Client projects in `projects.json` (those with a `client`) appear in the
CV's Projects section using their `points`.

### Change a photo

Replace the file in `public/images/` with the same name (or a new name and update the path in `site.json`). Each
portrait also has a `-640` phone version.

---

## Facts that update themselves

Type these anywhere in a text value:

| Write | Shows | Comes from |
|---|---|---|
| `{years}` | years of experience (e.g. 8) | `careerStart` in `site.json` (2018-02-09) |
| `{role}` | current job title | the job ending in "Present" |
| `{company}` | current company (short) | same job |
| `{companies}` | number of companies | `experience.json` |
| `{certifications}` | list of certifications | `credentials.json` items with `"headline": true` |
| `{certCount}` | number of certifications | `credentials.json` |
| `{communities}` | number of communities | `beyond.json` |

Any other `{word}` stops the build (so a typo can't appear on the site).

---

## Google titles and descriptions

`site.json` → `seo.pages`, one entry per page:

```json
"/about": { "title": "About Er. Devanshu Tayal, Data Scientist & AI Lead", "description": "…" }
```

Keep titles under about 60 characters and descriptions under about 160. Placeholders work here too.
When you get Google Search Console or Bing verification codes, paste them into `seo.googleVerification` and
`seo.bingVerification`.

---

## Rules the build checks

- **Job dates:** exactly `"Jan 2022 – Jan 2026"` or `"Jul 2026 – Present"` (three-letter month, year).
- **Links:** must start with `https://`, `/` (a page on this site) or `mailto:`.
- **Images:** must be files in `public/images/`, written as `"/images/name.webp"`, and the file must exist.
- **Icons:** must be one of the names listed above.
- **Results:** `direction` is `"up"` or `"down"`.

## JSON rules (common mistakes)

- Items are separated by commas, but the **last** item has **no** comma before `]` or `}`.
  - Wrong: `"cover": "",` followed by `}`
  - Right: `"cover": ""` followed by `}`
- Use straight double quotes `"`, not curly quotes `“ ”` (careful when pasting from Word).
- Every `{` needs a `}` and every `[` needs a `]`.
- To put a quote mark inside text, write `\"`.
- Don't rename the keys on the left (like `"title"`); only change the values.

## Checking that it went live

Open the **Actions** tab on github.com:

- **Yellow dot**: building (1–2 minutes).
- **Green check**: built and published. Refresh the site (Cmd+Shift+R).
- **Red X**: something failed and the live site was **not** changed.

Click the failed run → **build** → **Check content and build** to see the reason, for example:

```
✖ Content check failed (1):
  - projects.json items[6]: category "ML" is not in "categories" (AI & LLMs, Machine Learning, ...)
```

Fix the file and commit again; it re-runs automatically.
