// Single entry point for all editable content. Edit the JSON files in src/content/.
import site from "../content/site.json";
import about from "../content/about.json";
import experience from "../content/experience.json";
import projects from "../content/projects.json";
import beyond from "../content/beyond.json";
import credentials from "../content/credentials.json";
import navigation from "../content/navigation.json";

// Whole years since a YYYY-MM-DD date, compared on the visitor's local calendar
// (avoids the UTC off-by-one-day flip of new Date("YYYY-MM-DD")).
function yearsSince(dateString) {
  const [y, m, d] = dateString.split("-").map(Number);
  const now = new Date();
  let years = now.getFullYear() - y;
  if (now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d)) years -= 1;
  return years;
}

// Replaces "{years}" in any content text with the live years of experience.
export const fillYears = (text) => String(text).replaceAll("{years}", String(yearsSince(site.careerStart)));

// Stats can be computed instead of typed:
//   "auto:years"          -> full years since site.careerStart, e.g. "8+"
//   "auto:certifications" -> number of entries in credentials.json certifications
export function statValue(value) {
  if (value === "auto:years") return `${yearsSince(site.careerStart)}+`;
  if (value === "auto:certifications") return String(credentials.certifications.length);
  return value;
}

// Responsive portrait: full image (1199px wide) plus an optional ~640px version for phones.
export const PORTRAIT_SIZES = "(max-width: 899px) 82vw, 560px";
export const portraitSrcSet = (full, small) => (small ? `${small} 640w, ${full} 1199w` : undefined);

export const isExternal = (url) => /^(https?:|mailto:)/.test(url);

export { site, about, experience, projects, beyond, credentials, navigation };
