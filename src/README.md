# `src/` — the React application

Everything the visitor's browser runs comes from here. Vite bundles it into `dist/assets/` during `npm run build`.

## Entry points

| File | Role |
|---|---|
| `main.jsx` | Starts React. Imports the self-hosted fonts (Inter 400/500/600, Instrument Serif 400 + italic, IBM Plex Mono 400/500, Latin subsets only) and `styles/global.css`. Turns off the browser's automatic scroll restoration because pages load lazily. |
| `App.jsx` | The router. Home loads immediately; every other page is **lazy-loaded** (its code downloads only when visited). Includes a one-time reload guard: if a deploy happens while someone has the site open and a page file no longer exists, the tab reloads once instead of showing a blank page (`sessionStorage` key `dt-chunk-reload`). Also `ScrollToTop`: on navigation it scrolls to the top, announces the new page title to screen readers (`#route-announcer`) and moves keyboard focus to the new page's `h1`. |

### Routes (in `App.jsx`)

| Path | Page component |
|---|---|
| `/` | `pages/HomePage` |
| `/about` | `pages/AboutPage` |
| `/experience` | `pages/ExperiencePage` |
| `/projects` | `pages/ProjectsPage` |
| `/beyond` | `pages/BeyondPage` |
| `/credentials` | `pages/CredentialsPage` |
| `/contact` | `pages/ContactPage` |
| `*` | `pages/NotFoundPage` |

A route only shows in the menu if it is in `content/navigation.json`; a route only gets its own prerendered HTML file
if it is in `content/site.json` → `seo.pages`.

## Folders

| Folder | What's inside | README |
|---|---|---|
| `content/` | **All editable text, numbers and links** (JSON) | [content/README.md](content/README.md) |
| `lib/` | Loads content and calculates automatic facts (years, current role…) | [lib/README.md](lib/README.md) |
| `pages/` | One component + stylesheet per page | [pages/README.md](pages/README.md) |
| `components/` | Reusable pieces: header, footer, buttons, stats, testimonials, skills chart… | [components/README.md](components/README.md) |
| `layouts/` | The frame around every page (skip link, header, main, footer) | [layouts/README.md](layouts/README.md) |
| `hooks/` | Page title/SEO tags and scroll-reveal animation | [hooks/README.md](hooks/README.md) |
| `styles/` | Design tokens, colours, typography, global rules | [styles/README.md](styles/README.md) |

## How data flows

```
content/*.json ──► lib/content.js (+ lib/derive.js) ──► pages/*.jsx ──► components/*
                         │
                         └─ fill("{role} at {company}") → "Senior Tech Lead – Data & AI at Aegis Soft Tech"
```

Pages never read JSON directly; they import from `lib/content.js`, which also exposes `fill()` for placeholders and
pre-computed values such as `siteRole`, `currentCompany` and `career`.

## Conventions

- **No hard-coded content** in components: if a visitor can read it, it should come from `content/`.
- **Each page has its own CSS file** next to it; shared styles live in `styles/`.
- **Class prefixes** keep styles from clashing: `home-`, `ab-` (About), `xp-` (Experience), `project-`, `community-`/`honour-` (Beyond), `cr-` (Credentials), `contact-`, `cs-` (case studies), `proof-` (stats), `voices-` (testimonials), `sk-` (skills chart).
- **Accessibility first**: real buttons and links, labelled controls, visible focus, `prefers-reduced-motion` respected.
- **No raw HTML from content** (`dangerouslySetInnerHTML` is never used), so content cannot inject script.
