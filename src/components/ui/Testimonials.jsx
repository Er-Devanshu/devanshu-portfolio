import { useEffect, useId, useRef, useState } from "react";
import { beyond } from "../../lib/content";
import "./Testimonials.css";

// Each quote stays up this long. The progress line under the active name runs for the
// same time; when it finishes, the next quote shows. Pausing the line pauses the timer.
const ROTATE_MS = 15000;
const prefersStill = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const initials = (name) => name.split(" ").map((w) => w[0]).join("").slice(0, 2);

// Splits the quote around its "highlight" phrase so the key line reads first.
function Quote({ text, highlight }) {
  const at = highlight ? text.indexOf(highlight) : -1;
  if (at < 0) return text;
  return (
    <>
      {text.slice(0, at)}
      <mark>{highlight}</mark>
      {text.slice(at + highlight.length)}
    </>
  );
}

export default function Testimonials({ title = "What people say", tone = "dark" }) {
  const list = beyond.testimonials || [];
  const [active, setActive] = useState(0);
  // stopped: the visitor chose a quote (or prefers reduced motion).
  const [stopped, setStopped] = useState(prefersStill);
  // held: temporarily paused while keyboard focus is inside, or while off screen.
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);
  const tabsRef = useRef(null);
  const id = useId();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !("IntersectionObserver" in window)) return undefined;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!list.length) return null;
  const t = list[active];
  const rotating = !stopped && list.length > 1;
  const held = focused || !visible;

  // Keep the active name in view on phones (horizontal list) without scrolling the page.
  const reveal = (i) => {
    const bar = tabsRef.current;
    const tab = document.getElementById(`${id}-tab-${i}`);
    if (bar && tab && bar.scrollWidth > bar.clientWidth) bar.scrollTo({ left: tab.offsetLeft - bar.offsetLeft, behavior: prefersStill() ? "auto" : "smooth" });
  };
  const advance = () => {
    const to = (active + 1) % list.length;
    setActive(to);
    reveal(to);
  };
  const choose = (i) => {
    setActive(i);
    setStopped(true);
  };

  const onKey = (e) => {
    const n = list.length;
    const next = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (next == null && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    const to = e.key === "Home" ? 0 : e.key === "End" ? n - 1 : (active + next + n) % n;
    choose(to);
    document.getElementById(`${id}-tab-${to}`)?.focus();
  };

  return (
    <section
      ref={sectionRef}
      className={`voices voices-${tone}`}
      aria-labelledby={`${id}-title`}
      onFocus={() => setFocused(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false); }}
    >
      <div className="container voices-inner">
        <h2 id={`${id}-title`} className="voices-title">{title}</h2>

        <div
          className="voices-quote"
          role="tabpanel"
          id={`${id}-panel`}
          aria-labelledby={`${id}-tab-${active}`}
        >
          <svg className="voices-mark" viewBox="0 0 64 48" aria-hidden="true">
            <path d="M0 48V28C0 12 8 2 26 0v9c-9 2-13 8-13 17h13v22H0Zm38 0V28C38 12 46 2 64 0v9c-9 2-13 8-13 17h13v22H38Z" fill="currentColor" />
          </svg>
          <blockquote key={active}>
            <p><Quote text={t.quote} highlight={t.highlight} /></p>
          </blockquote>
          {t.source && <p className="voices-source">{t.source}</p>}
        </div>

        <div className="voices-people" ref={tabsRef} role="tablist" aria-label="Choose a testimonial" onKeyDown={onKey}>
          {list.map((p, i) => (
            <button
              key={p.name}
              id={`${id}-tab-${i}`}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-controls={`${id}-panel`}
              aria-label={`${p.name}, ${p.role}`}
              tabIndex={i === active ? 0 : -1}
              className="voices-person"
              onClick={() => choose(i)}
            >
              <span className="voices-avatar" aria-hidden="true">{initials(p.name)}</span>
              <span className="voices-who">
                <strong>{p.name}</strong>
                <span>{p.role}</span>
              </span>
              {rotating && i === active && (
                <span
                  key={active}
                  className="voices-progress"
                  aria-hidden="true"
                  style={{ animationDuration: `${ROTATE_MS}ms`, animationPlayState: held ? "paused" : "running" }}
                  onAnimationEnd={advance}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
