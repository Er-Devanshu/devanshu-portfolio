import { site } from "../../lib/content";

// The address never sits in the page as a mailto: link, so bots that scan pages can't harvest it.
// The real mailto: is opened only when someone clicks. Without JavaScript the link goes to /contact.
export default function EmailLink({ className, children, ...rest }) {
  const open = (e) => {
    e.preventDefault();
    window.location.href = `mailto:${site.email}`;
  };
  return (
    <a href="/contact" className={className} onClick={open} {...rest}>
      {children}
    </a>
  );
}
