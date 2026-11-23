import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import SiteLayout from "./layouts/SiteLayout";
import HomePage from "./pages/HomePage";

// After a new deploy, an open tab may request page files that no longer exist.
// Reload once to pick up the new build instead of showing a blank page.
const RELOAD_KEY = "dt-chunk-reload";
const lazyPage = (load) =>
  lazy(() =>
    load()
      .then((mod) => {
        try { sessionStorage.removeItem(RELOAD_KEY); } catch { /* storage blocked */ }
        return mod;
      })
      .catch((err) => {
        let tried = true;
        try { tried = Boolean(sessionStorage.getItem(RELOAD_KEY)); sessionStorage.setItem(RELOAD_KEY, "1"); } catch { /* storage blocked */ }
        if (!tried) {
          window.location.reload();
          return new Promise(() => {});
        }
        throw err;
      })
  );

const AboutPage = lazyPage(() => import("./pages/AboutPage"));
const ExperiencePage = lazyPage(() => import("./pages/ExperiencePage"));
const ProjectsPage = lazyPage(() => import("./pages/ProjectsPage"));
const BeyondPage = lazyPage(() => import("./pages/BeyondPage"));
const CredentialsPage = lazyPage(() => import("./pages/CredentialsPage"));
const ContactPage = lazyPage(() => import("./pages/ContactPage"));
const NotFoundPage = lazyPage(() => import("./pages/NotFoundPage"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <SiteLayout>
        <Suspense fallback={<div style={{ minHeight: "70vh" }} />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/experience" element={<ExperiencePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/beyond" element={<BeyondPage />} />
            <Route path="/credentials" element={<CredentialsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </SiteLayout>
    </BrowserRouter>
  );
}
