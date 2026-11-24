/* global __HAS_CV__ */
import { Link } from "react-router-dom";
import { site, projects, portraitSrcSet, PORTRAIT_SIZES } from "../lib/content";
import CvButton from "../components/ui/CvButton";
import ProofRail from "../components/ui/ProofRail";
import Testimonials from "../components/ui/Testimonials";
import Button from "../components/ui/Button";
import Icon from "../components/ui/Icon";
import SmartLink from "../components/ui/SmartLink";
import SignalField from "../components/ui/SignalField";
import usePageTitle from "../hooks/usePageTitle";
import useReveal from "../hooks/useReveal";
import "./HomePage.css";



export default function HomePage() {
  usePageTitle();
  useReveal();
  const featured = projects.items.filter((p) => p.featured).slice(0, 3);

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
            <p className="home-role">{site.role}</p>
            <p className="home-tagline">{site.tagline}</p>
            <ul className="home-facts" aria-label="Quick facts">
              {site.highlights.map((h) => (
                <li key={h.label}>
                  <Icon name={h.icon} size={15} />
                  {h.text}
                </li>
              ))}
            </ul>
            <div className="btn-row">
              <Button to="/projects" icon="arrow">View Projects</Button>
              {site.cv && __HAS_CV__ ? <CvButton /> : <Button to="/contact" variant="secondary" icon={null}>Get in Touch</Button>}
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
          <ol className="home-work">
            {featured.map((p) => (
              <li key={`${p.title}-${p.url}`} className="home-work-item reveal">
                <SmartLink to={p.url} className="home-work-link">
                  <h3>{p.title}</h3>
                  <p>{p.summary}</p>
                  <span className="home-work-tags">{[p.category, ...(p.tags || [])].filter(Boolean).join(" · ")}</span>
                  <span className="home-work-arrow" aria-hidden="true"><Icon name="arrow" size={22} /></span>
                </SmartLink>
              </li>
            ))}
          </ol>
          <Link to="/projects" className="text-link home-all-link">View all projects <Icon name="arrow" size={16} /></Link>
        </div>
      </section>

      <Testimonials title="What people say about working with me" />
    </>
  );
}
