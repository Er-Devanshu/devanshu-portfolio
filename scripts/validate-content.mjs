// Checks every JSON content file before a build, so a typo never ships.
// Run: npm run check:content (also runs automatically before `npm run build`).
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "../src/content");
const errors = [];

function load(name) {
  try {
    return JSON.parse(readFileSync(path.join(dir, name), "utf8"));
  } catch (e) {
    errors.push(`${name}: not valid JSON — ${e.message}`);
    return null;
  }
}

const str = (file, obj, key, where = "") => {
  if (!obj || typeof obj[key] !== "string" || !obj[key].trim()) {
    errors.push(`${file}${where}: "${key}" must be a non-empty text value`);
  }
};
const arr = (file, obj, key, where = "") => {
  if (!obj || !Array.isArray(obj[key]) || obj[key].length === 0) {
    errors.push(`${file}${where}: "${key}" must be a list with at least one item`);
    return [];
  }
  return obj[key];
};
const url = (file, value, where) => {
  if (typeof value !== "string" || !/^(https?:\/\/|\/|mailto:)/.test(value)) {
    errors.push(`${file}${where}: link "${value}" must start with https://, / or mailto:`);
  }
};

const site = load("site.json");
if (site) {
  ["name", "firstName", "lastName", "role", "tagline", "email", "careerStart", "quote"].forEach((k) => str("site.json", site, k));
  if (site.careerStart && Number.isNaN(Date.parse(site.careerStart))) errors.push(`site.json: "careerStart" must be a date like 2018-02-09`);
  arr("site.json", site, "stats").forEach((s, i) => { str("site.json", s, "value", ` stats[${i}]`); str("site.json", s, "label", ` stats[${i}]`); if (s.url) url("site.json", s.url, ` stats[${i}]`); });
  arr("site.json", site, "socials").forEach((s, i) => { str("site.json", s, "label", ` socials[${i}]`); url("site.json", s.url, ` socials[${i}]`); });
}

const about = load("about.json");
if (about) {
  str("about.json", about, "title");
  arr("about.json", about, "bio");
  arr("about.json", about, "journey").forEach((j, i) => { str("about.json", j, "period", ` journey[${i}]`); str("about.json", j, "title", ` journey[${i}]`); });
  const sk = about.skills;
  const skillItem = (it, w) => {
    if (!it || typeof it !== "object") { errors.push(`about.json${w}: must be an object like { "name": "Python" }`); return; }
    str("about.json", it, "name", w);
    str("about.json", it, "use", w);
  };
  if (!sk || typeof sk !== "object" || Array.isArray(sk)) errors.push(`about.json: "skills" must be an object with "groups"`);
  else {
    arr("about.json", sk, "groups", " skills").forEach((g, i) => {
      const w = ` skills.groups[${i}]`;
      str("about.json", g, "group", w); str("about.json", g, "descriptor", w);
      arr("about.json", g, "items", w).forEach((it, k) => skillItem(it, `${w}.items[${k}]`));
    });
  }
}

const exp = load("experience.json");
if (exp) {
  arr("experience.json", exp, "roles").forEach((r, i) => {
    ["role", "company", "period"].forEach((k) => str("experience.json", r, k, ` roles[${i}]`));
    arr("experience.json", r, "highlights", ` roles[${i}]`);
  });
}

const projects = load("projects.json");
if (projects) {
  const cats = arr("projects.json", projects, "categories");
  arr("projects.json", projects, "items").forEach((p, i) => {
    const w = ` items[${i}] (${p.title || "untitled"})`;
    ["title", "summary", "category"].forEach((k) => str("projects.json", p, k, w));
    url("projects.json", p.url, w);
    if (p.category && !cats.includes(p.category)) errors.push(`projects.json${w}: category "${p.category}" is not in "categories" (${cats.join(", ")})`);
    if (p.image) url("projects.json", p.image, w);
  });
}

const beyond = load("beyond.json");
if (beyond) {
  arr("beyond.json", beyond, "communities").forEach((c, i) => ["name", "role", "period", "text"].forEach((k) => str("beyond.json", c, k, ` communities[${i}]`)));
  arr("beyond.json", beyond, "achievements").forEach((a, i) => ["title", "issuer", "period", "text"].forEach((k) => str("beyond.json", a, k, ` achievements[${i}]`)));
  (beyond.testimonials || []).forEach((t, i) => ["name", "role", "quote"].forEach((k) => str("beyond.json", t, k, ` testimonials[${i}]`)));
}

const cred = load("credentials.json");
if (cred) {
  arr("credentials.json", cred, "education");
  arr("credentials.json", cred, "certifications").forEach((c, i) => {
    ["name", "issuer"].forEach((k) => str("credentials.json", c, k, ` certifications[${i}]`));
    if (c.logo) url("credentials.json", c.logo, ` certifications[${i}].logo`);
  });
}

const nav = load("navigation.json");
if (nav) arr("navigation.json", nav, "primary");

if (errors.length) {
  console.error(`\n✖ Content check failed (${errors.length}):\n  - ${errors.join("\n  - ")}\n`);
  process.exit(1);
}
console.log("✓ Content check passed");
