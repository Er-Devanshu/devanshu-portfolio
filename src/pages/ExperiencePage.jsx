import { ArrowDownRight, ArrowUpRight } from "lucide-react";
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

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const roles = experience.roles.map((r, i) => {
  const p = parsePeriod(r.period);
  return { ...r, ...p, id: `role-${i}-${slug(r.company)}`, months: p.end - p.start };
});
const latest = roles.reduce((a, b) => (b.start > a.start ? b : a));

function Direction({ down }) {
  return (
    <>
      {down ? <ArrowDownRight aria-hidden="true" /> : <ArrowUpRight aria-hidden="true" />}
      <span className="visually-hidden">{down ? "Down " : "Up "}</span>
    </>
  );
}

// Outcomes: a quiet ledger line under the story, each number shown once.
function Results({ items }) {
  return (
    <dl className="xp-outcomes" aria-label="Outcomes">
      {items.map((m) => (
        <div key={m.value + m.label} className="xp-outcome">
          <dd className="xp-outcome-value"><Direction down={m.direction === "down"} />{m.value}</dd>
          <dt className="xp-outcome-label">{m.label}</dt>
        </div>
      ))}
    </dl>
  );
}

// "Jan 2022 – Jan 2026" -> ["2022", "26"]; same year -> ["2021"]
function yearSpan(r) {
  const a = Math.floor(r.start / 12);
  const b = Math.floor((r.end - 1) / 12);
  return a === b ? [String(a)] : [String(a), String(b).slice(2)];
}

export default function ExperiencePage() {
  usePageTitle(experience.title);
  return (
    <>
      <header className="xp-hero container">
        <h1>{experience.title}</h1>
        <p className="xp-intro">{fillYears(experience.intro)}</p>
      </header>

      <ol className="xp-list container">
        {roles.map((r) => {
          const [from, to] = yearSpan(r);
          return (
            <li key={r.id} className={`xp-entry${r === latest ? " is-latest" : ""}`}>
              <p className="xp-years" aria-hidden="true">
                {from}{to && <><span className="xp-years-dash">–</span>{to}</>}
              </p>
              <div className="xp-body">
                <h2 id={r.id} tabIndex={-1} className="xp-title">{r.role}</h2>
                <p className="xp-meta">
                  <span className="xp-company">{r.company}</span>
                  <span className="xp-sep" aria-hidden="true">/</span>
                  <span>{r.period}</span>
                  <span className="xp-sep" aria-hidden="true">/</span>
                  <span>{duration(r.months)}</span>
                </p>
                {r.summary && <p className="xp-lede">{r.summary}</p>}
                {r.impact?.length > 0 && <Results items={r.impact} />}
                <ul className="xp-points">
                  {r.highlights.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
}
