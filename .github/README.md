# `.github/` — automation on GitHub

This folder tells GitHub what to do automatically. Nothing here runs on the website itself.

## Files

| File | What it does |
|---|---|
| `workflows/build.yml` | Builds the site on every push to `main` and publishes the result to the `hostinger` branch |
| `dependabot.yml` | Opens pull requests to keep npm packages and GitHub Actions up to date |

## `workflows/build.yml` — build and publish

**When it runs:** on every push to `main`, and manually from the **Actions** tab ("Run workflow").
Only one build runs at a time; a newer push cancels an older running build (`concurrency: build-site`).

**Job 1 — `build` (read-only permissions)**

1. **Check out code** with `persist-credentials: false` (the token is not left on disk).
2. **Set up Node 22** with npm caching.
3. **`npm ci`** — installs the exact versions in `package-lock.json`.
4. **`npm run lint`** — ESLint must pass.
5. **`npm run build`** — runs, in order:
   - `scripts/validate-content.mjs` (stops everything if content is broken),
   - `vite build` (creates `dist/`),
   - `scripts/build-cv.mjs` (generates the CV PDF from the content with the runner's pre-installed Google Chrome),
   - `scripts/prerender.mjs` (one HTML file per page, 404, sitemap, llms.txt).
6. **Upload `dist/`** as a build artifact (kept 3 days, hidden files like `.htaccess` included).

**Job 2 — `publish` (write permission, runs only if job 1 passed)**

1. Downloads the `dist/` artifact.
2. Uses `peaceiris/actions-gh-pages` to force-push `dist/` to the **`hostinger`** branch as a single fresh commit
   (`force_orphan: true`). Hidden files such as `.htaccess` are included because the artifact upload uses `include-hidden-files: true`; `enable_jekyll: true` only stops the action adding a `.nojekyll` file, which doesn't matter for Hostinger.
3. Hostinger's Git deployment (set up once in hPanel, see the root README) pulls that branch into `public_html`.

**Security choices**

- Every action is pinned to an **exact commit SHA** (the version is in a comment), so a moved or hijacked tag cannot
  change what runs. Dependabot updates the pins.
- The default permission is `contents: read`; only the small publish job gets `contents: write`, and it only writes
  the `hostinger` branch.
- The workflow does **not** run on pull requests from forks, and uses **no secrets** other than GitHub's built-in
  `GITHUB_TOKEN`.

**If it fails:** open the run in the **Actions** tab. A content mistake is reported by name, e.g.
`experience.json roles[0]: period "Feb 2026 - Now" must look like "Jan 2022 – Jan 2026" or "Jul 2026 – Present"`.
Fix the file and push again; the live site is untouched until a build passes.

## `dependabot.yml`

Checks monthly for new versions of npm packages (up to 5 open pull requests at a time) and of the pinned GitHub Actions, and opens a pull request for each. It never merges anything on its own.
Review and merge them like any other change; the build runs on the result.
