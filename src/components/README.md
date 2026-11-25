# `src/components/` — reusable building blocks

## `layout/`

| Component | What it does |
|---|---|
| `Footer.jsx` / `.css` | DT logo, "© year Er. Devanshu Tayal", social icons (open in a new tab) and an Email icon that uses `EmailLink` (no address in the page) |

## `navigation/`

| Component | What it does |
|---|---|
| `Header.jsx` / `.css` | Logo, menu from `navigation.json`, Contact button, and the phone menu. While the phone menu is open, the page behind it is made `inert`; **Escape** closes it and returns focus to the menu button. Current page is underlined. |

## `ui/`

| Component | What it does | Used on |
|---|---|---|
| `Button.jsx` | Styled link button (`primary` / `secondary`) with optional left/right icon; uses `SmartLink` | Home, Contact, 404 |
| `SmartLink.jsx` | One link component for internal routes (React Router), external sites (new tab + `noopener`) and `mailto:` | Buttons, stats, footer |
| `Icon.jsx` | Maps names (`briefcase`, `users`, `workflow`, `github`, `chart`, `award`, `mic`, `pen`, `linkedin`, `mail`, `download`, `arrow`, `external`) to lucide icons; LinkedIn and GitHub marks are drawn inline. The content validator reads this map to check `icon` values. | Everywhere |
| `CountUp.jsx` | Counts a number like "600+", "35%+" or "$200K" up from zero the first time it scrolls into view. The real final value is always the page text (for screen readers, copy/paste, search and ATS tools); the moving figure is drawn over it with CSS and removed when finished. Only animates in a visible tab, has a safety timeout, and is skipped with reduced motion. | Home stats, Home case studies, Experience results |
| `ProofRail.jsx` / `.css` | The six headline stats under the Home hero: big orange number + icon + label, links to their page; an accent line draws across a stat on hover. One line on wide screens, 3 or 2 per row on smaller ones. | Home |
| `CaseStudies.jsx` / `.css` | Client-work cards on the ivory band: company · year, title, problem, counting result | Home |
| `ProjectCover.jsx` / `.css` | Cover illustration for a project: an authored drawing (`ProjectCovers.jsx`) chosen by the project's `cover` key, otherwise a generated pattern for its category | Projects |
| `ProjectCovers.jsx` | The hand-drawn SVG cover illustrations (DataPilot, forecasting, fraud, churn, tickets, reviews, chatbot arena, dashboards, …) | `ProjectCover` |
| `Testimonials.jsx` / `.css` | Full recommendations with name and designation. Every quote sits in the same grid cell so the section never changes height. Rotates every 15 s using a progress line under the active name (the line's CSS animation *is* the timer); pauses off screen and while keyboard focus is inside; stops for good when a person is chosen. Arrow keys / Home / End move between people; a hidden hint tells screen-reader users how rotation works. Long quotes get a smaller size; the key phrase is underlined in orange. | Home |
| `SkillsSunburst.jsx` / `.css` | Interactive ring chart of skill groups and tools; hover, click or arrow keys show what each tool is for. On phones it becomes grouped chips. | About |
| `SignalField.jsx` / `.css` | Decorative animated "noise settling into signal" line behind the hero (paused with reduced motion) | Home, Contact |
| `CvButton.jsx` | "Download CV (PDF)" button; rendered only when the PDF exists (Vite sets `__HAS_CV__` at build time) | Home, Contact |
| `EmailLink.jsx` | A link that opens `mailto:` only when clicked, so the address is never in the page for bots to harvest. Without JavaScript it goes to `/contact`. | Footer, Contact |
| `CopyEmail.jsx` | Copies the email to the clipboard and says "Email copied" (announced to screen readers) | Contact |

## Conventions

- Components never contain content text that belongs in `src/content/`.
- Links that open a new tab always add `rel="noopener noreferrer"` and a hidden "(opens in a new tab)".
- Decorative graphics are `aria-hidden`; interactive ones have labels and keyboard support.
