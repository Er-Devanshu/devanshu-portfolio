
import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import SiteLayout from "./layouts/SiteLayout";

// Temporary page component.
// Each page will receive its own complete design in later stages.

function PlaceholderPage({ title, description, section }) {
  return (
    <section className="placeholder-page">
      <div className="container">
        <span className="eyebrow">
          DEVANSHU TAYAL / {section}
        </span>

        <h1>
          {title}
          <span>.</span>
        </h1>

        <p>{description}</p>
      </div>
    </section>
  );
}

// Homepage placeholder

function HomePage() {
  return (
    <section className="placeholder-page">
      <div className="container">
        <span className="eyebrow">
          DATA / ENGINEERING / ARTIFICIAL INTELLIGENCE
        </span>

        <h1>
          Devanshu Tayal
          <span>.</span>
        </h1>

        <p>
          Building a thoughtful digital representation of
          my professional journey across data, engineering
          and artificial intelligence.
        </p>
      </div>
    </section>
  );
}

// Scroll to top whenever the visitor changes pages.

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Page not found

function NotFoundPage() {
  return (
    <PlaceholderPage
      title="Page not found"
      description="The page you are looking for does not exist or may have been moved."
      section="404"
    />
  );
}

// Application routes

function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <SiteLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route
            path="/about"
            element={
              <PlaceholderPage
                title="About"
                description="The story, background and professional philosophy behind my work."
                section="ABOUT"
              />
            }
          />

          <Route
            path="/experience"
            element={
              <PlaceholderPage
                title="Experience"
                description="My professional journey, career progression and achievements."
                section="EXPERIENCE"
              />
            }
          />

          <Route
            path="/expertise"
            element={
              <PlaceholderPage
                title="Expertise"
                description="My technical capabilities across data, analytics, engineering and artificial intelligence."
                section="EXPERTISE"
              />
            }
          />

          <Route
            path="/projects"
            element={
              <PlaceholderPage
                title="Selected Work"
                description="A collection of professional projects, technical solutions and real-world implementations."
                section="PROJECTS"
              />
            }
          />

          <Route
            path="/community"
            element={
              <PlaceholderPage
                title="Community & Leadership"
                description="My contributions to technology communities, user groups and the wider data ecosystem."
                section="COMMUNITY"
              />
            }
          />

          <Route
            path="/speaking"
            element={
              <PlaceholderPage
                title="Speaking & Teaching"
                description="Technical sessions, workshops, conferences and academic contributions."
                section="SPEAKING"
              />
            }
          />

          <Route
            path="/education"
            element={
              <PlaceholderPage
                title="Education & Certifications"
                description="My academic background, professional qualifications and certifications."
                section="EDUCATION"
              />
            }
          />

          <Route
            path="/publications"
            element={
              <PlaceholderPage
                title="Publications"
                description="Articles, technical writing and knowledge-sharing contributions."
                section="PUBLICATIONS"
              />
            }
          />

          <Route
            path="/contact"
            element={
              <PlaceholderPage
                title="Let's Connect"
                description="Interested in technology, collaboration or building something meaningful? Let's connect."
                section="CONTACT"
              />
            }
          />

          <Route
            path="*"
            element={<NotFoundPage />}
          />
        </Routes>
      </SiteLayout>
    </BrowserRouter>
  );
}

export default function App() {
  return <AppRoutes />;
}
