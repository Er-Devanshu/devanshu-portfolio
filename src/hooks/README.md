# `src/hooks/` — small reusable behaviours

| Hook | What it does | Used by |
|---|---|---|
| `usePageTitle(title, { noindex })` | Sets the browser tab title, meta description, canonical link and Open Graph/Twitter title and description when a page opens in the browser. Reads the same `site.json` → `seo.pages` data the build uses (with placeholders filled), so what the browser shows always matches the prerendered HTML. `noindex: true` is used by the 404 page. | Every page |
| `useReveal(deps)` | Watches every element with the class `reveal` and adds `is-visible` when it scrolls into view, which fades/slides it in (CSS in `styles/global.css`). With reduced motion turned on, elements are simply visible. | Home, Beyond |

Both hooks only touch the page in the browser; they do nothing during the build.
