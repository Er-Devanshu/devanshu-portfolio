import CountUp from "./CountUp";
import "./CaseStudies.css";

// Client work told as problem -> what was built -> result (Home page).
export default function CaseStudies({ items = [], limit }) {
  const list = limit ? items.slice(0, limit) : items;
  if (!list.length) return null;

  return (
      <ol className="cs-cards">
        {list.map((c) => (
          <li key={c.title} className="cs-card reveal">
            <p className="cs-meta">{c.company} · {c.year}</p>
            <h3 className="cs-title">{c.title}</h3>
            <p className="cs-problem">{c.problem}</p>
              {c.result && (
              <p className="cs-result">
                <span className="cs-result-value"><CountUp value={c.result.value} /></span>
                <span className="cs-result-label">{c.result.label}</span>
              </p>
            )}
          </li>
        ))}
      </ol>
    );
}
