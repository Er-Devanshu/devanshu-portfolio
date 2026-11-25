// Single entry point for all editable content. Edit the JSON files in src/content/.
import site from "../content/site.json";
import about from "../content/about.json";
import experience from "../content/experience.json";
import projects from "../content/projects.json";
import beyond from "../content/beyond.json";
import credentials from "../content/credentials.json";
import navigation from "../content/navigation.json";

import { careerList, makeFill, resolveRole, yearsSince } from "./derive";

// Fills placeholders like {years}, {role}, {company}, {certifications} in content text.
// The full list is at the top of src/lib/derive.js.
export const fill = makeFill({ site, experience, credentials, beyond });

// Job title shown in the hero: typed in site.json, or "auto:role" for the current job.
export const siteRole = resolveRole(site, experience);

// Company of the current role, short form ("Aegis Soft Tech").
export const currentCompany = fill("{company}");

// Career list on the About page, built from experience.json (newest first).
export const career = careerList(experience);

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
