import Icon from "./Icon";
import ProjectIllustration from "./ProjectCovers";
import "./ProjectCard.css";

// Deterministic PRNG seeded from the project title, so every cover differs but never changes.
function seeded(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); h ^= h >>> 16; return (h >>> 0) / 4294967296; };
}

const W = 320, H = 180;
const r1 = (n) => Math.round(n * 10) / 10;

function motif(category, rand) {
  const A = "var(--motif-accent)", L = "var(--motif-line)";
  switch (category) {
    case "Machine Learning": {
      const pts = Array.from({ length: 46 }, () => {
        const x = 30 + rand() * 260; const y = 150 - (x - 30) * 0.42 + (rand() - 0.5) * 60;
        return [x, Math.max(18, Math.min(165, y))];
      });
      return <>
        {pts.map(([x, y], i) => <circle key={i} cx={r1(x)} cy={r1(y)} r={i % 7 === 0 ? 3.2 : 2} fill={i % 3 ? L : A} />)}
        <line x1="24" y1="152" x2="296" y2="38" stroke={A} strokeWidth="1.2" strokeDasharray="4 4" />
      </>;
    }
    case "Deep Learning": {
      const f1 = 2 + rand() * 4, f2 = 9 + rand() * 10, ph = rand() * 6;
      const bars = Array.from({ length: 64 }, (_, i) => {
        const t = i / 63; const a = Math.abs(Math.sin(t * f1 + ph) * 0.7 + Math.sin(t * f2) * 0.3) * (0.25 + rand() * 0.75);
        return { x: 20 + i * 4.4, h: 6 + a * 120 };
      });
      return bars.map((b, i) => <rect key={i} x={r1(b.x)} y={r1(90 - b.h / 2)} width="2.2" height={r1(b.h)} rx="1.1" fill={i % 9 === 4 ? A : L} />);
    }
    case "NLP": {
      const rows = [];
      for (let r = 0; r < 6; r++) {
        let x = 22; const y = 26 + r * 24;
        while (x < 290) {
          const w = 14 + rand() * 46; if (x + w > 298) break;
          rows.push(<rect key={`${r}-${x}`} x={r1(x)} y={y} width={r1(w)} height="12" rx="3" fill={rand() > 0.86 ? A : L} />);
          x += w + 6;
        }
      }
      return rows;
    }
    case "Forecasting": {
      let y = 120 + rand() * 20; const pts = [];
      for (let i = 0; i <= 40; i++) { y += (rand() - 0.55) * 14; y = Math.max(30, Math.min(160, y)); pts.push([20 + i * 7, y]); }
      const hist = pts.slice(0, 28), fut = pts.slice(27);
      const path = (p) => p.map(([x, yy], i) => `${i ? "L" : "M"}${r1(x)} ${r1(yy)}`).join(" ");
      const band = fut.map(([x, yy], i) => [x, yy - i * 2.2]).concat(fut.slice().reverse().map(([x, yy], i, a) => [x, yy + (a.length - 1 - i) * 2.2]));
      return <>
        <path d={path(band) + "Z"} fill={A} opacity="0.16" />
        <path d={path(hist)} fill="none" stroke={L} strokeWidth="1.6" />
        <path d={path(fut)} fill="none" stroke={A} strokeWidth="1.8" strokeDasharray="5 4" />
        <line x1={r1(hist[27][0])} y1="14" x2={r1(hist[27][0])} y2="170" stroke={L} strokeWidth="0.8" />
      </>;
    }
    case "Dashboards": {
      const n = 11; const hi = Math.floor(rand() * n);
      return <>
        {Array.from({ length: n }, (_, i) => { const h = 24 + rand() * 110; return <rect key={i} x={28 + i * 25} y={r1(160 - h)} width="15" height={r1(h)} rx="2" fill={i === hi ? A : L} />; })}
        <line x1="20" y1="160.5" x2="300" y2="160.5" stroke={L} strokeWidth="1" />
      </>;
    }
    default: { // AI & LLMs and anything new: node graph
      const nodes = Array.from({ length: 13 }, () => [30 + rand() * 260, 22 + rand() * 136]);
      const edges = [];
      nodes.forEach((a, i) => {
        const near = nodes.map((b, j) => [j, Math.hypot(a[0] - b[0], a[1] - b[1])]).filter(([j]) => j > i).sort((p, q) => p[1] - q[1]).slice(0, 2);
        near.forEach(([j]) => edges.push([i, j]));
      });
      return <>
        {edges.map(([i, j]) => <line key={`${i}-${j}`} x1={r1(nodes[i][0])} y1={r1(nodes[i][1])} x2={r1(nodes[j][0])} y2={r1(nodes[j][1])} stroke={L} strokeWidth="1" />)}
        {nodes.map(([x, y], i) => <circle key={i} cx={r1(x)} cy={r1(y)} r={i === 0 ? 6 : 3.4} fill={i === 0 || i % 5 === 2 ? A : "var(--motif-bg)"} stroke={i === 0 ? "none" : L} strokeWidth="1.2" />)}
      </>;
    }
  }
}

export function ProjectCover({ project }) {
  return (
    <div className="project-cover-art" data-cat={project.category}>
      <ProjectIllustration cover={project.cover} fallback={
        <svg className="project-motif" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" focusable="false">
          {motif(project.category, seeded(project.title))}
        </svg>
      } />
      <span className="project-cover-label">{project.category}</span>
    </div>
  );
}

// Card shows project.image if provided; otherwise the authored cover for project.cover,
// falling back to a generated pattern from its category.
export default function ProjectCard({ project, size = "md" }) {
  const external = /^https?:/.test(project.url);
  return (
    <article className={`project-card project-card-${size}`}>
      <div className="project-cover" aria-hidden="true">
        {project.image ? (
          <img src={project.image} alt="" loading="lazy" width="640" height="360" />
        ) : <ProjectCover project={project} />}
      </div>
      <div className="project-body">
        <h3>
          <a href={project.url} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="project-link">
            {project.title}
            {external && <span className="visually-hidden"> (opens in a new tab)</span>}
          </a>
        </h3>
        <Icon name="external" size={18} className="project-arrow" />
        <p>{project.summary}</p>
        {project.tags?.length > 0 && (
          <ul className="tag-list" aria-label="Technologies">
            {project.tags.map((t) => <li key={t}>{t}</li>)}
          </ul>
        )}
      </div>
    </article>
  );
}
