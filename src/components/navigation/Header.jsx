import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { navigation, site } from "../../lib/content";
import "./Header.css";

export default function Header() {
  // The phone menu remembers the route it was opened on, so it closes automatically on navigation.
  const [mobileAt, setMobileAt] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef(null);
  const { pathname } = useLocation();
  const mobileOpen = mobileAt === pathname;
  const setMobileOpen = (fn) => setMobileAt((cur) => ((typeof fn === "function" ? fn(cur === pathname) : fn) ? pathname : null));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      // Closing the mobile menu hides its links, so send focus back to the button that opened it.
      const toggle = toggleRef.current;
      if (toggle?.getAttribute("aria-expanded") === "true") toggle.focus();
      setMobileAt(null);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    // While the full-screen menu is open, make the page behind it unreachable,
    // so keyboard and screen-reader focus stays inside the menu.
    const behind = [document.getElementById("main-content"), document.querySelector(".site-footer")];
    behind.forEach((el) => { if (el) el.inert = mobileOpen; });
    return () => {
      document.body.style.overflow = "";
      behind.forEach((el) => { if (el) el.inert = false; });
    };
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
          </ul>
          <NavLink to={navigation.cta.path} className="nav-contact">
            {navigation.cta.label} <ArrowUpRight size={15} aria-hidden="true" />
          </NavLink>
        </nav>

        <button
          type="button"
          ref={toggleRef}
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
