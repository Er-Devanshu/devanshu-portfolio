import { flushSync } from "react-dom";
import { useSearchParams } from "react-router-dom";
import { projects } from "../lib/content";
import { ProjectCover } from "../components/ui/ProjectCard";
import Icon from "../components/ui/Icon";
import usePageTitle from "../hooks/usePageTitle";
import "./ProjectsPage.css";

const linkProps = (url) => (/^https?:/.test(url) ? { target: "_blank", rel: "noopener noreferrer" } : {});
const isExt = (url) => /^https?:/.test(url);

function Cover({ project }) {
  return project.image
    ? <img src={project.image} alt="" loading="lazy" width="640" height="360" />
    : <ProjectCover project={project} />;
}

export default function ProjectsPage() {
  usePageTitle(projects.title);
  const [params, setParams] = useSearchParams();
  const requested = params.get("category");
  const active = projects.categories.includes(requested) ? requested : "All";
  const filtered = active === "All" ? projects.items : projects.items.filter((p) => p.category === active);
  // Lead with a featured project when the current filter has one.
  const leadIndex = Math.max(0, filtered.findIndex((p) => p.featured));
  const lead = filtered[leadIndex];
  const rest = filtered.filter((_, i) => i !== leadIndex);

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
          {["All", ...projects.categories].map((cat) => (
            <button key={cat} type="button" className="filter-pill" aria-pressed={active === cat} onClick={() => select(cat)}>
              {cat}
            </button>
          ))}
        </div>

        <p className="filter-count" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "project" : "projects"}{active !== "All" ? ` in ${active}` : ""}
        </p>

        {lead ? (
          <div className="projects-stage">
            <article className="project-lead">
              <div className="project-lead-cover" aria-hidden="true"><Cover project={lead} /></div>
              <div className="project-lead-body">
                <h2>
                  <a href={lead.url} className="project-lead-link" {...linkProps(lead.url)}>
                    {lead.title}
                    {isExt(lead.url) && <span className="visually-hidden"> (opens in a new tab)</span>}
                  </a>
                </h2>
                <p className="project-lead-summary">{lead.summary}</p>
                <p className="project-lead-tags"><span className="project-lead-cat">{lead.category}</span>{lead.tags?.length > 0 && ` / ${lead.tags.join(" / ")}`}</p>
                <span className="project-lead-cta" aria-hidden="true">View project <Icon name="external" size={16} /></span>
              </div>
            </article>

            {rest.length > 0 && (
              <ol className="project-index" start={2}>
                {rest.map((p, i) => (
                  <li key={`${p.title}-${p.url}`} className="project-row">
                    <span className="project-row-num" aria-hidden="true">{String(i + 2).padStart(2, "0")}</span>
                    <div className="project-row-thumb" aria-hidden="true"><Cover project={p} /></div>
                    <div className="project-row-main">
                      <h3>
                        <a href={p.url} className="project-row-link" {...linkProps(p.url)}>
                          {p.title}
                          {isExt(p.url) && <span className="visually-hidden"> (opens in a new tab)</span>}
                        </a>
                      </h3>
                      <p>{p.summary}</p>
                    </div>
                    <div className="project-row-meta">
                      <span className="project-row-cat">{p.category}</span>
                      {p.tags?.length > 0 && <span className="project-row-tags">{p.tags.join(" / ")}</span>}
                    </div>
                    <Icon name="external" size={18} className="project-row-arrow" />
                  </li>
                ))}
              </ol>
            )}
          </div>
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
