
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, Moon, Sun, X } from "lucide-react";
import "./Header.css";

const navigation = [
  { label: "About", path: "/about" },
  { label: "Experience", path: "/experience" },
  { label: "Expertise", path: "/expertise" },
  { label: "Projects", path: "/projects" },
  { label: "Community", path: "/community" },
  { label: "Speaking", path: "/speaking" },
];

export default function Header({ theme, toggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="header-inner container">
        <Link
          to="/"
          className="brand"
          aria-label="Devanshu Tayal home"
          onClick={closeMenu}
        >
          DT<span>.</span>
        </Link>

        <nav className={`desktop-nav ${menuOpen ? "is-open" : ""}`}>
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMenu}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}

          <NavLink
            to="/contact"
            onClick={closeMenu}
            className={({ isActive }) =>
              `nav-contact ${isActive ? "active" : ""}`
            }
          >
            Let's talk <span aria-hidden="true">↗</span>
          </NavLink>
        </nav>

        <div className="header-actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
            title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
          >
            {theme === "light" ? (
              <Moon size={18} strokeWidth={1.7} />
            ) : (
              <Sun size={18} strokeWidth={1.7} />
            )}
          </button>

          <button
            className="mobile-menu-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}
