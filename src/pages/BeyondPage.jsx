import { beyond } from "../lib/content";
import usePageTitle from "../hooks/usePageTitle";
import useReveal from "../hooks/useReveal";
import Icon from "../components/ui/Icon";
import "./BeyondPage.css";

const svgProps = {
  viewBox: "0 0 64 64", fill: "none", stroke: "currentColor", strokeWidth: 1.5,
  strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", focusable: "false",
};

function LaurelMark() {
  return (
    <svg {...svgProps}>
      <circle cx="32" cy="27" r="9" />
      <path d="M32 21.5l1.6 3.3 3.6.5-2.6 2.5.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.6-2.5 3.6-.5z" />
      <path d="M18 14c-5 8-5 18 1 25s12 9 13 9M46 14c5 8 5 18-1 25s-12 9-13 9" />
      <path d="M15.5 20c-2.5-1-4-3-4-5.5 2.5.2 4.2 1.7 4.6 4M14.5 28c-2.8-.3-4.8-2-5.3-4.5 2.6-.3 4.6.9 5.5 3.2M16 36c-2.8.4-5.1-.8-6.2-3.1 2.5-.8 4.8 0 6.1 2.1M20.5 42.5c-2.5 1.3-5 .8-6.7-1.1 2.2-1.4 4.6-1.3 6.4.4" />
      <path d="M48.5 20c2.5-1 4-3 4-5.5-2.5.2-4.2 1.7-4.6 4M49.5 28c2.8-.3 4.8-2 5.3-4.5-2.6-.3-4.6.9-5.5 3.2M48 36c2.8.4 5.1-.8 6.2-3.1-2.5-.8-4.8 0-6.1 2.1M43.5 42.5c2.5 1.3 5 .8 6.7-1.1-2.2-1.4-4.6-1.3-6.4.4" />
      <path d="M26 54l6-6 6 6" />
    </svg>
  );
}

function LecternMark() {
  return (
    <svg {...svgProps}>
      <path d="M32 10L8 20l24 10 24-10z" />
      <path d="M18 24.5V33c0 3 6.3 5.5 14 5.5S46 36 46 33v-8.5" />
      <path d="M52 21.7V32m0 0l-2 5h4z" />
      <path d="M22 46h20M26 46l-2 8h16l-2-8M20 54h24" />
    </svg>
  );
}

function BookMark() {
  return (
    <svg {...svgProps}>
      <path d="M32 18c-6-4-14-5-22-4v34c8-1 16 0 22 4 6-4 14-5 22-4V14c-8-1-16 0-22 4z" />
      <path d="M32 18v34" />
      <path d="M16 23c4-.4 8 .2 11 1.6M16 30c4-.4 8 .2 11 1.6M37 24.6c3-1.4 7-2 11-1.6M37 31.6c3-1.4 7-2 11-1.6" />
      <path d="M40 38.5l3 3 6-6.5" />
    </svg>
  );
}

function emblemFor(a) {
  const t = `${a.title} ${a.issuer}`.toLowerCase();
  if (/faculty|lectur|teach|professor|universit|bits/.test(t)) return <LecternMark />;
  if (/review|book|publish|author|editor/.test(t)) return <BookMark />;
  return <LaurelMark />;
}

function ctaFor(url) {
  try {
    const host = new URL(url).hostname;
    if (/(^|\.)meetup\.com$/i.test(host)) return "Join on Meetup";
    if (/(^|\.)linkedin\.com$/i.test(host)) return "Follow on LinkedIn";
    if (/(^|\.)fabric\.microsoft\.com$/i.test(host)) return "Join on Fabric Community";
    return "Visit group";
  } catch {
    return "Visit group";
  }
}

function scopeLabel(scope) {
  if (!scope) return null;
  return /^india$/i.test(scope) ? "India-wide" : scope;
}

export default function BeyondPage() {
  usePageTitle(beyond.title);
  useReveal();
  const achievements = beyond.achievements ?? [];
  const communities = beyond.communities ?? [];
  return (
    <div className="container beyond-page">
      <header className="page-hero beyond-hero">
        <h1>{beyond.title}</h1>
        <p className="lead">{beyond.intro}</p>
      </header>

      {achievements.length > 0 && (
        <section aria-labelledby="honours-heading" className="beyond-section">
          <h2 id="honours-heading" className="beyond-heading">Roles &amp; recognition</h2>
          <ul className="honours">
            {achievements.map((a) => {
              const repeat = a.times > 1;
              return (
                <li key={a.title} className="honour reveal">
                  <div className={`honour-emblem${repeat ? " is-repeat" : ""}`}>
                    {a.logo ? <img src={a.logo} alt="" loading="lazy" /> : emblemFor(a)}
                    {repeat && (
                      <span className="honour-times" aria-label={`Selected ${a.times} times`}>
                        {a.times}<span aria-hidden="true">×</span>
                      </span>
                    )}
                  </div>
                  <h3 className="honour-title">{a.title}</h3>
                  <p className="honour-meta">
                    <span>{a.issuer}</span>
                    {a.years?.length ? (
                      <span className="honour-years">
                        {a.years.map((y) => <span key={y} className="honour-chip">{y}</span>)}
                      </span>
                    ) : (
                      a.period && <span className="honour-year">{a.period}</span>
                    )}
                  </p>
                  {a.text && <p className="honour-text">{a.text}</p>}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {communities.length > 0 && (
        <section aria-labelledby="community-heading" className="beyond-section">
          <h2 id="community-heading" className="beyond-heading">Communities</h2>
          <ul className="community-grid">
            {communities.map((c, i) => {
              const scope = scopeLabel(c.scope);
              const inner = (
                <>
                  <span className="community-cover-wrap" aria-hidden="true">
                    {c.cover
                      ? <img className="community-cover" src={c.cover} alt="" loading="lazy" decoding="async" width="800" height="450" style={c.coverPosition ? { objectPosition: c.coverPosition } : undefined} />
                      : <span className="community-cover-fallback"><Icon name={/speak|talk|contributor/i.test(c.role) ? "mic" : "users"} size={32} /></span>}
                    {scope && <span className="community-scope">{scope}</span>}
                  </span>
                  <span className="community-body">
                    <span className="community-name">{c.name}</span>
                    {c.role && <span className="community-role">{c.role}</span>}
                    {c.text && <span className="community-text">{c.text}</span>}
                    {c.url && (
                      <span className="community-cta" aria-hidden="true">
                        {ctaFor(c.url)} <Icon name="arrow" size={16} />
                      </span>
                    )}
                  </span>
                </>
              );
              return (
                <li key={c.name} className="community-card reveal" style={{ "--stagger": `${Math.min(i, 7) * 70}ms` }}>
                  {c.url ? (
                    <a className="community-tile" href={c.url} target="_blank" rel="noopener noreferrer"
                      aria-label={`${c.name}: ${ctaFor(c.url)} (opens in a new tab)`}>
                      {inner}
                    </a>
                  ) : (
                    <div className="community-tile">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
