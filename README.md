# Devanshu Tayal — Portfolio

A fast, static portfolio site built with React 19 and Vite. There is no database or CMS: all text lives in JSON files in `src/content/`. Edit a file, push to `main`, and GitHub Actions checks, builds and uploads the site to Hostinger automatically.

**Editing content?** Read [CONTENT-GUIDE.md](CONTENT-GUIDE.md). It is written for non-developers.

## Local development

Requires Node 22.

```bash
npm install            # once
npm run dev            # local dev server with hot reload
npm run check:content  # validate the JSON content files
npm run lint           # code style checks
npm run build          # content check + production build into dist/
npm run preview        # serve the built dist/ locally
```

## How deploys work

`.github/workflows/deploy.yml` runs on every push to `main` (and on demand from the Actions tab):
install, lint, content check, build, then FTPS upload of `dist/` to Hostinger. Pull requests run the same checks but never deploy.

`public/.htaccess` (copied into the build) handles HTTPS redirects, page-refresh routing, caching, compression and security headers.

## One-time Hostinger setup

1. In **hPanel → Files → FTP Accounts**, create an FTP account (or use the main one). Note the FTP host/IP, username and password.
2. In GitHub, open the repo → **Settings → Secrets and variables → Actions → New repository secret** and add:
   - `FTP_SERVER` — FTP host, e.g. `ftp.yourdomain.com` or the IP shown in hPanel
   - `FTP_USERNAME` — the FTP username
   - `FTP_PASSWORD` — the FTP password
   - *(optional)* `FTP_SERVER_DIR` — upload folder, defaults to `./public_html/`. If your FTP account already opens inside `public_html`, set it to `./`.
3. In hPanel, enable SSL for the domain (the site forces HTTPS).
4. Push to `main` or run the workflow manually from the **Actions** tab.
