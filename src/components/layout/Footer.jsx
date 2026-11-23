import { Link } from "react-router-dom";
import { site } from "../../lib/content";
import Icon from "../ui/Icon";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <Link to="/" className="footer-brand" aria-label={`${site.name} — home`}><img src={site.logo} alt="" width="43" height="22" /></Link>
        <p>© {new Date().getFullYear()} {site.name}</p>
        <ul className="footer-social" aria-label="Social links">
          {site.socials.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" aria-label={`${s.label} (opens in a new tab)`}>
                <Icon name={s.icon} size={18} />
              </a>
            </li>
          ))}
          <li>
            <a href={`mailto:${site.email}`} aria-label="Email"><Icon name="mail" size={18} /></a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
