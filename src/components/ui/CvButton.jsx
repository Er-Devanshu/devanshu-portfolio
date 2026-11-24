import { site } from "../../lib/content";
import Icon from "./Icon";

// Download link for the CV. Renders nothing until the PDF named in site.cv exists in public/
// (checked at build time in vite.config.js).
/* global __HAS_CV__ */
export default function CvButton({ variant = "secondary" }) {
  if (!site.cv || !__HAS_CV__) return null;
  const file = site.cv.split("/").pop();
  return (
    <a href={site.cv} download={file} className={`btn btn-${variant}`}>
      <Icon name="download" size={18} />
      <span>Download CV</span>
      <span className="visually-hidden"> (PDF)</span>
    </a>
  );
}
