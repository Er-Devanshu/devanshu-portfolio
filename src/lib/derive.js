// Facts worked out from the content files, so each fact is typed in one place only.
// Used by the site (src/lib/content.js) and by the build (scripts/prerender.mjs).
//
// Placeholders you can use in content text:
//   {years}          full years since site.careerStart            e.g. 8
//   {role}           job title of your current role               from experience.json
//   {company}        company of your current role (short name)    from experience.json
//   {certifications} your certifications as one readable list     from credentials.json
//   {certCount}      how many certifications                      from credentials.json
//   {companies}      how many companies you've worked at          from experience.json
//   {communities}    how many communities you lead                from beyond.json

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const isNow = (s) => /^(present|now|current)$/i.test(String(s).trim());

// "Jan 2022" -> month number; "Present" -> Infinity (always the latest).
function monthOf(part) {
  if (!part || isNow(part)) return Infinity;
  const [mon, year] = part.trim().split(/\s+/);
  const m = MONTHS.indexOf((mon || "").slice(0, 3).toLowerCase());
  return Number(year) * 12 + Math.max(m, 0);
}
const bounds = (period) => {
  const [a, b] = String(period).split(/\s*[–-]\s*/);
  return { start: monthOf(a), end: monthOf(b ?? a) };
};

export function yearsSince(dateString, now = new Date()) {
  const [y, m, d] = dateString.split("-").map(Number);
  let years = now.getFullYear() - y;
  if (now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d)) years -= 1;
  return years;
}

// "Analytix Business Solutions Pvt. Ltd" -> "Analytix Business Solutions"
export const shortCompany = (name) =>
  String(name).replace(/[\s,]+(Pvt\.?\s*Ltd\.?|Private Limited|Ltd\.?|Inc\.?|LLC|LLP)$/i, "").trim();

// The current role: one that runs to "Present", otherwise the one that ended last.
export function currentRole(experience) {
  const roles = experience?.roles || [];
  return [...roles].sort((x, y) => {
    const a = bounds(x.period), b = bounds(y.period);
    return b.end - a.end || b.start - a.start;
  })[0];
}

// Roles newest first, as a short career list: { period: "2022 – 2026", title, org }.
export function careerList(experience) {
  return [...(experience?.roles || [])]
    .sort((x, y) => bounds(y.period).start - bounds(x.period).start)
    .map((r) => {
      const [a, b] = String(r.period).split(/\s*[–-]\s*/);
      const year = (p) => (isNow(p) ? "Present" : p.trim().split(/\s+/).pop());
      const from = year(a), to = year(b ?? a);
      return { period: from === to ? from : `${from} – ${to}`, title: r.role, org: shortCompany(r.company) };
    });
}

// "A, B and C"
const readableList = (items) =>
  items.length <= 1 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

// Certifications marked "headline": true are listed; if none are marked, all are.
export function certificationList(credentials) {
  const all = credentials?.certifications || [];
  const chosen = all.some((c) => c.headline) ? all.filter((c) => c.headline) : all;
  return readableList(chosen.map((c) => c.short || c.name));
}

export function makeFill({ site, experience, credentials, beyond }, now = new Date()) {
  const cur = currentRole(experience) || {};
  const values = {
    years: () => String(yearsSince(site.careerStart, now)),
    role: () => cur.role || "",
    company: () => shortCompany(cur.company || ""),
    certifications: () => certificationList(credentials),
    certCount: () => String(credentials?.certifications?.length || 0),
    companies: () => String(new Set((experience?.roles || []).map((r) => shortCompany(r.company))).size),
    communities: () => String(beyond?.communities?.length || 0),
  };
  return (text) => String(text ?? "").replace(/\{(\w+)\}/g, (all, key) => (values[key] ? values[key]() : all));
}

// site.role can be typed, or "auto:role" to always show the current job title.
export const resolveRole = (site, experience) =>
  site.role === "auto:role" ? currentRole(experience)?.role || "" : site.role;
