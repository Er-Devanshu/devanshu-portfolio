import { useEffect, useId, useMemo, useRef, useState } from "react";
import "./SkillsSunburst.css";

const SIZE = 520;
const C = SIZE / 2;
const R = { core: 66, g0: 72, g1: 146, i0: 150, i1: 252 };
// Muted charcoal -> warm grey, one tone per group. Never rainbow.
const TONES = ["#262a2b", "#2e3132", "#363736", "#3f3d3a", "#47433f", "#504a45"];
const SHORT = {
  "Machine learning": "ML",
  "Data engineering & cloud": "Data & cloud",
  "Analytics & visualisation": "Analytics",
};
const shortName = (g) => SHORT[g] || g;

const polar = (r, a) => [C + r * Math.sin(a), C - r * Math.cos(a)];
function arcPath(r0, r1, a0, a1) {
  const large = a1 - a0 > Math.PI ? 1 : 0;
  const [x0, y0] = polar(r1, a0); const [x1, y1] = polar(r1, a1);
  const [x2, y2] = polar(r0, a1); const [x3, y3] = polar(r0, a0);
  return `M${x0} ${y0}A${r1} ${r1} 0 ${large} 1 ${x1} ${y1}L${x2} ${y2}A${r0} ${r0} 0 ${large} 0 ${x3} ${y3}Z`;
}
// Centre-line arc for curved group labels, reversed on the lower half so text reads upright.
function labelPath(r, a0, a1) {
  const mid = (a0 + a1) / 2;
  const flip = mid > Math.PI / 2 && mid < (3 * Math.PI) / 2;
  const [s, e] = flip ? [a1, a0] : [a0, a1];
  const [x0, y0] = polar(r, s); const [x1, y1] = polar(r, e);
  return `M${x0} ${y0}A${r} ${r} 0 0 ${flip ? 0 : 1} ${x1} ${y1}`;
}

function useMedia(q) {
  const get = () => typeof window !== "undefined" && window.matchMedia(q).matches;
  const [m, setM] = useState(get);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const on = () => setM(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [q]);
  return m;
}

