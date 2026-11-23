import { useEffect, useRef, useState } from "react";
import { site, statValue } from "../../lib/content";
import SmartLink from "./SmartLink";
import Icon from "./Icon";
import "./ProofRail.css";

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// Splits "80+" into { n: 80, suffix: "+" } so the number can count up.
function parse(value) {
  const m = String(value).match(/^(\d+)(.*)$/);
  return m ? { n: Number(m[1]), suffix: m[2] } : { n: null, suffix: String(value) };
}

function Stat({ stat, start }) {
  const final = statValue(stat.value);
  const { n, suffix } = parse(final);
  const [shown, setShown] = useState(() => (n == null || prefersReducedMotion() ? n : 0));

  useEffect(() => {
    if (!start || n == null || prefersReducedMotion()) return;
    let raf;
    const t0 = performance.now();
    const dur = 1400;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p); // exponential ease-out
      setShown(Math.round(eased * n));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, n]);

  const body = (
    <>
      <span className="proof-value" aria-hidden="true">
        {n == null ? final : shown}
        {n != null && suffix && <span className="proof-suffix">{suffix}</span>}
      </span>
      <span className="proof-label">
        <span className="visually-hidden">{final} </span>
        {stat.label}
      </span>
      {stat.url && <Icon name="external" size={16} className="proof-arrow" />}
    </>
  );

  return (
    <li className="proof-item">
      {stat.url ? <SmartLink to={stat.url} className="proof-cell">{body}</SmartLink> : <div className="proof-cell">{body}</div>}
    </li>
  );
}

export default function ProofRail() {
  const ref = useRef(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) { setStart(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStart(true); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!site.stats?.length) return null;
  return (
    <section className="proof" aria-label="At a glance">
      <ul className="container proof-list" ref={ref}>
        {site.stats.map((s) => <Stat key={s.label} stat={s} start={start} />)}
      </ul>
    </section>
  );
}
