
import Header from "../components/navigation/Header";
import Footer from "../components/layout/Footer";
import { useTheme } from "../hooks/useTheme";

export default function SiteLayout({ children }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app-shell">
      <Header theme={theme} toggleTheme={toggleTheme} />

      <main id="main-content">{children}</main>

      <Footer />
    </div>
  );
}
