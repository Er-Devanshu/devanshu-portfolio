import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Icon from "../components/ui/Icon";
import usePageTitle from "../hooks/usePageTitle";

const QUICK = [
  { to: "/experience", label: "Experience" },
  { to: "/projects", label: "Projects" },
  { to: "/credentials", label: "Credentials" },
  { to: "/contact", label: "Contact" },
];

export default function NotFoundPage() {
  usePageTitle("Page not found", { noindex: true });
  return (
    <section className="page-hero container" style={{ minHeight: "60vh" }}>
      <h1>Page not found</h1>
      <p className="lead" style={{ marginBottom: 32 }}>The page you're looking for doesn't exist or has moved. Try one of these instead.</p>
      <Button to="/" icon="arrow">Back to home</Button>
      <ul style={{ listStyle: "none", padding: 0, margin: "32px 0 0", display: "flex", flexWrap: "wrap", gap: "8px 28px" }}>
        {QUICK.map((q) => (
          <li key={q.to}>
            <Link to={q.to} className="text-link" style={{ display: "inline-flex", alignItems: "center", gap: 6, minHeight: 44 }}>
              {q.label} <Icon name="arrow" size={16} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
