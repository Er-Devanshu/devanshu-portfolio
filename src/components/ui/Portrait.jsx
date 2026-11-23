import { site } from "../../lib/content";

// Shows site.photo when set; otherwise an intentional monogram panel (never a broken image).
export default function Portrait({ className = "" }) {
  if (site.photo) {
    return (
      <div className={`portrait ${className}`}>
        <img src={site.photo} alt={site.photoAlt || site.name} width="720" height="900" fetchpriority="high" />
      </div>
    );
  }
  return (
    <div className={`portrait portrait-fallback ${className}`} role="img" aria-label={site.name}>
      <span>{site.initials}</span>
    </div>
  );
}
