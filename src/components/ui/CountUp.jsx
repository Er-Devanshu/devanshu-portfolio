import { useEffect, useRef, useState } from "react";

const still = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// Counts a number like "50+", "1000+" or "35%+" up from zero the first time it scrolls into view.
// The real final value is always the page text (for screen readers, copying, search and ATS tools);
// the counting figure is drawn on top of it with CSS and disappears when the count finishes.
export default function CountUp({ value, duration = 1400 }) {
  const text = String(value);
  const m = text.match(/^(\D*)(\d+)(.*)$/);
  const target = m ? Number(m[2]) : null;
  const ref = useRef(null);
  const [shown, setShown] = useState(null); // null = not animating, show the real text

  useEffect(() => {
    const el = ref.current;
    if (target == null || still() || !el) return undefined;
    let raf;
    let safety;
    const run = () => {
      // Only animate a page someone is looking at; never leave a half-counted number on screen.
      if (document.visibilityState !== "visible") return;
      safety = setTimeout(() => { cancelAnimationFrame(raf); setShown(null); }, duration + 300);
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / duration);
        if (p >= 1) { setShown(null); return; }
        setShown(Math.round((1 - Math.pow(2, -10 * p)) * target));
        raf = requestAnimationFrame(tick);
      };
      setShown(0);
      raf = requestAnimationFrame(tick);
    };
    if (!("IntersectionObserver" in window)) return undefined;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); run(); } }, { threshold: 0.5 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); clearTimeout(safety); };
  }, [target, duration]);

  if (target == null) return text;
  const counting = shown != null;
  return (
    <span ref={ref} className={`count-up${counting ? " is-counting" : ""}`}
      data-shown={counting ? `${m[1]}${shown.toLocaleString("en-IN")}` : undefined} data-suffix={m[3]}>
      <span className="count-up-real">{m[1]}{m[2]}{m[3] && <span className="count-up-suffix">{m[3]}</span>}</span>
    </span>
  );
}
