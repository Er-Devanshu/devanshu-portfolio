# Devanshu Tayal — Portfolio

A fast, static portfolio site built with React 19 and Vite. There is no database or CMS: all text lives in JSON files in `src/content/`. Edit a file, push to `main`, and the site updates on Hostinger automatically in about 2 minutes.

**Editing content?** Read [CONTENT-GUIDE.md](CONTENT-GUIDE.md). It is written for non-developers.

## Local development

Requires Node 22.

```bash
npm install            # once
npm run dev            # local dev server with hot reload
npm run check:content  # validate the JSON content files
npm run lint           # code style checks
npm run build          # content check + production build into dist/ + one HTML file per page (scripts/prerender.mjs)
npm run preview        # serve the built dist/ locally
```

## Publishing (automatic)

Push to `main` and the site updates itself in about 2 minutes:

1. GitHub Actions (`.github/workflows/build.yml`) checks the content, builds the site and saves the finished files to the `hostinger` branch. No passwords or secrets are involved.
2. Hostinger's Git deployment pulls the `hostinger` branch into `public_html`.

If the content check fails, the build stops, the **Actions** tab shows a red X with the reason, and the live site keeps its previous version.

### One-time setup in Hostinger (about 5 minutes)

Do this once, after the first push has created the `hostinger` branch (check the branch list on GitHub).

1. In **hPanel → Files → File Manager**, back up and then empty `public_html`. Hostinger only deploys into an empty folder.
2. In **hPanel → Websites → Manage → Advanced → GIT**, create a repository:
   - **Repository:** `https://github.com/Er-Devanshu/devanshu-portfolio.git`
   - **Branch:** `hostinger`
   - **Directory:** leave empty (deploys straight into `public_html`)
3. Click **Deploy** once to pull the current site.
4. Turn on **Auto Deployment** and copy the **Webhook URL** it shows.
5. In GitHub, open the repo → **Settings → Webhooks → Add webhook**: paste the URL as **Payload URL**, choose **Just the push event**, and save.
6. In hPanel, make sure SSL is enabled for the domain (the site forces HTTPS).

From then on, every push to `main` goes live on its own.

### Manual fallback

If you ever need to publish by hand: run `npm run build` and upload **everything inside `dist/`** (including the hidden `.htaccess`) into `public_html`.
