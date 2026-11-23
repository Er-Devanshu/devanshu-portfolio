import { useEffect, useRef } from "react";
import { about, site } from "../lib/content";
import SkillsSunburst from "../components/ui/SkillsSunburst";
import usePageTitle from "../hooks/usePageTitle";
import "./AboutPage.css";


function useTimelineFill(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--fill", "1");
      return;
    }
    let frame = 0;
    let active = false;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const anchor = window.innerHeight * 0.6;
      const p = Math.min(1, Math.max(0, (anchor - r.top) / r.height));
      el.style.setProperty("--fill", p.toFixed(4));
      el.querySelectorAll(".journey-item").forEach((li) => {
        li.classList.toggle("is-lit", li.getBoundingClientRect().top + 14 < anchor);
      });
    };
    const onScroll = () => { if (active && !frame) frame = requestAnimationFrame(update); };
    const io = new IntersectionObserver(([e]) => { active = e.isIntersecting; if (active) onScroll(); });
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref]);
}

export default function AboutPage() {
  usePageTitle("About");
  const listRef = useRef(null);
  useTimelineFill(listRef);

  return (
    <>
      <section className="ab-hero container" aria-labelledby="about-title">
        <div className="ab-hero-text">
          <h1 id="about-title">{about.title}</h1>
          <p className="ab-intro">{about.intro}</p>
        </div>
        {site.aboutPhoto && (
          <figure className="ab-figure portrait-card">
            <img src={site.aboutPhoto} alt={site.aboutPhotoAlt || site.name} width="800" height="1000" fetchpriority="high" />
          </figure>
        )}
      </section>

      <section className="ab-story container" aria-labelledby="story-title">
        <h2 id="story-title" className="ab-side-title">Background</h2>
        <div className="ab-column">
          {about.bio.map((p, i) => (
            <p key={p.slice(0, 24)} className={i === 0 ? "ab-first" : undefined}>{p}</p>
          ))}
        </div>
      </section>

      {about.skills?.groups?.length > 0 && (
        <section className="ab-skills container" aria-labelledby="skills-title">
          <h2 id="skills-title" className="ab-side-title">Skills</h2>
          <SkillsSunburst skills={about.skills} />
        </section>
      )}

      <section className="surface-ivory ab-journey" aria-labelledby="journey-title">
        <div className="container ab-journey-inner">
          <h2 id="journey-title">Career</h2>
          <ol className="journey" ref={listRef}>
            {about.journey.map((j) => (
              <li key={`${j.period}-${j.title}`} className="journey-item">
                <span className="journey-period">{j.period}</span>
                <span className="journey-title">{j.title}</span>
                {j.org && <span className="journey-org">{j.org}</span>}
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
