
import { ArrowUpRight, ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div>
            <span className="eyebrow">A GOOD CONVERSATION STARTS HERE</span>
            <h2>
              Let's build
              <br />
              something <em>meaningful.</em>
            </h2>
          </div>

          <Link to="/contact" className="footer-cta">
            Get in touch
            <ArrowUpRight size={18} />
          </Link>
        </div>

        <div className="footer-bottom">
          <Link to="/" className="footer-brand">
            DT<span>.</span>
          </Link>

          <p>© {currentYear} Devanshu Tayal. All rights reserved.</p>

          <a href="#top" className="back-to-top">
            Back to top <ArrowUp size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}
