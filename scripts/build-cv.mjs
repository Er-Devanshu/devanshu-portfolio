// Builds the CV PDF from the website content, so the CV always says what the site says.
// Runs after `vite build` (before prerender). Output: dist/<site.cv>, e.g. dist/cv/Devanshu-Tayal-CV.pdf
//
// What comes from where:
//   header      site.json (name, location, email, LinkedIn/GitHub from socials)
//   summary     cv.json (CV-only text; placeholders like {years} are filled)
//   skills      about.json skill groups and softSkills
//   experience  experience.json (title, company, dates, bullets, and results via impact[].cv)
//   projects    projects.json items that have "points" (client and open-source work)
//   education   credentials.json education + certifications
//   leadership  beyond.json achievements + cv.json communities
//
// The PDF is printed by headless Chrome (installed on GitHub's build machines and on most computers).
// Set CHROME_PATH if Chrome is somewhere unusual.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { PDFDocument } from "pdf-lib";
import { makeFill, officialCertName, resolveRole } from "../src/lib/derive.js";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (f) => JSON.parse(readFileSync(path.join(root, "src/content", f), "utf8"));
const site = read("site.json");
const about = read("about.json");
const experience = read("experience.json");
const projects = read("projects.json");
const beyond = read("beyond.json");
const credentials = read("credentials.json");
const cv = read("cv.json");
const fill = makeFill({ site, experience, credentials, beyond });

if (!site.cv) {
  console.log("• CV skipped (site.json has no \"cv\" path)");
  process.exit(0);
}

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const t = (s) => esc(fill(s));
// Dates stay on one line and read "Feb 2026 – Present".
const dates = (s) => esc(s).replace(/ /g, "&nbsp;");
const host = (url) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
const social = (icon) => site.socials.find((s) => s.icon === icon);
const font = (file) => pathToFileURL(path.join(root, "node_modules/@fontsource/charis-sil/files", file)).href;

