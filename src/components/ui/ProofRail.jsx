import { site, statValue } from "../../lib/content";
import SmartLink from "./SmartLink";
import Icon from "./Icon";
import CountUp from "./CountUp";
import "./ProofRail.css";

function Stat({ stat }) {
  const body = (
    <>
      <span className="proof-value"><CountUp value={statValue(stat.value)} /></span>
      <span className="proof-label">
        {stat.icon && <Icon name={stat.icon} size={20} className="proof-icon" />}
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
  if (!site.stats?.length) return null;
  return (
    <section className="proof" aria-label="At a glance">
      <ul className="container proof-list">
        {site.stats.map((s) => <Stat key={s.label} stat={s} />)}
      </ul>
    </section>
  );
}
