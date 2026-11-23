export default function Eyebrow({ children, mark = false }) {
  return (
    <p className="eyebrow">
      {children}
      {mark && <svg className="eyebrow-mark" width="22" height="16" viewBox="0 0 22 16" aria-hidden="true"><path d="M2 14 6 3M9 14l6-9M13 15l7-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none"/></svg>}
    </p>
  );
}