const ICONS = {
  pin: '<path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"/>',
  mail: '<path d="M2 5h20v14H2V5Zm2 2v.5l8 5 8-5V7l-8 5-8-5Z"/>',
  linkedin: '<path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/>',
  github: '<path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57v-2.03c-3.34.73-4.04-1.6-4.04-1.6-.55-1.4-1.34-1.77-1.34-1.77-1.08-.74.09-.73.09-.73 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.21.7.82.58A12 12 0 0 0 12 .3"/>',
  web: '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.9 6h-3a15.7 15.7 0 0 0-1.4-3.6A8 8 0 0 1 18.9 8ZM12 4c.8 1.1 1.5 2.5 1.9 4h-3.8c.4-1.5 1.1-2.9 1.9-4ZM4.3 14a8.2 8.2 0 0 1 0-4h3.4a16 16 0 0 0 0 4H4.3Zm.8 2h3a15.7 15.7 0 0 0 1.4 3.6A8 8 0 0 1 5.1 16Zm3-8h-3a8 8 0 0 1 4.4-3.6A15.7 15.7 0 0 0 8.1 8ZM12 20c-.8-1.1-1.5-2.5-1.9-4h3.8c-.4 1.5-1.1 2.9-1.9 4Zm2.3-6H9.7a14 14 0 0 1 0-4h4.6a14 14 0 0 1 0 4Zm.2 5.6a15.7 15.7 0 0 0 1.4-3.6h3a8 8 0 0 1-4.4 3.6Zm1.8-5.6a16 16 0 0 0 0-4h3.4a8.2 8.2 0 0 1 0 4h-3.4Z"/>',
};
const icon = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="currentColor">${ICONS[name]}</g></svg>`;

// ---------- sections ----------
// CV bullets are written without "I": "I teach …" becomes "Teach …".
const cvVoice = (s) => String(s).replace(/^I\s+(\w)/, (_, c) => c.toUpperCase());

const contact = [
  site.location && `${icon("pin")}${esc(site.location)} (IST)`,
  site.email && `${icon("mail")}${esc(site.email)}`,
  social("linkedin") && `${icon("linkedin")}<a href="${esc(social("linkedin").url)}">${esc(host(social("linkedin").url))}</a>`,
  social("github") && `${icon("github")}<a href="${esc(social("github").url)}">${esc(host(social("github").url))}</a>`,
  `${icon("web")}<a href="https://www.devanshutayal.com">devanshutayal.com</a>`,
].filter(Boolean).join('<span class="sep">—</span>');

const skills = about.skills.groups
  .map((g) => `<li><b>${esc(g.group)}:</b> ${g.items.map((i) => esc(i.name)).join(", ")}</li>`)
  .join("");

// Results: each impact can carry a "cv" sentence, so numbers appear in the CV as plain statements.
// Professional skills from about.json → softSkills, written without "I" for the CV.
const soft = (about.softSkills?.items || [])
  .map((x) => `<li><b>${esc(x.name.charAt(0).toUpperCase() + x.name.slice(1))}</b> — ${t(cvVoice(x.use))}</li>`)
  .join("");

const results = (r) => (r.impact || []).filter((m) => m.cv).map((m) => `<li>${t(m.cv)}</li>`).join("");
// A bullet whose figures are already covered by that company's client project (in Projects) is left out,
// so no number is said twice.
const NUM = /\$?\d[\d,.]*\s?[%K]?\+?/g;
const projectFigures = (company) => projects.items
  .filter((p) => p.client && p.points?.length && company.startsWith(p.client))
  .flatMap((p) => p.points.join(" ").match(NUM) || []);
const roles = experience.roles
  .map((r) => {
    const covered = new Set(projectFigures(r.company));
    const bullets = r.highlights.filter((h) => !(h.match(NUM) || []).some((n) => covered.has(n)));
    return `
  <div class="block">
    <div class="head"><span>${esc(r.company)}</span><span>${dates(r.period)}</span></div>
    <div class="sub">${esc(r.role)}</div>
    <ul>${bullets.map((h) => `<li>${t(h)}</li>`).join("")}${results(r)}</ul>
  </div>`;
  })
  .join("");

// Any project with "points" goes in the CV: client work ("– Analytix") and open-source work ("– Open source").
const clientProjects = projects.items
  .filter((p) => p.points?.length && !p.hidden)
  .map((p) => `
  <div class="block">
    <div class="head"><span>${esc(p.title)} – ${esc(p.client || "Open source")}</span><span>${dates(p.period || "")}</span></div>
    <ul>${p.points.map((x) => `<li>${t(x)}</li>`).join("")}</ul>
  </div>`)
  .join("");

const education = credentials.education
  .map((e) => `<div class="head"><span>${esc(e.institution)}</span></div><div class="subrow"><span>${esc(e.degree)}</span><span>${esc(e.period)}</span></div>`)
  .join("");
// Official naming per issuer (the site shows the short names next to the badges).
const certs = credentials.certifications.map((c) => `<li>${esc(officialCertName(c))}</li>`).join("");

const honours = (beyond.achievements || [])
  .map((a) => `
  <div class="block">
    <div class="head"><span>${esc(a.title)} – ${esc(a.issuer)}</span><span>${dates(a.years?.length ? a.years.join(", ") : a.period)}</span></div>
    ${a.text ? `<ul><li>${t(cvVoice(a.text))}</li></ul>` : ""}
  </div>`)
  .join("");
const communities = cv.communities
  ? `
  <div class="block">
    <div class="head"><span>${t(cv.communities.title)}</span><span>${dates(cv.communities.period || "")}</span></div>
    <ul>${cv.communities.points.map((x) => `<li>${t(x)}</li>`).join("")}</ul>
  </div>`
  : "";

const title = `${site.name} – CV`;
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${esc(title)}</title>
<style>
  @font-face { font-family: "CV Serif"; font-weight: 400; src: url("${font("charis-sil-latin-400-normal.woff2")}"); }
  @font-face { font-family: "CV Serif"; font-weight: 400; font-style: italic; src: url("${font("charis-sil-latin-400-italic.woff2")}"); }
  @font-face { font-family: "CV Serif"; font-weight: 700; src: url("${font("charis-sil-latin-700-normal.woff2")}"); }
  @font-face { font-family: "CV Serif"; font-weight: 700; font-style: italic; src: url("${font("charis-sil-latin-700-italic.woff2")}"); }
  @page { size: Letter; margin: 0.38in 0.5in; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: "CV Serif", Charter, Georgia, serif; font-size: 9.6pt; line-height: 1.2; color: #000; }
  a { color: inherit; text-decoration: none; }
  h1 { margin: 0 0 4pt; text-align: center; font-weight: 400; font-size: 26pt; color: #316c56; }
  .contact { margin: 0; padding: 2.5pt 0; border-top: 0.6pt solid #a6823f; border-bottom: 0.6pt solid #a6823f; text-align: center; font-size: 8.4pt; white-space: nowrap; }
  .contact svg { width: 8pt; height: 8pt; vertical-align: -1pt; margin-right: 2pt; }
  .sep { margin: 0 4pt; }
  h2 { margin: 7pt 0 4pt; padding-bottom: 1.5pt; border-bottom: 0.6pt solid #a6823f; font-size: 12.5pt; color: #316c56; }
  .summary { margin: 6pt 0 0; }
  .summary b { font-size: 12.5pt; color: #316c56; }
  .summary .dash { color: #a6823f; margin: 0 3pt; }
  ul { margin: 0; padding-left: 9pt; list-style: "–  "; }
  li { margin: 0 0 1pt; }
  .indent { padding-left: 17pt; }
  .block { padding-left: 8pt; margin-bottom: 3pt; break-inside: avoid; }
  .head { display: flex; justify-content: space-between; gap: 12pt; font-weight: 700; }
  .sub, .subrow { font-style: italic; }
  .subrow { display: flex; justify-content: space-between; }
</style></head>
<body>
  <h1>${esc(site.name)}</h1>
  <p class="contact">${contact}</p>
  <p class="summary"><b>Summary</b><span class="dash">—</span> ${t(cv.summary)}</p>
  <h2>Technical Skills</h2>
  <ul class="indent">${skills}</ul>
  ${soft ? `<h2>Professional Skills</h2><ul class="indent">${soft}</ul>` : ""}
  <h2>Experience</h2>${roles}
  ${clientProjects ? `<h2>Projects</h2>${clientProjects}` : ""}
  <h2>Education</h2>
  <div class="block">${education}</div>
  <div class="block"><div class="head"><span>Certifications</span></div><ul>${certs}</ul></div>
  <h2>Leadership &amp; Community</h2>${honours}${communities}
</body></html>`;

