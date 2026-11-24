import Header from "../components/navigation/Header";
import Footer from "../components/layout/Footer";

export default function SiteLayout({ children }) {
  return (
    <div className="app-shell" id="top">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Header />
      <main id="main-content" tabIndex={-1}>{children}</main>
      <Footer />
      <p id="route-announcer" className="visually-hidden" aria-live="polite" aria-atomic="true" />
    </div>
  );
}
