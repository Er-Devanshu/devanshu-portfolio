import { flushSync } from "react-dom";
import { useSearchParams } from "react-router-dom";
import { projects } from "../lib/content";
import { ProjectCover } from "../components/ui/ProjectCover";
import Icon from "../components/ui/Icon";
import usePageTitle from "../hooks/usePageTitle";
import "./ProjectsPage.css";

const linkProps = (url) => (/^https?:/.test(url) ? { target: "_blank", rel: "noopener noreferrer" } : {});
const isExt = (url) => /^https?:/.test(url);

// Each category gets its own warm accent, so the grid reads as varied but stays on brand.
const TINT = { "Client work": "#f0a35e", "AI & LLMs": "#ef9148", "Machine Learning": "#e3b155", NLP: "#e07f5c", Forecasting: "#cfa772", Dashboards: "#f2c18d" };
const tint = (cat) => TINT[cat] || "#ef9148";
const ctaFor = (url) => (/public\.tableau\.com/.test(url) ? "View live dashboard" : /github\.com/.test(url) ? "View code" : "View project");

// Soft light that follows the pointer across a card.
const spotlight = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

function Cover({ project }) {
  return project.image
    ? <img src={project.image} alt="" loading="lazy" width="640" height="360" />
    : <ProjectCover project={project} />;
}

export default function ProjectsPage() {
  usePageTitle(projects.title);
  const [params, setParams] = useSearchParams();
  const requested = params.get("category");
  // "hidden": true keeps a project in the file but off the site; filters only show categories in use.
  const visible = projects.items.filter((p) => !p.hidden);
  const categories = projects.categories.filter((c) => visible.some((p) => p.category === c));
  const active = categories.includes(requested) ? requested : "All";
  const filtered = active === "All" ? visible : visible.filter((p) => p.category === active);

  const select = (cat) => {
    if (cat === active) return;
    const next = new URLSearchParams(params);
    if (cat === "All") next.delete("category"); else next.set("category", cat);
    const apply = () => setParams(next, { replace: true });
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (document.startViewTransition && !reduce) document.startViewTransition(() => flushSync(apply));
    else apply();
  };

  return (
    <>
      <div className="container projects-page">
        <header className="page-hero">
          <h1>{projects.title}</h1>
          <p className="lead">{projects.intro}</p>
        </header>

        <div className="filter-bar" role="group" aria-label="Filter projects by category">
          {["All", ...categories].map((cat) => {
            const count = cat === "All" ? visible.length : visible.filter((p) => p.category === cat).length;
            return (
              <button key={cat} type="button" className="filter-pill" aria-pressed={active === cat} onClick={() => select(cat)}>
                {cat}<span className="filter-pill-count" aria-hidden="true">{count}</span>
              </button>
            );
          })}
        </div>
        <p className="visually-hidden" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "project" : "projects"}{active !== "All" ? ` in ${active}` : ""}
        </p>

        {filtered.length > 0 ? (
          <ul className="projects-stage project-grid">
            {filtered.map((p, i) => (
              <li key={p.title} className={`project-card${i === 0 ? " is-featured" : ""}${p.url ? "" : " is-static"}`}
                style={{ "--tint": tint(p.category) }} onPointerMove={spotlight}>
                <div className="project-card-cover" aria-hidden="true">
                  <Cover project={p} />
                  {i === 0 && <span className="project-card-flag">Featured</span>}
                </div>
                <div className="project-card-body">
                  <span className="project-card-cat">{p.category}</span>
                  <h2 className="project-card-title">
                    {p.url ? (
                      <a href={p.url} className="project-card-link" {...linkProps(p.url)}>
                        {p.title}
                        {isExt(p.url) && <span className="visually-hidden"> (opens in a new tab)</span>}
                      </a>
                    ) : p.title}
                  </h2>
                  <p className="project-card-summary">{p.summary}</p>
                  {p.shows && (
                    <p className="project-card-shows"><span>What it shows</span>{p.shows}</p>
                  )}
                  <div className="project-card-foot">
                    {p.tags?.length > 0 && (
                      <ul className="project-card-tags" aria-label="Built with">
                        {p.tags.map((t) => <li key={t}>{t}</li>)}
                      </ul>
                    )}
                    {p.url
                      ? <span className="project-card-cta" aria-hidden="true">{ctaFor(p.url)} <Icon name="external" size={16} /></span>
                      : <span className="project-card-client">Client project{p.client ? ` · ${p.client}` : ""}{p.period ? ` · ${p.period}` : ""}</span>}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="projects-empty">
            <p>No projects in this category yet.</p>
            <button type="button" className="btn btn-secondary" onClick={() => select("All")}>Show all projects</button>
          </div>
        )}
      </div>
    </>
  );
}
