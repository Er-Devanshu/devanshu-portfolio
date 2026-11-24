import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { experience, fillYears } from "../lib/content";
import usePageTitle from "../hooks/usePageTitle";
import "./ExperiencePage.css";

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

// "Jan 2022 – Jan 2026" or "Jul 2026 – Present" -> month indexes (end inclusive).
// The content check (scripts/validate-content.mjs) guarantees this format.
const nowMonth = () => { const d = new Date(); return d.getFullYear() * 12 + d.getMonth(); };
function toMonth(part) {
  if (/^(present|now|current)$/i.test(part.trim())) return nowMonth();
  const [mon, year] = part.trim().split(/\s+/);
  const m = MONTHS.indexOf((mon || "").slice(0, 3).toLowerCase());
  return Number.isFinite(Number(year)) && m >= 0 ? Number(year) * 12 + m : nowMonth();
}
function parsePeriod(period) {
  const [a, b] = period.split(/\s*[–-]\s*/);
  const start = toMonth(a);
  return { start, end: Math.max(start, toMonth(b ?? a)) + 1 };
}

// "3 yrs 2 mos", "10 mos"
function duration(months) {
  const y = Math.floor(months / 12);
  const m = months % 12;
  const parts = [];
  if (y) parts.push(`${y} yr${y > 1 ? "s" : ""}`);
  if (m) parts.push(`${m} mo${m > 1 ? "s" : ""}`);
  return parts.join(" ") || "1 mo";
}

// Short company name for the career path: drop legal suffixes and "Business Solutions".
const shortName = (company) =>
  company.replace(/\s+(Pvt\.?\s*Ltd\.?|Private Limited|Ltd\.?|Inc\.?|LLC)$/i, "").replace(/\s+Business Solutions$/i, "");

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const roles = experience.roles.map((r, i) => {
  const p = parsePeriod(r.period);
  return { ...r, ...p, id: `role-${i}-${slug(r.company)}`, months: p.end - p.start };
});
const path = [...roles].sort((a, b) => a.start - b.start); // oldest -> newest
const latest = path[path.length - 1];

function Direction({ down }) {
  return (
    <>
      {down ? <ArrowDownRight aria-hidden="true" /> : <ArrowUpRight aria-hidden="true" />}
      <span className="visually-hidden">{down ? "Down " : "Up "}</span>
    </>
  );
}

// Headline results: always a row of equal tiles, whatever the count.
function Results({ items }) {
  return (
    <dl className="xp-results" aria-label="Results">
      {items.map((m) => (
        <div key={m.value + m.label} className="xp-result">
          <dd className="xp-value">
            <Direction down={m.direction === "down"} />
            {m.value}
          </dd>
          <dt>{m.label}</dt>
        </div>
      ))}
    </dl>
  );
}

function goTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "start" });
  el.focus({ preventScroll: true });
}

export default function ExperiencePage() {
  usePageTitle(experience.title);
  return (
    <>
      <header className="xp-hero container">
        <h1>{experience.title}</h1>
        <p className="xp-intro">{fillYears(experience.intro)}</p>
      </header>

      <nav className="xp-path container" aria-label="Career path, oldest to newest">
        <ol>
          {path.map((r, i) => (
            <li key={r.id} className={r === latest ? "is-latest" : undefined}>
              <button type="button" className="xp-step" onClick={() => goTo(r.id)}>
                <span className="xp-step-company">{shortName(r.company)}</span>
                <span className="xp-step-years">{r.period.replace(/[A-Za-z]{3} /g, "")}</span>
              </button>
              {i < path.length - 1 && <ArrowRight className="xp-step-arrow" aria-hidden="true" />}
            </li>
          ))}
        </ol>
      </nav>

      <ol className="xp-list container">
        {roles.map((r) => (
          <li key={r.id} className="xp-role">
            <div className="xp-side">
              <p className="xp-company">{r.company}</p>
              <p className="xp-period">{r.period}</p>
              <p className="xp-duration">{duration(r.months)}</p>
            </div>
            <div className="xp-main">
              <h2 id={r.id} tabIndex={-1} className="xp-title">{r.role}</h2>
              {r.summary && <p className="xp-summary-line">{r.summary}</p>}
              {r.impact?.length > 0 && <Results items={r.impact} />}
              <h3 className="xp-points-title">What I did</h3>
              <ul className="xp-points">
                {r.highlights.map((h, i) => <li key={i}>{h}</li>)}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}

// Headline results: always a row of equal tiles, whatever the count.
function Results({ items }) {
  return (
    <dl className="xp-results" aria-label="Results">
      {items.map((m) => (
        <div key={m.value + m.label} className="xp-result">
          <dd className="xp-value">
            <Direction down={m.direction === "down"} />
            {m.value}
          </dd>
          <dt>{m.label}</dt>
        </div>
      ))}
    </dl>
  );
}

function goTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "start" });
  el.focus({ preventScroll: true });
}

export default function ExperiencePage() {
  usePageTitle(experience.title);
  return (
    <>
      <header className="xp-hero container">
        <h1>{experience.title}</h1>
        <p className="xp-intro">{fillYears(experience.intro)}</p>
      </header>

      <nav className="xp-path container" aria-label="Career path, oldest to newest">
        <ol>
          {path.map((r, i) => (
            <li key={r.id} className={r === latest ? "is-latest" : undefined}>
              <button type="button" className="xp-step" onClick={() => goTo(r.id)}>
                <span className="xp-step-company">{shortName(r.company)}</span>
                <span className="xp-step-role">{r.role}</span>
                <span className="xp-step-when">
                  {r.period} · {duration(r.months)}
                </span>
              </button>
              {i < path.length - 1 && <ArrowRight className="xp-step-arrow" aria-hidden="true" />}
            </li>
          ))}
        </ol>
      </nav>

      <ol className="xp-list container">
        {roles.map((r) => {
          const many = r.impact?.length > 1;
          return (
            <li key={r.id} className={`xp-role${many ? " xp-role--multi" : ""}`}>
              <span className="xp-dot" aria-hidden="true" />
              <div className="xp-main">
                <h2 id={r.id} tabIndex={-1} className="xp-title">{r.role}</h2>
                <p className="xp-meta">
                  <span className="xp-company">{r.company}</span>
                  <span className="xp-period">
                    {r.period} · {duration(r.months)}
                  </span>
                </p>
                {r.summary && <p className="xp-summary-line">{r.summary}</p>}
                {many && <Results items={r.impact} compact />}
                <h3 className="xp-points-title">What I did</h3>
                <ul className="xp-points">
                  {r.highlights.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
              </div>
              {r.impact?.length === 1 && <Results items={r.impact} />}
            </li>
          );
        })}
      </ol>
    </>
  );
}
