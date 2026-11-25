/* global __HAS_CV__ */
import { Link } from "react-router-dom";
import { site, projects, portraitSrcSet, PORTRAIT_SIZES, siteRole, currentCompany } from "../lib/content";
import CvButton from "../components/ui/CvButton";
import CaseStudies from "../components/ui/CaseStudies";
import ProofRail from "../components/ui/ProofRail";
import Testimonials from "../components/ui/Testimonials";
import Button from "../components/ui/Button";
import Icon from "../components/ui/Icon";
import SignalField from "../components/ui/SignalField";
import usePageTitle from "../hooks/usePageTitle";
import useReveal from "../hooks/useReveal";
import "./HomePage.css";



export default function HomePage() {
  usePageTitle();
  useReveal();

  return (
    <>
      <section className="home-hero" aria-labelledby="home-title">
        <SignalField />
        <div className="container home-hero-grid">
          <div className="home-hero-copy">
            <h1 id="home-title" className="home-name">
              <span className="home-first">{site.firstName}</span>{" "}
              <span className="home-last">{site.lastName}</span>
            </h1>
            <p className="home-role">{siteRole}{currentCompany && <span className="home-company"> at {currentCompany}</span>}</p>
            <p className="home-tagline">{site.tagline}</p>
            <div className="btn-row">
              <Button to="/contact" icon="arrow">Work with me</Button>
              <Button to="/projects" variant="secondary" icon={null}>View my work</Button>
              {site.cv && __HAS_CV__ && <CvButton />}
            </div>
          </div>
          <div className="home-hero-media portrait-card">
            <img src={site.photo} srcSet={portraitSrcSet(site.photo, site.photoSmall)} sizes={PORTRAIT_SIZES} alt={site.photoAlt || site.name} width="1199" height="1312" fetchPriority="high" />
          </div>
        </div>
      </section>
      <ProofRail />

      <section className="surface-ivory home-featured" aria-labelledby="featured-title">
        <div className="container">
          <div className="home-featured-head reveal">
            <h2 id="featured-title">{projects.featuredTitle}</h2>
            <p>{projects.featuredIntro}</p>
          </div>
          <CaseStudies items={projects.caseStudies} limit={4} />
          <Link to="/projects" className="text-link home-all-link">See all work <Icon name="arrow" size={16} /></Link>
        </div>
      </section>

      <Testimonials title="What people say about working with me" />
    </>
  );
}
