import { credentials } from "../lib/content";
import usePageTitle from "../hooks/usePageTitle";
import "./CredentialsPage.css";

const MONOGRAMS = { microsoft: "MS", salesforce: "SF", "google cloud": "GC", tableau: "TB" };

function monogram(issuer = "") {
  const known = MONOGRAMS[issuer.trim().toLowerCase()];
  if (known) return known;
  const words = issuer.trim().split(/\s+/).filter(Boolean);
  if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase();
  return issuer.slice(0, 2).toUpperCase() || "?";
}

function Logo({ src, issuer, className }) {
  return (
    <span className={className} aria-hidden="true">
      {src ? <img src={src} alt="" loading="lazy" decoding="async" /> : <span className="cr-mono">{monogram(issuer)}</span>}
    </span>
  );
}

function Badge({ cert }) {
  const body = (
    <>
      <Logo src={cert.logo} issuer={cert.issuer} className="cr-tile" />
      <span className="cr-text">
        <span className="cr-name">{cert.name}</span>
        <span className="cr-issuer">
          {cert.issuer}
          {cert.year && <span className="cr-year"> · {cert.year}</span>}
        </span>
      </span>
    </>
  );
  return (
    <li>
      {cert.url ? (
        <a className="cr-badge is-link" href={cert.url} target="_blank" rel="noopener noreferrer"
          aria-label={`${cert.name}, ${cert.issuer}${cert.year ? `, ${cert.year}` : ""} (view credential, opens in a new tab)`}>
          {body}
        </a>
      ) : (
        <div className="cr-badge">{body}</div>
      )}
    </li>
  );
}

export default function CredentialsPage() {
  usePageTitle(credentials.title);
  const education = credentials.education || [];
  const certs = [...(credentials.certifications || [])].sort(
    (a, b) => a.issuer.localeCompare(b.issuer) || String(b.year).localeCompare(String(a.year))
  );

  return (
    <>
      <header className="cr-hero container">
        <h1>{credentials.title}</h1>
        {credentials.intro && <p className="cr-intro">{credentials.intro}</p>}
      </header>

      {education.length > 0 && (
        <section className="cr-section container" aria-labelledby="cr-edu">
          <h2 id="cr-edu" className="cr-heading">Education</h2>
          <ol className="cr-edu">
            {education.map((e) => (
              <li key={e.institution + e.period} className="cr-degree">
                {e.logo && <Logo src={e.logo} issuer={e.institution} className="cr-tile cr-tile-sm" />}
                <div>
                  <h3 className="cr-institution">{e.institution}</h3>
                  <p className="cr-degree-name">{e.degree}</p>
                </div>
                <p className="cr-period">{e.period}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {certs.length > 0 && (
        <section className="cr-section container" aria-labelledby="cr-certs">
          <h2 id="cr-certs" className="cr-heading">Certifications</h2>
          <ul className="cr-grid">
            {certs.map((c) => <Badge key={c.issuer + c.name} cert={c} />)}
          </ul>
        </section>
      )}
    </>
  );
}
