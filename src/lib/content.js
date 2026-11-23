// Single entry point for all editable content. Edit the JSON files in src/content/.
import site from "../content/site.json";
import about from "../content/about.json";
import experience from "../content/experience.json";
import projects from "../content/projects.json";
import beyond from "../content/beyond.json";
import credentials from "../content/credentials.json";
import navigation from "../content/navigation.json";

export function yearsSince(dateString) {
  const ms = Date.now() - new Date(dateString).getTime();
  return Math.floor(ms / (365.25 * 24 * 60 * 60 * 1000));
}

// Stats can be computed instead of typed:
//   "auto:years"          -> full years since site.careerStart, e.g. "8+"
//   "auto:certifications" -> number of entries in credentials.json certifications
export function statValue(value) {
  if (value === "auto:years") return `${yearsSince(site.careerStart)}+`;
  if (value === "auto:certifications") return String(credentials.certifications.length);
  return value;
}

export const isExternal = (url) => /^(https?:|mailto:)/.test(url);

export { site, about, experience, projects, beyond, credentials, navigation };
