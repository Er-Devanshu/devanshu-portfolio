# `src/pages/` — one file per page

Each page is a React component (`*.jsx`) with its own stylesheet (`*.css`). Pages read content only through
`src/lib/content.js` and call `usePageTitle()` so the browser title and share tags match the prerendered HTML.
Every page except Home is lazy-loaded by `App.jsx`.

| Page | Route | Sections (top to bottom) | Content source |
|---|---|---|---|
| `HomePage` | `/` | Hero: animated signal line, "Er. Devanshu / Tayal", "Senior Tech Lead – Data & AI at Aegis Soft Tech", tagline with availability, buttons **Work with me** (→ Contact), **View my work** (→ Projects), **Download CV** (only if the PDF exists), portrait. **Stats** (`ProofRail`): six numbers with icons, one line on desktop. **Selected work** (`CaseStudies`): four client projects with a counting result ($200K, 600+, 50%, 20%). **Testimonials**. | `site.json`, `projects.json` → `caseStudies`, `beyond.json` → `testimonials` |
| `AboutPage` | `/about` | Hero with intro and speaking photo; bio paragraphs (placeholders filled); Background and Skills side by side, with the interactive `SkillsSunburst`; **Professional skills** (six cards: icon, name, one line and a proof chip from real work, e.g. "Team of 10+ at Aegis Soft Tech"; pointer spotlight and lift on hover); Career list built from experience | `about.json`, `experience.json` |
| `ExperiencePage` | `/experience` | Intro; one entry per role: large year span (orange for the current role), title, company / dates / duration, summary, results that count up (label before value for screen readers), bullets. Lines appear only between roles. | `experience.json` |
| `ProjectsPage` | `/projects` | Intro; filter pills with counts (only categories that have visible projects; the choice is kept in the URL, e.g. `?category=NLP`, and switching animates with View Transitions); **featured card** (first project, full width, cover beside text); **project cards** two per row, each with a category colour, cover illustration, summary, **"What it shows"**, tool chips and "View code" / "View live dashboard"; client projects (no link) show "Client project · Analytix · period" instead and don't lift on hover. A soft light follows the pointer across each card. | `projects.json` → `items` (skips `hidden: true`) |
| `BeyondPage` | `/beyond` | **Roles & recognition**: Tableau Ambassador (year chips), Guest Faculty BITS Pilani, Technical Book Reviewer (Packt) — each with a drawn emblem (laurel, lectern or book); **Communities**: full-colour cover cards with scope chip, role, text and a host-aware link ("Join on Meetup", "Follow on LinkedIn", "Join on Fabric Community", "Visit group") | `beyond.json` |
| `CredentialsPage` | `/credentials` | Hero with the **badge shelf** (five official badges, alternating heights, each lifts on hover; no external links); **Education** (degree as the heading); **What they cover** table (desktop) / list with area chips (phones) | `credentials.json` |
| `ContactPage` | `/contact` | Animated signal line, "Let's *talk*", availability line, location note, **Message on LinkedIn**, **Email me** (opens the mail app on click), **Copy email**, **Download CV**, other profiles, portrait | `site.json` |
| `NotFoundPage` | anything else | "Page not found", Back to home, quick links to Experience / Projects / Credentials / Contact. Marked `noindex`. | — |

## Notes

- Inline `style` attributes are used only for CSS variables (e.g. `--tint`, `--i`) and are allowed by the site's
  Content-Security-Policy (`style-src 'unsafe-inline'`); scripts stay `self`-only.
- Each CSS file uses its own class prefix to avoid clashes (`home-`, `ab-`, `xp-`, `project-`, `honour-` /
  `community-`, `cr-`, `contact-`).
- Every animation has a `prefers-reduced-motion` fallback.