// ---------- print with headless Chrome ----------
function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome", "/usr/bin/google-chrome-stable", "/usr/bin/chromium", "/usr/bin/chromium-browser",
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
  ].filter(Boolean);
  return candidates.find((c) => existsSync(c));
}

const chrome = findChrome();
if (!chrome) {
  console.error("✖ CV not built: Google Chrome or Chromium was not found. Install Chrome or set CHROME_PATH.");
  process.exit(1);
}

const work = mkdtempSync(path.join(tmpdir(), "cv-"));
try {
  const htmlFile = path.join(work, "cv.html");
  const rawPdf = path.join(work, "cv.pdf");
  writeFileSync(htmlFile, html);
  execFileSync(chrome, [
    "--headless=new", "--disable-gpu", ...(process.env.CI ? ["--no-sandbox"] : []), "--no-pdf-header-footer",
    `--user-data-dir=${path.join(work, "profile")}`, `--print-to-pdf=${rawPdf}`, pathToFileURL(htmlFile).href,
  ], { stdio: "ignore", timeout: 120000 });

  // Document properties shown by search engines, PDF viewers and ATS tools.
  const pdf = await PDFDocument.load(readFileSync(rawPdf));
  pdf.setTitle(title);
  pdf.setAuthor(site.name);
  pdf.setSubject(`${resolveRole(site, experience)} – CV`);
  pdf.setKeywords(["Data & AI", "Microsoft Fabric", "Power BI", "Tableau", "GenAI", "Machine Learning", "Data Scientist", (site.location || "").split(",")[0]].filter(Boolean));
  pdf.setCreator("devanshutayal.com");
  pdf.setProducer("devanshutayal.com");

  const out = path.join(root, "dist", site.cv.replace(/^\//, ""));
  mkdirSync(path.dirname(out), { recursive: true });
  writeFileSync(out, await pdf.save());
  console.log(`✓ CV built from the site content → dist${site.cv} (${pdf.getPageCount()} pages)`);
} finally {
  // Always clean up the temporary folder, even if Chrome fails.
  rmSync(work, { recursive: true, force: true });
}
