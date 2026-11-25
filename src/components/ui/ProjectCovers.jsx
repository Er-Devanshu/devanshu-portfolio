// Authored per-project cover illustrations. One visual language:
// charcoal ground, ivory 1.5px linework, a single orange highlight.
// Canvas is 320x180 (16:9); the bottom-left corner is kept quiet for the category label.

const L = "#f1ebe2";
const A = "#ef9148";
const BG = "#121718";
const SW = 1.5;
const dim = { stroke: L, strokeOpacity: 0.4, strokeWidth: SW, fill: "none" };
const line = { stroke: L, strokeWidth: SW, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
const accent = { stroke: A, strokeWidth: SW, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };

function Grid() {
  const v = [], h = [];
  for (let x = 20; x < 320; x += 20) v.push(<line key={`v${x}`} x1={x} y1="0" x2={x} y2="180" />);
  for (let y = 20; y < 180; y += 20) h.push(<line key={`h${y}`} x1="0" y1={y} x2="320" y2={y} />);
  return <g stroke={L} strokeOpacity="0.05" strokeWidth="1">{v}{h}</g>;
}

const COVERS = {
  latency: () => {
    // A live latency line with a threshold; the spike that crosses it raises an alert.
    const ys = [112, 108, 114, 104, 110, 106, 112, 102, 108, 98, 104, 46, 100, 108, 104, 110, 106, 112, 104, 108];
    const d = ys.map((y, i) => `${i ? "L" : "M"}${28 + i * 14} ${y}`).join("");
    return (
      <>
        <path {...dim} d="M28 70h270" strokeDasharray="4 5" />
        <path {...line} d={d} />
        <path {...accent} d={`M${28 + 10 * 14} 98L${28 + 11 * 14} 46L${28 + 12 * 14} 100`} />
        <circle cx={28 + 11 * 14} cy="46" r="5" fill={A} />
        <g {...accent}><rect x="218" y="22" width="78" height="26" rx="6" fill={A} fillOpacity="0.14" /><path d="M230 35h8M244 35h40" /></g>
        <g fill={L} fillOpacity="0.55" fontSize="9" fontFamily="var(--font-body)" letterSpacing="0.06em"><text x="30" y="62">THRESHOLD</text></g>
      </>
    );
  },
  datapilot: () => (
    <>
      <path {...line} d="M40 30h112a10 10 0 0 1 10 10v34a10 10 0 0 1-10 10H70l-14 12v-12H40a10 10 0 0 1-10-10V40a10 10 0 0 1 10-10z" />
      <g {...dim}><path d="M46 48h80M46 60h96M46 72h52" /></g>
      <path {...accent} d="M168 70c20 0 26 14 40 14" strokeDasharray="3 4" />
      <path {...accent} d="M204 79l6 5-6 5" />
      <rect {...line} x="216" y="54" width="82" height="102" rx="8" />
      <path {...dim} d="M216 74h82M216 96h82M216 118h82M257 54v102" />
      <g fill={L} fillOpacity="0.85">
        <rect x="226" y="140" width="8" height="10" rx="1.5" /><rect x="238" y="132" width="8" height="18" rx="1.5" />
      </g>
      <rect x="266" y="124" width="8" height="26" rx="1.5" fill={A} />
      <rect x="278" y="134" width="8" height="16" rx="1.5" fill={L} fillOpacity="0.85" />
    </>
  ),
  "chatbot-arena": () => (
    <>
      <rect {...line} x="36" y="34" width="112" height="96" rx="10" />
      <rect {...line} x="172" y="34" width="112" height="96" rx="10" stroke={A} />
      <g {...dim}><path d="M50 58h80M50 72h70M50 86h84M50 100h52M186 58h80M186 72h64M186 86h76" /></g>
      <text x="50" y="52" fill={L} fontSize="11" fontFamily="var(--font-body)" fontWeight="600" dy="-4">A</text>
      <text x="186" y="52" fill={A} fontSize="11" fontFamily="var(--font-body)" fontWeight="600" dy="-4">B</text>
      <circle cx="270" cy="114" r="10" fill={A} />
      <path d="M265 114l4 4 7-8" stroke={BG} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path {...dim} d="M160 40v84" strokeDasharray="2 4" />
    </>
  ),
  tickets: () => (
    <>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${30 + i * 6} ${36 + i * 10})`}>
          <path {...line} fill={BG} d="M0 0h88v14a6 6 0 0 0 0 12v14H0V26a6 6 0 0 0 0-12z" />
          <path {...dim} d="M14 14h50M14 24h34" />
        </g>
      ))}
      <path {...line} d="M132 76h34" />
      <path {...dim} d="M166 76c20 0 20-40 40-40M166 76c20 0 20 40 40 40" />
      <path {...accent} d="M166 76h40" />
      {[["Billing", 36, false], ["Technical", 76, true], ["Account", 116, false]].map(([t, y, hi]) => (
        <g key={t}>
          <rect x="210" y={y - 13} width="86" height="26" rx="6" stroke={hi ? A : L} strokeOpacity={hi ? 1 : 0.5} strokeWidth={SW} fill="none" />
          <text x="222" y={y + 4} fill={hi ? A : L} fillOpacity={hi ? 1 : 0.75} fontSize="11" fontFamily="var(--font-body)">{t}</text>
        </g>
      ))}
    </>
  ),
  tripadvisor: () => {
    const star = (cx, cy, r) => Array.from({ length: 10 }, (_, i) => {
      const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r;
      return `${i ? "L" : "M"}${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)}`;
    }).join("") + "Z";
    return (
      <>
        <rect {...line} x="70" y="22" width="200" height="130" rx="10" />
        <circle {...line} cx="96" cy="48" r="11" />
        <path {...dim} d="M116 44h60M116 54h36" />
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={star(96 + i * 20, 82, 7)} fill={i < 4 ? A : "none"} stroke={A} strokeWidth="1.2" strokeLinejoin="round" />)}
        <rect x="86" y="104" width="78" height="12" rx="3" fill={A} fillOpacity="0.22" />
        <path {...line} d="M88 110h72" />
        <path {...dim} d="M170 110h80M88 130h140" />
      </>
    );
  },
  fraud: () => (
    <>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const y = 26 + i * 22, flag = i === 3;
        return <g key={i}>
          {flag && <rect x="40" y={y - 9} width="246" height="20" rx="4" fill={A} fillOpacity="0.16" stroke={A} strokeWidth={SW} />}
          <circle cx="56" cy={y + 1} r="4" fill={flag ? A : "none"} stroke={flag ? A : L} strokeOpacity={flag ? 1 : 0.5} strokeWidth="1.2" />
          <path d={`M70 ${y + 1}h${70 + ((i * 37) % 40)}`} stroke={L} strokeOpacity={flag ? 0.9 : 0.4} strokeWidth={SW} strokeLinecap="round" />
          <path d={`M${flag ? 236 : 248} ${y + 1}h${flag ? 40 : 28}`} stroke={flag ? A : L} strokeOpacity={flag ? 1 : 0.6} strokeWidth={SW} strokeLinecap="round" />
        </g>;
      })}
      <path {...accent} d="M296 82l8-6v12z" fill={A} />
    </>
  ),
  churn: () => {
    const out = new Set([9, 22, 31]);
    const dots = [];
    for (let r = 0; r < 5; r++) for (let c = 0; c < 8; c++) {
      const i = r * 8 + c, x = 40 + c * 22, y = 40 + r * 24;
      dots.push(out.has(i)
        ? <circle key={i} cx={x} cy={y} r="5" fill="none" stroke={L} strokeOpacity="0.3" strokeWidth="1.2" strokeDasharray="2 2" />
        : <circle key={i} cx={x} cy={y} r="5" fill={L} fillOpacity="0.8" />);
    }
    return (
      <>
        {dots}
        <path {...dim} d="M222 26v126" strokeDasharray="3 4" />
        {[[64, 236, 54], [128, 244, 90], [194, 238, 124]].map(([sx, ex, y], i) => (
          <g key={i}>
            <path {...accent} d={`M${sx + 8} ${[64, 88, 112][i]}C${sx + 60} ${[64, 88, 112][i]} ${ex - 40} ${y} ${ex + 20 + i * 8} ${y}`} strokeOpacity="0.8" />
            <circle cx={ex + 26 + i * 8} cy={y} r="5" fill={A} />
          </g>
        ))}
      </>
    );
  },
  greykite: () => {
    const pts = (fn) => Array.from({ length: 49 }, (_, i) => `${i ? "L" : "M"}${30 + i * 5.6} ${fn(i).toFixed(1)}`).join("");
    return (
      <>
        <path {...dim} d="M30 60h270M30 112h270M30 158h270" strokeOpacity="0.15" />
        <path {...line} d={pts((i) => 46 - i * 0.4 + Math.sin(i * 0.8) * 8 + Math.sin(i * 2.1) * 3)} />
        <path {...accent} d={pts((i) => 100 - i * 0.4)} />
        <path {...line} strokeOpacity="0.75" d={pts((i) => 142 + Math.sin(i * 0.8) * 10)} />
        <g fill={L} fillOpacity="0.55" fontSize="9" fontFamily="var(--font-body)" letterSpacing="0.06em">
          <text x="252" y="24">SERIES</text><text x="256" y="78" fill={A} fillOpacity="1">TREND</text><text x="244" y="128">SEASONAL</text>
        </g>
      </>
    );
  },
  "online-store": () => (
    <>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect {...line} x={30 + i * 90} y="22" width="80" height="40" rx="6" stroke={i === 0 ? A : L} />
          <path d={`M${42 + i * 90} 36h30`} stroke={L} strokeOpacity="0.4" strokeWidth={SW} strokeLinecap="round" />
          <path d={`M${42 + i * 90} 50h${44 - i * 8}`} stroke={i === 0 ? A : L} strokeWidth="3" strokeLinecap="round" />
        </g>
      ))}
      <rect {...dim} x="120" y="74" width="170" height="88" rx="6" />
      {[30, 44, 38, 56, 50, 64, 60].map((h, i) => <rect key={i} x={134 + i * 21} y={152 - h} width="11" height={h} rx="2" fill={i === 5 ? A : L} fillOpacity={i === 5 ? 1 : 0.8} />)}
      <path {...line} d="M134 128L155 118 176 122 197 104 218 108 239 92 260 96 278 84" strokeOpacity="0.6" />
    </>
  ),
  "radial-chart": () => {
    const cx = 210, cy = 90, vals = [0.82, 0.64, 0.9, 0.48, 0.72];
    const arc = (r, f) => {
      const a = -Math.PI / 2 + f * Math.PI * 1.75;
      return `M${cx} ${cy - r}A${r} ${r} 0 ${f * 1.75 > 1 ? 1 : 0} 1 ${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
    };
    return (
      <>
        {vals.map((v, i) => {
          const r = 72 - i * 13;
          return <g key={i}>
            <path d={arc(r, 1)} stroke={L} strokeOpacity="0.12" strokeWidth="7" fill="none" strokeLinecap="round" />
            <path d={arc(r, v)} stroke={i === 2 ? A : L} strokeOpacity={i === 2 ? 1 : 0.8} strokeWidth="7" fill="none" strokeLinecap="round" />
          </g>;
        })}
        <path {...dim} d={`M${cx} ${cy - 76}v-6`} />
        <g {...dim}><path d="M36 40h60M36 56h44M36 72h52" /></g>
        <path {...accent} d="M36 88h36" />
      </>
    );
  },
};

// Renders the authored cover for `cover`, or `fallback` when the key is missing/unknown.
export default function ProjectIllustration({ cover, fallback = null }) {
  const Art = cover && Object.prototype.hasOwnProperty.call(COVERS, cover) ? COVERS[cover] : null;
  if (!Art) return fallback;
  return (
    <svg className="project-motif" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" focusable="false" aria-hidden="true">
      <rect width="320" height="180" fill={BG} />
      <Grid />
      <Art />
    </svg>
  );
}
