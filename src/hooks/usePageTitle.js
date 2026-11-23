import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { site } from "../lib/content";

const ORIGIN = "https://www.devanshutayal.com";

function setMeta(selector, attr, value) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(selector.startsWith("link") ? "link" : "meta");
    const [, key, name] = selector.match(/\[(\w+)="([^"]+)"\]/);
    el.setAttribute(key, name);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

// Sets the tab title plus per-page canonical URL and share tags.
// Pass { noindex: true } for pages search engines should skip (the 404 page).
export default function usePageTitle(title, { noindex = false } = {}) {
  const { pathname } = useLocation();
  useEffect(() => {
    const full = title ? `${title} — ${site.name}` : site.seo.title;
    const url = ORIGIN + (pathname === "/" ? "/" : pathname.replace(/\/$/, ""));
    document.title = full;
    setMeta('link[rel="canonical"]', "href", url);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[property="og:title"]', "content", full);
    setMeta('meta[name="twitter:title"]', "content", full);
    setMeta('meta[name="description"]', "content", site.seo.description);
    setMeta('meta[name="robots"]', "content", noindex ? "noindex" : "index, follow");
  }, [title, pathname, noindex]);
}
