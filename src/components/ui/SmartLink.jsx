import { Link } from "react-router-dom";
import { isExternal } from "../../lib/content";

// Internal paths use the router; external links open in a new tab safely.
export default function SmartLink({ to, children, ...rest }) {
  if (isExternal(to)) {
    const newTab = !to.startsWith("mailto:");
    return (
      <a href={to} {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
        {children}
        {newTab && <span className="visually-hidden"> (opens in a new tab)</span>}
      </a>
    );
  }
  return <Link to={to} {...rest}>{children}</Link>;
}
