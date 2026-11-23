import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X, ArrowUpRight } from "lucide-react";
import { navigation, site } from "../../lib/content";
import "./Header.css";

export default function Header() {
  // Menus remember the route they were opened on, so they close automatically on navigation.
  const [mobileAt, setMobileAt] = useState(null);
  const [moreAt, setMoreAt] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const moreRef = useRef(null);
  const { pathname } = useLocation();
  const mobileOpen = mobileAt === pathname;
  const moreOpen = moreAt === pathname;
  const setMobileOpen = (fn) => setMobileAt((cur) => ((typeof fn === "function" ? fn(cur === pathname) : fn) ? pathname : null));
  const setMoreOpen = (fn) => setMoreAt((cur) => ((typeof fn === "function" ? fn(cur === pathname) : fn) ? pathname : null));
  const isMoreActive = navigation.more.some((i) => i.path === pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    const onDown = (e) => { if (moreRef.current && !moreRef.current.contains(e.target)) setMoreAt(null); };
    const onKey = (e) => { if (e.key === "Escape") { setMoreAt(null); setMobileAt(null); } };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const linkClass = ({ isActive }) => `nav-link${isActive ? " active" : ""}`;

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}${mobileOpen ? " menu-open" : ""}`}>
      <div className="header-inner container">
        <Link to="/" className="brand" aria-label={`${site.name} — home`}>
          <img src={site.logo} alt="" width="51" height="26" />
        </Link>

        <nav className="main-nav" id="main-nav" aria-label="Main">
          <ul className="nav-list">
            {navigation.primary.map((item) => (
              <li key={item.path}>
                <NavLink to={item.path} end={item.path === "/"} className={linkClass}>{item.label}</NavLink>
              </li>
            ))}
            {navigation.more.length > 0 && (
<li className="more-menu" ref={moreRef}>
              <button
                type="button"
                className={`nav-link more-trigger${isMoreActive ? " active" : ""}`}
                aria-expanded={moreOpen}
                aria-controls="more-menu-list"
                onClick={() => setMoreOpen((o) => !o)}
              >
                More <ChevronDown size={15} aria-hidden="true" className={moreOpen ? "chevron-open" : ""} />
              </button>
              <ul id="more-menu-list" className={`more-dropdown${moreOpen ? " is-open" : ""}`}>
                {navigation.more.map((item) => (
                  <li key={item.path}>
                    <NavLink to={item.path} className={({ isActive }) => `dropdown-link${isActive ? " active" : ""}`}>{item.label}</NavLink>
                  </li>
                ))}
              </ul>
            </li>
            )}
          </ul>
          <NavLink to={navigation.cta.path} className="nav-contact">
            {navigation.cta.label} <ArrowUpRight size={15} aria-hidden="true" />
          </NavLink>
        </nav>

        <button
          type="button"
          className="mobile-toggle"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="main-nav"
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
        </button>
      </div>
    </header>
  );
}
