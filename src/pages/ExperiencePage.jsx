import { TrendingDown, TrendingUp } from "lucide-react";
import { experience } from "../lib/content";
import usePageTitle from "../hooks/usePageTitle";
import "./ExperiencePage.css";

function Impact({ items }) {
  if (!items?.length) return null;
  return (
    <aside className="xp-impact" aria-label="Impact">
      <p className="xp-impact-title">Impact</p>
      <ul>
        {items.map((m) => {
          const down = m.direction === "down";
          return (
            <li key={m.value + m.label}>
              <span className="xp-value">
                {down ? <TrendingDown aria-hidden="true" /> : <TrendingUp aria-hidden="true" />}
                <span className="visually-hidden">{down ? "Down " : "Up "}</span>
                {m.value}
              </span>
              <span className="xp-label">{m.label}</span>
              {m.note && <span className="xp-note">{m.note}</span>}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export default function ExperiencePage() {
  usePageTitle(experience.title);
  return (
    <>
      <header className="xp-hero container">
        <h1>{experience.title}</h1>
        <p className="xp-intro">{experience.intro}</p>
      </header>

      <ol className="xp-list container">
        {experience.roles.map((r) => (
          <li key={r.company + r.period} className="xp-card">
            <div className="xp-head">
              <div>
                <h2 className="xp-role">{r.role}</h2>
                <p className="xp-company">{r.company}</p>
              </div>
              <p className="xp-period">{r.period}</p>
            </div>
            <div className="xp-body">
              <ul className="xp-points">
                {r.highlights.map((h) => <li key={h}>{h}</li>)}
              </ul>
              <Impact items={r.impact} />
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
