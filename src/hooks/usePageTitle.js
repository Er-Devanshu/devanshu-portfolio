import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { fill, site } from "../lib/content";

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

// Sets the tab title, description, canonical URL and share tags for the current page.
// Titles/descriptions come from site.seo.pages (the same data the build uses to write
// a static HTML file per page, so crawlers that don't run JavaScript see them too).
// Pass { noindex: true } for pages search engines should skip (the 404 page).
export default function usePageTitle(title, { noindex = false } = {}) {
  const { pathname } = useLocation();
  useEffect(() => {
    const path = pathname === "/" ? "/" : pathname.replace(/\/$/, "");
    const page = site.seo.pages?.[path];
    const full = fill(page?.title || (title ? `${title} — ${site.name}` : site.seo.title));
    const description = fill(page?.description || site.seo.description);
    const url = ORIGIN + path;
    document.title = full;
    setMeta('link[rel="canonical"]', "href", url);
    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[property="og:title"]', "content", full);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[name="twitter:title"]', "content", full);
    setMeta('meta[name="twitter:description"]', "content", description);
    setMeta('meta[name="robots"]', "content", noindex ? "noindex" : "index, follow");
  }, [title, pathname, noindex]);
}
