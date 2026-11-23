# Content Guide

This guide is for updating the website's words, projects and photos. No coding needed. Everything lives in a few text files, and the site updates itself a couple of minutes after you save.

## Where things live

All content is in the `src/content/` folder. Each file controls one part of the site:

| File | What it controls |
|---|---|
| `site.json` | Your name, role, tagline, photos (`photo` on Home, `aboutPhoto` on About), logo, email, location, career start date, social links, the numbers row on the home page (`stats`), quote, highlights, contact section and SEO (Google title/description). |
| `about.json` | The About page: `title`, `intro`, `bio` (a list of paragraphs; the first is shown slightly larger), `skills` (see below) and `journey` (the Career timeline: `period`, `title`, `org`). |
| `experience.json` | The Experience page: `title`, `intro`, and `roles` — each role has `role`, `company`, `period`, a `highlights` list of bullet points and an optional `impact` list (`value` like `"20%"`, `direction` `"up"` or `"down"`, `label`, `note`). |
| `projects.json` | The Projects page: `title`, `intro`, the featured section (`featuredTitle`, `featuredIntro`), the filter `categories`, and the `items` (your projects, each with a `cover` illustration key). |
| `beyond.json` | The Beyond Code page: `achievements` (`title`, `issuer`, `period`, `logo`, `text`), `communities` (`name`, `role`, `period`, `logo`, `url`, `text`), plus `testimonials` (`name`, `role`, `quote`, `highlight`, `source`), which appear on the Home page. |
| `credentials.json` | Education & Certifications: `education` (`period`, `institution`, `degree`, `logo`) and `certifications` (`name`, `issuer`, `logo`, `year`, `url`). |
| `navigation.json` | The menu: `primary` links and the `cta` (Contact) button. Each link has a `label` and a `path`. (`more` is an optional dropdown; leave it as `[]` to hide it.) |

## Editing in your browser (github.com)

1. Go to the repository on github.com and open `src/content/`.
2. Click the file you want to change (e.g. `experience.json`).
3. Click the **pencil icon** (Edit this file) at the top right.
4. Make your changes. Only change the text **inside the quotes** on the right side of the `:`.
5. Click **Commit changes…**, write a short note (e.g. "Add new role"), keep "Commit directly to the main branch", and confirm.
6. The site rebuilds and goes live in about 2 minutes.

## Adding a project

Open `projects.json`, find `"items": [`, and copy an existing block from `{` to `}`. Paste it right after another block, with a comma between them:

```json
{
  "title": "My New Project",
  "summary": "One sentence on what it does.",
  "category": "Machine Learning",
  "tags": ["Python", "scikit-learn"],
  "url": "https://github.com/Er-Devanshu/my-new-project",
  "image": "",
  "cover": "",
  "featured": false
},
```

- `category` must match one of the names in the `categories` list **exactly** (same spelling and capitals): currently `AI & LLMs`, `Machine Learning`, `Deep Learning`, `NLP`, `Forecasting`, `Dashboards`. To add a new category, add it to that list too.
- `url` must start with `https://`.
- `featured: true` shows the project in the featured section.
- `image` is optional (see below). `cover` picks one of the built-in illustrations; leave it empty and the project gets a pattern for its category.

## Changing your photos

Photos appear on Home (`photo`) and About (`aboutPhoto`). They are transparent cut-outs on a coloured panel, saved as **.webp** at about 1200 × 1312 px.

1. On github.com, open `public/images/` → **Add file → Upload files** → upload the new file (e.g. `portrait-home.webp`) → Commit. Using the same file name replaces the photo without touching `site.json`.
2. With a new file name, set it in `site.json`, e.g. `"photo": "/images/my-photo.webp",`.
3. Update `photoAlt` / `aboutPhotoAlt` (a short description for screen readers).

## Skills (About page)

`about.json` → `skills.groups` holds the areas of the Skills chart. Each group has a `group` name, a one-line `descriptor` and `items`. Every item needs a `name` and a `use`, a short line on what the tool or method is for, which shows when someone selects it:

```json
{ "name": "Databricks", "use": "A cloud platform for big data processing and machine learning on Spark." }
```

The build stops with a clear message if an item is missing its `use`.

## Logos (certifications and communities)

Upload logo files (PNG or SVG) to `public/images/logos/`, then set `"logo": "/images/logos/tableau.png"` on that certification in `credentials.json`, or on that achievement or community in `beyond.json`. Without a logo, the tile shows initials.

## Project images

Same idea: upload to `public/images/` (for example `public/images/projects/datapilot.webp`, about 1200 × 750, webp) and set `"image": "/images/projects/datapilot.webp"` on that project. Paths start with `/` and do not include `public`.

## Automatic numbers ("auto:years", "auto:certifications")

In `site.json` → `stats`, the value `"auto:years"` is calculated automatically from `careerStart` (e.g. `"2018-02-09"`), so your years of experience stay up to date. Change `careerStart` if needed; leave `auto:years` as is. The value `"auto:certifications"` counts the certifications listed in `credentials.json`, so adding a certificate there updates the home page number too. Other stat values are plain text like `"80+"`.

## Common mistakes (JSON rules)

- **Commas:** items in a list or block are separated by commas, but the **last** item has **no** comma before `]` or `}`.
  - Wrong: `"featured": true,` followed by `}`
  - Right: `"featured": true` followed by `}`
- Always use straight double quotes `"`, not curly quotes `“ ”` (watch out when pasting from Word).
- Every `{` needs a `}` and every `[` needs a `]`.
- To put a quote mark inside text, write `\"`.
- Don't rename the keys on the left (like `"title"`) — only change the values.

## Checking the deploy

After you commit, open the **Actions** tab on github.com:

- **Yellow dot** — building (1–3 minutes).
- **Green check** — done, the site is live. Refresh your site to see it.
- **Red X** — something failed, and **the live site was not changed** (it keeps the previous version).

To see why, click the failed run → the **build-deploy** job → expand **Check content and build**. A content problem looks like this:

```
✖ Content check failed (1):
  - projects.json items[6] (My New Project): category "ML" is not in "categories" (AI & LLMs, Machine Learning, ...)
```

or, for a comma/quote typo:

```
  - projects.json: not valid JSON — Unexpected token } in JSON at position 1234
```

The message names the file and what to fix. Edit the file again, commit, and it will re-run automatically.
