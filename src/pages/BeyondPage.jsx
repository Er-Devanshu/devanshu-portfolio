import { beyond } from "../lib/content";
import usePageTitle from "../hooks/usePageTitle";
import useReveal from "../hooks/useReveal";
import "./BeyondPage.css";

const STOP = new Set(["of", "the", "and", "&", "+", "for", "user", "group"]);
function monogram(name = "") {
  const words = name.split(/\s+/).filter((w) => w && !STOP.has(w.toLowerCase()));
  return (words.slice(0, 2).map((w) => w[0]).join("") || name.slice(0, 2)).toUpperCase();
}

function Emblem({ logo, name, className }) {
  return (
    <div className={className} aria-hidden="true">
      {logo ? <img src={logo} alt="" loading="lazy" /> : <span>{monogram(name)}</span>}
    </div>
  );
}

export default function BeyondPage() {
  usePageTitle(beyond.title);
  useReveal();
  const achievements = beyond.achievements ?? [];
  const communities = beyond.communities ?? [];
  return (
    <>
      <div className="container beyond-page">
        <header className="page-hero beyond-hero">
          <div className="beyond-hero-text">
            <h1>{beyond.title}</h1>
            <p className="lead">{beyond.intro}</p>
          </div>
        </header>

        {achievements.length > 0 && (
          <section aria-labelledby="honours-heading" className="beyond-section">
            <h2 id="honours-heading" className="beyond-heading">Recognition</h2>
            <ol className="honours" data-count={achievements.length}>
              {achievements.map((a) => (
                <li key={a.title} className="honour reveal">
                  <Emblem logo={a.logo} name={a.issuer} className="honour-emblem" />
                  <div className="honour-body">
                    <h3 className="honour-title">{a.title}</h3>
                    <p className="honour-meta">
                      <span>{a.issuer}</span>
                      <span className="honour-year">{a.period}</span>
                    </p>
                    {a.text && <p className="honour-text">{a.text}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {communities.length > 0 && (
          <section aria-labelledby="community-heading" className="beyond-section">
            <h2 id="community-heading" className="beyond-heading">Communities I lead</h2>
            <ul className="community-list">
              {communities.map((c) => (
                <li key={c.name} className="community reveal">
                  <Emblem logo={c.logo} name={c.name} className="community-logo" />
                  <div className="community-main">
                    <h3>
                      {c.url ? (
                        <a href={c.url} target="_blank" rel="noopener noreferrer">
                          {c.name}<span className="visually-hidden"> (opens in new tab)</span>
                        </a>
                      ) : c.name}
                    </h3>
                    <p className="community-role">{c.role} <span aria-hidden="true">·</span> {c.period}</p>
                  </div>
                  <p className="community-text">{c.text}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

    </>
  );
}
