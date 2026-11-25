# `src/content/` — all editable content

Every word, number, date, link and image path on the website — and in the generated CV — comes from these eight JSON files. Edit them, push to
`main`, and the site updates. For a step-by-step guide written for non-developers, see
[../../CONTENT-GUIDE.md](../../CONTENT-GUIDE.md). This file is the field-by-field reference.

**Safety net:** `scripts/validate-content.mjs` checks these files before every build. If something is wrong, the
build stops, GitHub shows a red X with the exact file and field, and the live site keeps its previous version.
You can run the check yourself with `npm run check:content`.

**JSON tips:** keep the double quotes, separate items with commas (no comma after the last item), and save as UTF-8.

---

## Placeholders (automatic facts)

Type these inside any text value; they are replaced everywhere (pages, page titles, structured data, llms.txt):

| Placeholder | Becomes | Comes from |
|---|---|---|
| `{years}` | full years since `careerStart` (e.g. 8) | `site.json` → `careerStart` |
| `{role}` | current job title | the role in `experience.json` whose period ends in "Present" (or ended last) |
| `{company}` | current company, short form ("Aegis Soft Tech") | same role, with "Pvt. Ltd." etc. removed |
| `{companies}` | number of different companies | `experience.json` |
| `{certifications}` | readable list of certifications | `credentials.json` items with `"headline": true` (uses `short` if given) |
| `{certCount}` | number of certifications | `credentials.json` |
| `{communities}` | number of communities | `beyond.json` |

Unknown placeholders (e.g. a typo like `{rol}`) fail the build.

---

## `site.json` — identity, hero, stats, contact, SEO

| Field | Used for |
|---|---|
| `name` | "Er. Devanshu Tayal" — page titles, footer, structured data, llms.txt |
| `firstName`, `lastName` | The two lines of the big name in the Home hero |
| `role` | `"auto:role"` = always the current job title from `experience.json` |
| `tagline` | The sentence under the role in the Home hero (includes availability) |
| `email` | Used only by "Email me" (on click) and "Copy email"; never shown on the page |
| `location` | "Ahmedabad, India" — structured data and llms.txt |
| `careerStart` | `YYYY-MM-DD`; drives `{years}` and the "Years of experience" stat |
| `photo`, `photoSmall`, `photoAlt` | Home portrait (full + 640 px phone version) and its description |
| `aboutPhoto…`, `contactPhoto…` | Same for About and Contact |
| `logo` | The DT logo |
| `cv` | Path to the CV PDF, e.g. `/cv/Devanshu-Tayal-CV.pdf`; empty string hides the button |
| `stats[]` | The one-line stats under the Home hero: `value` (a number like `"80+"`, or `"auto:years"` / `"auto:certifications"`), `label`, optional `url`, `icon` (`briefcase`, `users`, `workflow`, `github`, `chart`, `award`, `mic`, `pen`) |
| `contact.title`, `contact.text`, `contact.note` | Contact page heading, availability line, location line |
| `socials[]` | `label`, `url`, `icon` — footer and Contact; the LinkedIn one becomes the main Contact button |
| `seo.title`, `seo.description` | Fallback title/description |
| `seo.pages["/route"]` | Per-page `title` (≤60 characters) and `description` (≤160) |
| `seo.googleVerification`, `seo.bingVerification` | Paste Search Console / Bing codes here; added to every page automatically |

## `about.json` — About page

| Field | Used for |
|---|---|
| `title`, `intro` | Page heading and the line under it (placeholders allowed) |
| `bio[]` | Bio paragraphs (placeholders allowed) |
| `skills.groups[]` | Skills chart: each group has `group`, optional `short` (label on the ring), `descriptor`, `items[]` with `name` and `use` (one line on what the tool is for) |
| `softSkills.title`, `softSkills.intro`, `softSkills.items[]` | "Professional skills" on About and in the CV: each item has `name`, `icon` (`users`, `handshake`, `compass`, `rocket`, `workflow`, `presentation`, …), `use` (one line written as "I …"; the CV drops the "I") and `proof` (a short fact from your work shown as a chip on the website; placeholders work) |

The About career list is built automatically from `experience.json`.

## `experience.json` — Experience page

| Field | Used for |
|---|---|
| `title`, `intro` | Page heading and intro (`{years}`, `{companies}` allowed) |
| `roles[]` | Newest first. Each role: `role`, `company`, `period` (`"Feb 2026 – Present"`), `summary`, `impact[]`, `highlights[]` |
| `impact[]` | Results shown as counting numbers: `value` ("600+", "50%", "$200K"), `direction` (`up`/`down`), `label`, `note`, and `cv` (the sentence used for this result in the CV, e.g. "Reduced the fraud rate by 23%.") |

Adding a new job: put it at the top with a period ending in "Present" and change the previous job's "Present" to its
end month. The hero, About, Experience, page titles and structured data all update.

## `projects.json` — Projects page and Home client work

| Field | Used for |
|---|---|
| `title`, `intro` | Projects page heading and intro |
| `categories[]` | Filter names (only categories with visible projects are shown) |
| `items[]` | Projects: `title`, `summary`, `shows` ("What it shows" line), `category`, `tags[]`, `url` (GitHub or Tableau Public), optional `image`, `cover` (built-in illustration: `latency`, `datapilot`, `greykite`, `fraud`, `churn`, `tickets`, `tripadvisor`, `chatbot-arena`, `online-store`, `radial-chart`, …). **Client projects** have no `url` and add `client` (e.g. "Analytix") and `period`. Any project with `points` (CV bullets) also appears in the CV's Projects section. The first visible item is the featured card. |
| `featuredTitle`, `featuredIntro` | Heading and intro of "Selected work" on Home |
| `caseStudies[]` | Home client-work cards (up to 4): `title`, `company`, `year`, `problem`, `result` (`value` + `label`), `tags[]` |

## `beyond.json` — Beyond Code page and testimonials

| Field | Used for |
|---|---|
| `title`, `intro` | Page heading and intro |
| `achievements[]` | "Roles & recognition": `title`, `issuer`, `period` or `years[]` (shown as chips, and used as an award in structured data), `text`, optional `logo` |
| `communities[]` | Community cards: `name`, `role`, `scope` (Gujarat / India), `url` (Meetup, LinkedIn, Fabric Community…), `cover` (`/images/covers/…-800.webp`), optional `coverPosition`, `text` |
| `testimonials[]` | Rotating quotes on Home: `name`, `role` (their designation), `quote` (full original text), `highlight` (an exact phrase from the quote, underlined) |

## `credentials.json` — Credentials page

| Field | Used for |
|---|---|
| `title`, `intro` | Page heading and intro |
| `education[]` | `period`, `institution`, `degree`, optional `note` |
| `certifications[]` | `name`, `issuer`, `logo` (badge in `/images/badges/`), `areas[]` (rows of the "What they cover" table), `short` + `headline: true` (used in `{certifications}`) |

## `navigation.json` — menu

`primary[]` menu links (`label`, `path`) and `cta` (the Contact button in the header).

## `cv.json` — CV-only text

The CV is generated from all the other files; this file holds only what the website doesn't show.

| Field | Used for |
|---|---|
| `summary` | The CV summary (placeholders like `{years}`, `{company}` work) |
| `communities.title`, `communities.period`, `communities.points[]` | The community entry under "Leadership & Community" (`{communities}` works) |
