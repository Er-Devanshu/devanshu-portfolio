// Runs after `vite build`. Writes one static HTML file per page (dist/about/index.html, …)
// with that page's own title, description, canonical URL, share tags and preload, plus a
// real 404 page, a dated sitemap and llms.txt. The site still runs as a React app; these
// files make sure link previews (LinkedIn, WhatsApp, X), AI crawlers and anything that
// doesn't run JavaScript see the right information for every page.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const read = (f) => JSON.parse(readFileSync(path.join(root, "src/content", f), "utf8"));
const site = read("site.json");
const about = read("about.json");
const credentials = read("credentials.json");
const beyond = read("beyond.json");
const navigation = read("navigation.json");

const ORIGIN = "https://www.devanshutayal.com";
const template = readFileSync(path.join(dist, "index.html"), "utf8");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Which portrait each page shows first, so the browser can fetch it early (and only there).
const PRELOAD = {
  "/": [site.photo, site.photoSmall],
  "/about": [site.aboutPhoto, site.aboutPhotoSmall],
  "/contact": [site.contactPhoto, site.contactPhotoSmall],
};
const PORTRAIT_SIZES = "(max-width: 899px) 82vw, 560px"; // keep in sync with src/lib/content.js

const person = {
  "@type": "Person",
  "@id": `${ORIGIN}/#person`,
  name: site.name,
  jobTitle: site.role,
  url: `${ORIGIN}/`,
  image: `${ORIGIN}/og-image.jpg`,
  email: `mailto:${site.email}`,
  address: { "@type": "PostalAddress", addressCountry: "IN" },
  alumniOf: credentials.education.map((e) => ({ "@type": "CollegeOrUniversity", name: e.institution })),
  hasCredential: credentials.certifications.map((c) => ({
    "@type": "EducationalOccupationalCredential",
    name: c.name,
    credentialCategory: "certification",
    recognizedBy: { "@type": "Organization", name: c.issuer },
  })),
  award: (beyond.achievements || []).map((a) => `${a.title}, ${a.issuer} (${a.period})`),
  memberOf: (beyond.communities || []).map((c) => ({ "@type": "Organization", name: c.name, ...(c.url ? { url: c.url } : {}) })),
  knowsAbout: about.skills.groups.flatMap((g) => g.items.map((i) => i.name)),
  sameAs: site.socials.map((s) => s.url),
};
const website = { "@type": "WebSite", "@id": `${ORIGIN}/#website`, url: `${ORIGIN}/`, name: site.name, inLanguage: "en" };

function structuredData(route, title, description) {
  const page = {
    "@type": route === "/" || route === "/about" ? "ProfilePage" : "WebPage",
    "@id": `${ORIGIN}${route}#page`,
    url: ORIGIN + route,
    name: title,
    description,
    isPartOf: { "@id": website["@id"] },
    about: { "@id": person["@id"] },
    ...(route === "/" || route === "/about" ? { mainEntity: { "@id": person["@id"] } } : {}),
  };
  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": [person, website, page] });
  return `<script type="application/ld+json">${json.replace(/</g, "\\u003c")}</script>`;
}

// A plain-text version of the page for anything that doesn't run JavaScript.
function noscript(title, description) {
  const links = [...navigation.primary, ...(navigation.more || []), navigation.cta]
    .map((l) => `<a href="${esc(l.path)}">${esc(l.label)}</a>`).join(" · ");
  return `<noscript><main style="font-family:system-ui,sans-serif;max-width:680px;margin:48px auto;padding:0 20px;color:#f4f0e9;background:#101415"><h1>${esc(title)}</h1><p>${esc(description)}</p><p>${links}</p><p><a href="${esc(site.socials[0].url)}">LinkedIn</a></p></main></noscript>`;
}

function render(route, { title, description, robots = "index, follow" }) {
  const url = ORIGIN + route;
  const [full, small] = PRELOAD[route] || [];
  const preload = full
    ? `<link rel="preload" as="image" href="${esc(full)}"${small ? ` imagesrcset="${esc(small)} 640w, ${esc(full)} 1199w" imagesizes="${PORTRAIT_SIZES}"` : ""} type="image/webp" fetchpriority="high" />`
    : "";
  let html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${esc(description)}`)
    .replace(/(<meta name="robots" content=")[^"]*/, `$1${robots}`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${esc(title)}`)
    .replace(/(<meta property="og:description" content=")[^"]*/, `$1${esc(description)}`)
    .replace(/(<meta property="og:url" content=")[^"]*/, `$1${url}`)
    .replace(/(<meta name="twitter:title" content=")[^"]*/, `$1${esc(title)}`)
    .replace(/(<meta name="twitter:description" content=")[^"]*/, `$1${esc(description)}`)
    .replace(/(<link rel="canonical" href=")[^"]*/, `$1${url}`)
    .replace("<!--page-preload-->", preload)
    .replace("<!--structured-data-->", robots.startsWith("noindex") ? "" : structuredData(route, title, description))
    .replace("<!--noscript-->", noscript(title, description));
  if (robots.startsWith("noindex")) html = html.replace(/\s*<link rel="canonical"[^>]*>/, "");
  return html;
}

const pages = site.seo.pages;
for (const [route, meta] of Object.entries(pages)) {
  const file = route === "/" ? path.join(dist, "index.html") : path.join(dist, route.slice(1), "index.html");
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, render(route, meta));
}

// Real 404 page (served by Apache with a 404 status; the React app renders "Page not found").
writeFileSync(
  path.join(dist, "404.html"),
  render("/404", { title: `Page not found — ${site.name}`, description: site.seo.description, robots: "noindex, follow" })
);

// Sitemap with today's date as last modified.
const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${Object.keys(pages)
    .map((r) => `  <url><loc>${ORIGIN}${r}</loc><lastmod>${today}</lastmod></url>`)
    .join("\n")}\n</urlset>\n`
);

// llms.txt: a short, plain summary for AI assistants and search tools.
const llms = [
  `# ${site.name}`,
  "",
  `> ${site.seo.description}`,
  "",
  "## Pages",
  ...Object.entries(pages).map(([r, m]) => `- [${m.title}](${ORIGIN}${r}): ${m.description}`),
  "",
  "## Profiles",
  ...site.socials.map((s) => `- [${s.label}](${s.url})`),
  "",
];
writeFileSync(path.join(dist, "llms.txt"), llms.join("\n"));

console.log(`✓ Prerendered ${Object.keys(pages).length} pages + 404, sitemap and llms.txt`);
