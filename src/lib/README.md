# `src/lib/` — content loading and automatic facts

| File | Role |
|---|---|
| `content.js` | The single place the app reads content from. Imports every JSON file in `src/content/` and exports them plus helpers. |
| `derive.js` | Pure functions that work out facts from the content. Used by the browser (via `content.js`) **and** by the build (`scripts/prerender.mjs`), so the website and the SEO files always agree. |

## `content.js` exports

| Export | What it is |
|---|---|
| `site`, `about`, `experience`, `projects`, `beyond`, `credentials`, `navigation` | The JSON files |
| `fill(text)` | Replaces placeholders like `{years}`, `{role}`, `{company}` in any text |
| `siteRole` | The hero job title (`site.role`, or the current role when it is `"auto:role"`) |
| `currentCompany` | Current company, short form, e.g. "Aegis Soft Tech" |
| `career` | Career list for the About page, built from `experience.json`, newest first |
| `statValue(value)` | Turns `"auto:years"` into "8+" and `"auto:certifications"` into the count |
| `portraitSrcSet(full, small)`, `PORTRAIT_SIZES` | Responsive image helpers for the portraits |
| `isExternal(url)` | `true` for `https:` and `mailto:` links |

## `derive.js` functions

| Function | What it does |
|---|---|
| `yearsSince(date, now)` | Whole years since a `YYYY-MM-DD` date, using the visitor's local calendar (no off-by-one-day bug from time zones) |
| `currentRole(experience)` | The role whose period ends in "Present", otherwise the one that ended last |
| `shortCompany(name)` | Drops "Pvt. Ltd.", "Ltd.", "Inc.", "LLC", "LLP" |
| `careerList(experience)` | `[{ period: "2022 – 2026", title, org }]`, newest first |
| `certificationList(credentials)` | "A, B and C" from certifications marked `headline: true` (or all) |
| `makeFill({ site, experience, credentials, beyond })` | Builds the `fill()` function with all placeholder values |
| `resolveRole(site, experience)` | Handles `"auto:role"` |

**The list of placeholders is written at the top of `derive.js`.** The content validator reads that list, so adding a
new placeholder means adding it there and to `makeFill`'s `values` object.

## `email.js`

`getEmail()` returns the email address only when someone clicks **Email me** or **Copy email**. The build (`vite.config.js`) removes `email` from the bundled `site.json` and passes it in reversed and base64-encoded, so the address is not in the page or in the JavaScript as plain text. The CV still prints it.
