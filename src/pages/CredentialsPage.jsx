import { credentials } from "../lib/content";
import usePageTitle from "../hooks/usePageTitle";
import "./CredentialsPage.css";

const firstYear = (period = "") => (String(period).match(/\d{4}/) || [""])[0];
const initials = (s = "") =>
  s.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "?";
// Column label: the exam code when there is one (DP-600), otherwise the name without the issuer.
const label = (c) =>
  (c.name.match(/\(([A-Z]{2,4}-\d{2,4})\)/) || [])[1] ||
  c.name.replace(/^AWS Certified\s+/i, "").replace(/^Microsoft Certified:?\s*/i, "");

function BadgeArt({ cert, size, eager = false }) {
  return cert.logo
    ? <img src={cert.logo} alt="" width={size} height={size} loading={eager ? "eager" : "lazy"} decoding="async" />
    : <span className="cr-mono" style={{ width: size, height: size }}>{initials(cert.issuer)}</span>;
}

export default function CredentialsPage() {
  usePageTitle(credentials.title);
  const certs = credentials.certifications || [];
  const education = [...(credentials.education || [])].sort((a, b) => firstYear(b.period).localeCompare(firstYear(a.period)));
  // Every area any certification covers, in the order they first appear.
  const areas = [...new Set(certs.flatMap((c) => c.areas || []))];

  return (
    <>
      <header className="cr-hero container">
        <div className="cr-hero-copy">
          <h1>{credentials.title}</h1>
          {credentials.intro && <p className="cr-intro">{credentials.intro}</p>}
        </div>
        {certs.length > 0 && (
          <ul className="cr-shelf" aria-label="Certification badges">
            {certs.map((c, i) => (
              <li key={c.name} style={{ "--i": i }}>
                <span className="cr-shelf-badge" title={c.name} role="img" aria-label={`${c.name}, ${c.issuer}`}>
                  <BadgeArt cert={c} size={160} eager />
                </span>
              </li>
            ))}
          </ul>
        )}
      </header>


      {education.length > 0 && (
        <section className="cr-section container" aria-labelledby="cr-edu">
          <h2 id="cr-edu" className="cr-heading">Education</h2>
          <ul className="cr-degrees">
            {education.map((e) => (
              <li key={e.institution + e.period} className="cr-degree">
                <span className="cr-degree-year">{firstYear(e.period) || e.period}</span>
                <h3 className="cr-degree-name">{e.degree}</h3>
                <p className="cr-degree-place">{e.institution}</p>
                {e.note && <p className="cr-degree-note">{e.note}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {certs.length > 0 && areas.length > 0 && (
        <section className="cr-section container" aria-labelledby="cr-map">
          <div className="cr-section-head">
            <h2 id="cr-map" className="cr-heading">What they cover</h2>
            <p className="cr-section-note">Each column is one certification.</p>
          </div>
          <div className="cr-matrix-wrap">
            <table className="cr-matrix">
              <caption className="visually-hidden">Areas covered by each certification</caption>
              <thead>
                <tr>
                  <td />
                  {certs.map((c) => (
                    <th key={c.name} scope="col">
                      <span className="cr-col">
                        <span className="cr-col-badge" aria-hidden="true"><BadgeArt cert={c} size={56} /></span>
                        <span className="cr-col-name">{label(c)}</span>
                        <span className="cr-col-issuer">{c.issuer}</span>
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {areas.map((area) => (
                  <tr key={area}>
                    <th scope="row">{area}</th>
                    {certs.map((c) => {
                      const yes = (c.areas || []).includes(area);
                      return (
                        <td key={c.name} className={yes ? "is-yes" : undefined}>
                          {yes ? <><span className="cr-dot" aria-hidden="true" /><span className="visually-hidden">Covered</span></> : <span className="visually-hidden">Not covered</span>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Phones: the same information as a list, one certification per row. */}
          <ul className="cr-cover-list">
            {certs.map((c) => (
              <li key={c.name} className="cr-cover-item">
                <span className="cr-col-badge" aria-hidden="true"><BadgeArt cert={c} size={56} /></span>
                <span className="cr-cover-text">
                  <span className="cr-col-name">{c.name}</span>
                  <span className="cr-col-issuer">{c.issuer}</span>
                  <span className="cr-chips">{(c.areas || []).map((a) => <span key={a} className="cr-chip">{a}</span>)}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

    </>
  );
}
