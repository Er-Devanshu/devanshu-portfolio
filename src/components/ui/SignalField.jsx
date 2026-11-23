import { useEffect, useRef } from "react";
import "./SignalField.css";

// Noise that settles into a signal: warm points ease from scatter onto a smooth trend line.
const COUNT = 140;
const DURATION = 1800;
const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const curve = (u) => 0.78 - 0.5 / (1 + Math.exp(-7 * (u - 0.55))) - 0.08 * Math.sin(u * 3.4);

function seeded(seed) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

export default function SignalField({ className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const rand = seeded(42);
    const pts = Array.from({ length: COUNT }, (_, i) => {
      const u = (i + rand() * 0.8) / COUNT;
      const g = (rand() + rand() + rand() - 1.5) * 0.035;
      return { sx: rand(), sy: rand(), u, r: g, size: 1 + rand() * 1.8, depth: 0.3 + rand() * 0.7, delay: rand() * 0.25 };
    });
    let w = 0, h = 0, raf = 0, start = 0, visible = true, done = false;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(reduce ? 1 : progress());
    };
    const progress = () => (start ? Math.min((performance.now() - start) / DURATION, 1) : 0);

    function draw(p) {
      ctx.clearRect(0, 0, w, h);
      const ox = mouse.x * 14, oy = mouse.y * 10;
      // trend line, revealed as the points settle
      const lineP = easeOutExpo(Math.max(0, (p - 0.35) / 0.65));
      if (lineP > 0) {
        ctx.beginPath();
        const steps = 80;
        for (let i = 0; i <= steps * lineP; i++) {
          const u = i / steps;
          const x = u * w + ox * 0.5, y = curve(u) * h + oy * 0.5;
          i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.strokeStyle = "rgba(239,145,72,0.55)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      for (const pt of pts) {
        const t = easeOutExpo(Math.max(0, (p - pt.delay) / (1 - pt.delay)));
        const tx = pt.u * w, ty = (curve(pt.u) + pt.r) * h;
        const x = pt.sx * w + (tx - pt.sx * w) * t + ox * pt.depth;
        const y = pt.sy * h + (ty - pt.sy * h) * t + oy * pt.depth;
        ctx.globalAlpha = 0.35 + 0.5 * pt.depth;
        ctx.fillStyle = pt.depth > 0.75 ? "#f6a35f" : "#e9d9c4";
        ctx.beginPath();
        ctx.arc(x, y, pt.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function tick() {
      raf = 0;
      if (!visible || document.hidden) return;
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;
      const p = progress();
      draw(p);
      done = p >= 1;
      const settling = Math.abs(mouse.tx - mouse.x) + Math.abs(mouse.ty - mouse.y) > 0.002;
      if (!done || settling) raf = requestAnimationFrame(tick);
    }
    const kick = () => { if (!raf && !reduce) raf = requestAnimationFrame(tick); };

    const onMove = (e) => {
      mouse.tx = e.clientX / window.innerWidth - 0.5;
      mouse.ty = e.clientY / window.innerHeight - 0.5;
      kick();
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) { if (!start && !reduce) start = performance.now(); kick(); }
    });
    const ro = new ResizeObserver(resize);
    const onVis = () => kick();

    ro.observe(canvas);
    io.observe(canvas);
    document.addEventListener("visibilitychange", onVis);
    if (fine && !reduce) window.addEventListener("pointermove", onMove, { passive: true });
    resize();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} className={`signal-field ${className}`} aria-hidden="true" />;
}
