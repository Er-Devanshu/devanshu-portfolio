// Runs after `vite build`. Writes one static HTML file per page (dist/about/index.html, …)
// with that page's own title, description, canonical URL, share tags and preload, plus a
// real 404 page, a dated sitemap and llms.txt. The site still runs as a React app; these
// files make sure link previews (LinkedIn, WhatsApp, X), AI crawlers and anything that
// doesn't run JavaScript see the right information for every page.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { makeFill, officialCertName, resolveRole } from "../src/lib/derive.js";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const read = (f) => JSON.parse(readFileSync(path.join(root, "src/content", f), "utf8"));
const site = read("site.json");
const about = read("about.json");
const credentials = read("credentials.json");
const beyond = read("beyond.json");
const navigation = read("navigation.json");
const experience = read("experience.json");
const fill = makeFill({ site, experience, credentials, beyond });

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
  alternateName: site.name.replace(/^Er\.\s*/, ""),
  honorificPrefix: "Er.",
  jobTitle: resolveRole(site, experience),
  url: `${ORIGIN}/`,
  image: `${ORIGIN}/og-image.jpg`,
  worksFor: { "@type": "Organization", name: fill("{company}") },
  address: { "@type": "PostalAddress", addressLocality: (site.location || "").split(",")[0].trim() || undefined, addressRegion: "Gujarat", addressCountry: "IN" },
  makesOffer: ["Microsoft Fabric data platforms", "Power BI and Tableau business intelligence", "GenAI and machine learning consulting"].map((name) => ({
    "@type": "Offer", areaServed: "Worldwide", itemOffered: { "@type": "Service", name },
  })),
  alumniOf: credentials.education.map((e) => ({ "@type": "CollegeOrUniversity", name: e.institution })),
  hasCredential: credentials.certifications.map((c) => ({
    "@type": "EducationalOccupationalCredential",
    name: c.name,
    credentialCategory: "certification",
    recognizedBy: { "@type": "Organization", name: c.issuer },
  })),
  // Only honours (entries with "years") are awards; teaching and reviewing are roles.
  award: (beyond.achievements || []).filter((a) => a.years?.length).map((a) => `${a.title}, ${a.issuer} (${a.years.join(", ")})`),
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
  const links = [...navigation.primary, navigation.cta]
    .map((l) => `<a href="${esc(l.path)}">${esc(l.label)}</a>`).join(" · ");
  return `<noscript><main style="font-family:system-ui,sans-serif;max-width:680px;margin:48px auto;padding:0 20px;color:#f4f0e9;background:#101415"><h1>${esc(title)}</h1><p>${esc(description)}</p><p>${links}</p><p><a href="${esc(site.socials[0].url)}">LinkedIn</a></p></main></noscript>`;
}

// Search Console / Bing Webmaster verification, only when set in site.json seo.
const verification = [
  site.seo.googleVerification && `<meta name="google-site-verification" content="${esc(site.seo.googleVerification)}" />`,
  site.seo.bingVerification && `<meta name="msvalidate.01" content="${esc(site.seo.bingVerification)}" />`,
].filter(Boolean).join("\n    ");

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
    .replace(/(<meta property="og:image:alt" content=")[^"]*/, `$1${esc(`${site.name}, ${resolveRole(site, experience)}`)}`)
    .replace("<!--verification-->", verification)
    .replace(/(<meta name="twitter:title" content=")[^"]*/, `$1${esc(title)}`)
    .replace(/(<meta name="twitter:description" content=")[^"]*/, `$1${esc(description)}`)
    .replace(/(<link rel="canonical" href=")[^"]*/, `$1${url}`)
    .replace("<!--page-preload-->", preload)
    .replace("<!--structured-data-->", robots.startsWith("noindex") ? "" : structuredData(route, title, description))
    .replace("<!--noscript-->", noscript(title, description));
  if (robots.startsWith("noindex")) html = html.replace(/\s*<link rel="canonical"[^>]*>/, "").replace(/\s*<meta property="og:url"[^>]*>/, "");
  return html;
}

const pages = Object.fromEntries(
  Object.entries(site.seo.pages).map(([r, m]) => [r, { ...m, title: fill(m.title), description: fill(m.description) }])
);
for (const [route, meta] of Object.entries(pages)) {
  const file = route === "/" ? path.join(dist, "index.html") : path.join(dist, route.slice(1), "index.html");
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, render(route, meta));
}

// Real 404 page (served by Apache with a 404 status; the React app renders "Page not found").
writeFileSync(
  path.join(dist, "404.html"),
  render("/404", { title: `Page not found — ${site.name}`, description: fill(site.seo.description), robots: "noindex, follow" })
);

// Sitemap. No <lastmod>: a build date on every page would tell search engines everything changed on each push.
writeFileSync(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${Object.keys(pages)
    .map((r) => `  <url><loc>${ORIGIN}${r}</loc></url>`)
    .join("\n")}${site.cv && existsSync(path.join(dist, site.cv)) ? `\n  <url><loc>${ORIGIN}${site.cv}</loc></url>` : ""}\n</urlset>\n`
);

// llms.txt: a short, plain summary for AI assistants and search tools.
const llms = [
  `# ${site.name}`,
  "",
  `> ${fill(site.seo.description)}`,
  "",
  "## Facts",
  `- Current role: ${resolveRole(site, experience)} at ${fill("{company}")}`,
  `- Location: ${site.location || "India"} (IST); remote, hybrid or on-site; open to relocation`,
  "- Open to: full-time, part-time, freelance and consulting work",
  `- Experience: ${fill("{years}")}+ years in data, BI, machine learning and generative AI`,
  `- Certifications: ${credentials.certifications.map(officialCertName).join("; ")}`,
  ...(site.cv ? [`- CV: ${ORIGIN}${site.cv}`] : []),
  `- Contact: ${ORIGIN}/contact (LinkedIn or email)`,
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
