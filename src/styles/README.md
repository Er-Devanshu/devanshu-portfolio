# `src/styles/` — design system and global styles

Imported once through `global.css` (from `main.jsx`). Page and component styles live next to their files.

| File | What it holds |
|---|---|
| `tokens.css` | **Design tokens**: brand colours, fonts, layout widths, spacing scale, radii, shadows, transitions and the single section-heading size `--section-title` |
| `themes.css` | **Semantic colours** used by components: page background, surfaces, text levels, accent, borders, and the ivory band colours |
| `typography.css` | Heading font and sizes (`h1`–`h6` use Instrument Serif), body text, links |
| `global.css` | Reset, container, buttons (`.btn`, `.btn-primary`, `.btn-secondary`), `.visually-hidden`, `.skip-link`, `.page-hero`, `.reveal` animation, the ivory band (`.surface-ivory`), portrait cards, `CountUp` overlay rules, focus styles, `prefers-reduced-motion` handling |

## Brand

| Token | Value | Use |
|---|---|---|
| `--color-ink` / `--page-background` | `#101415` | Charcoal page background |
| `--color-ink-soft` | `#171d1e` | Cards |
| `--color-ivory` | `#f1ebe2` | Light text and the ivory band |
| `--color-orange` / `--accent-color` | `#ef9148` | Accent: numbers, links, highlights |
| `--text-primary` / `--text-secondary` / `--text-muted` | `#f4f0e9` / `#c5c1b9` / `#a09f98` | Text levels (all pass WCAG AA on the dark background) |
| `--accent-dark` | `#a4501a` | Orange that passes 4.5:1 on ivory |
| `--font-display` | Instrument Serif | Headings, big numbers |
| `--font-body` | Inter | Body text |
| `--font-mono` | IBM Plex Mono | Small technical labels |

Project categories add their own warm tints on the Projects page (orange, amber, terracotta, sand, peach), set in
`ProjectsPage.jsx`.

## Rules we follow

- Use tokens, not raw values, for colours, spacing and fonts.
- One section-heading size everywhere (`--section-title`).
- Dividers only **between** items, never at the start or end of a page section.
- No serial numbers in the UI.
- Every motion has a reduced-motion fallback.
