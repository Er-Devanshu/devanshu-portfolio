import Button from "../components/ui/Button";
import usePageTitle from "../hooks/usePageTitle";

export default function NotFoundPage() {
  usePageTitle("Page not found", { noindex: true });
  return (
    <section className="page-hero container" style={{ minHeight: "60vh" }}>
      <h1>Page not found</h1>
      <p className="lead" style={{ marginBottom: 32 }}>The page you're looking for doesn't exist or has moved.</p>
      <Button to="/" icon="arrow">Back to home</Button>
    </section>
  );
}