function PhoneList({ groups }) {
  const [open, setOpen] = useState(null);
  const uid = useId();
  return (
    <div className="sk-phone">
      {groups.map((g) => (
        <section key={g.group} className="sk-pgroup">
          <h3>{g.group}</h3>
          <ul>
            {g.items.map((it) => {
              const isOpen = open === it.key;
              return (
                <li key={it.key} data-open={isOpen || undefined}>
                  <button type="button" aria-expanded={isOpen} aria-controls={`${uid}-${it.idx}`}
                    onClick={() => setOpen(isOpen ? null : it.key)}>
                    {it.s.name}
                  </button>
                </li>
              );
            })}
          </ul>
          {g.items.filter((it) => it.key === open).map((it) => (
            <div key={it.key} id={`${uid}-${it.idx}`} className="sk-pdetail" role="region" aria-label={`What ${it.s.name} is used for`}>
              <p>{it.s.use}</p>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}

export default function SkillsSunburst({ skills }) {
  const phone = useMedia("(max-width: 719px)");
  const reduced = useMedia("(prefers-reduced-motion: reduce)");
  const [hover, setHover] = useState(null); // { kind: "item"|"group", i }
  const [pinned, setPinned] = useState(null);
  const [focusIdx, setFocusIdx] = useState(0);
  const [shown, setShown] = useState(false);
  const svgRef = useRef(null);
  const sliceRefs = useRef([]);
  const panelId = useId();

  const { groups, items } = useMemo(() => {
    const total = skills.groups.reduce((n, g) => n + g.items.length, 0);
    const step = (2 * Math.PI) / total;
    const starts = skills.groups.map((_, gi) => skills.groups.slice(0, gi).reduce((n, g) => n + g.items.length, 0));
    const gs = skills.groups.map((g, gi) => {
      const its = g.items.map((s, k) => {
        const idx = starts[gi] + k;
        return { s, gi, idx, a0: idx * step, a1: (idx + 1) * step, key: `${g.group}:${s.name}` };
      });
      return { ...g, gi, a0: starts[gi] * step, a1: (starts[gi] + g.items.length) * step, items: its, tone: TONES[gi % TONES.length] };
    });
    return { groups: gs, items: gs.flatMap((g) => g.items) };
  }, [skills]);

  useEffect(() => {
    if (phone || shown || reduced || !("IntersectionObserver" in window)) return undefined;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.3 });
    if (svgRef.current) io.observe(svgRef.current);
    return () => io.disconnect();
  }, [phone, reduced, shown]);

  const visible = shown || reduced || (typeof window !== "undefined" && !("IntersectionObserver" in window));

  if (phone) return (
    <div className="sk">
      <PhoneList groups={groups} />
    </div>
  );

  const active = hover || pinned;
  const activeItem = active?.kind === "item" ? items[active.i] : null;
  const activeGroup = active ? groups[active.kind === "item" ? items[active.i].gi : active.i] : null;

  const move = (i) => {
    const n = (i + items.length) % items.length;
    setFocusIdx(n); sliceRefs.current[n]?.focus();
  };
  const onKey = (e, i) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); move(i + 1); }
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); move(i - 1); }
    else if (e.key === "Home") { e.preventDefault(); move(0); }
    else if (e.key === "End") { e.preventDefault(); move(items.length - 1); }
    else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setPinned((p) => (p?.kind === "item" && p.i === i ? null : { kind: "item", i }));
    } else if (e.key === "Escape") { setPinned(null); setHover(null); }
  };

  return (
    <div className="sk">
      <div className="sk-stage">
        <svg ref={svgRef} className="sk-chart" data-shown={visible || undefined} viewBox={`0 0 ${SIZE} ${SIZE}`}
          role="group" aria-label="Skills by group. Use arrow keys to move between skills, Enter to pin, Escape to clear."
          onPointerLeave={() => setHover(null)}>
          <defs>
            {groups.map((g) => <path key={g.gi} id={`${panelId}-g${g.gi}`} d={labelPath((R.g0 + R.g1) / 2, g.a0, g.a1)} />)}
          </defs>
          {groups.map((g) => {
            const on = activeGroup?.gi === g.gi;
            return (
              <g key={g.group} className="sk-garc" data-on={on || undefined} style={{ "--d": `${g.gi * 60}ms` }}
                onPointerEnter={() => setHover({ kind: "group", i: g.gi })}>
                <path d={arcPath(R.g0, R.g1, g.a0, g.a1)} fill={g.tone} />
                <text className="sk-glabel" dy="0.35em">
                  <textPath href={`#${panelId}-g${g.gi}`} startOffset="50%" textAnchor="middle">{shortName(g.group)}</textPath>
                </text>
              </g>
            );
          })}
          {items.map((it) => {
            const g = groups[it.gi];
            const on = activeItem?.idx === it.idx;
            const isPinned = pinned?.kind === "item" && pinned.i === it.idx;
            const mid = (it.a0 + it.a1) / 2;
            const deg = (mid * 180) / Math.PI;
            const flip = deg > 180;
            const [lx, ly] = polar((R.i0 + R.i1) / 2, mid);
            const fits = it.s.name.length <= 16;
            return (
              <g key={it.key} ref={(el) => { sliceRefs.current[it.idx] = el; }} className="sk-slice"
                data-on={on || undefined} data-pinned={isPinned || undefined}
                role="button" tabIndex={focusIdx === it.idx ? 0 : -1} aria-pressed={isPinned}
                aria-label={`${it.s.name}, ${g.group}: ${it.s.use}`} aria-describedby={panelId}
                style={{ "--d": `${120 + (it.idx / items.length) * 480}ms` }}
                onPointerEnter={() => setHover({ kind: "item", i: it.idx })}
                onFocus={() => { setFocusIdx(it.idx); setHover({ kind: "item", i: it.idx }); }}
                onBlur={() => setHover(null)}
                onClick={() => { setFocusIdx(it.idx); setPinned((p) => (p?.kind === "item" && p.i === it.idx ? null : { kind: "item", i: it.idx })); }}
                onKeyDown={(e) => onKey(e, it.idx)}>
                <path d={arcPath(R.i0, R.i1, it.a0, it.a1)} fill={g.tone} className="sk-sfill" />
                {fits && (
                  <text className="sk-slabel" x={lx} y={ly} dy="0.35em" textAnchor="middle"
                    transform={`rotate(${flip ? deg + 90 : deg - 90} ${lx} ${ly})`}>{it.s.name}</text>
                )}
              </g>
            );
          })}
          <g className="sk-core" aria-hidden="true">
            <circle cx={C} cy={C} r={R.core} />
            <image href="/images/logo-dt.png" x={C - 34} y={C - 34} width="68" height="68" preserveAspectRatio="xMidYMid meet" />
          </g>
        </svg>

        <aside id={panelId} className="sk-panel" aria-live="polite">
          {activeItem ? (
            <>
              <h3 className="sk-pname">{activeItem.s.name}</h3>
              <p className="sk-pgroupname">{activeGroup.group}</p>
              <p className="sk-puse">{activeItem.s.use}</p>
              {pinned && <p className="sk-hint">Pinned. Press Escape or select it again to clear.</p>}
            </>
          ) : activeGroup ? (
            <>
              <h3 className="sk-pname">{activeGroup.group}</h3>
              <p className="sk-pdesc">{activeGroup.descriptor}</p>
              <ul className="sk-chips">{activeGroup.items.map((it) => <li key={it.key}>{it.s.name}</li>)}</ul>
            </>
          ) : (
            <>
              <p className="sk-hint">Tools and methods in one view. Hover or select a slice to see what it is for.</p>
              <ul className="sk-legend">
                {groups.map((g) => (
                  <li key={g.group}><span className="sk-swatch" style={{ background: g.tone }} aria-hidden="true" />
                    {g.group} <span className="sk-n">{g.items.length}</span></li>
                ))}
              </ul>
            </>
          )}
        </aside>
      </div>

      <div className="visually-hidden">
        <h3>All skills by group</h3>
        {groups.map((g) => (
          <div key={g.group}>
            <h4>{g.group}: {g.descriptor}</h4>
            <ul>{g.items.map((it) => <li key={it.key}>{it.s.name}: {it.s.use}</li>)}</ul>
          </div>
        ))}
      </div>
    </div>
  );
}

