import SmartLink from "./SmartLink";
import Icon from "./Icon";

export default function Button({ to, variant = "primary", icon = "external", iconLeft, children }) {
  return (
    <SmartLink to={to} className={`btn btn-${variant}`}>
      {iconLeft && <Icon name={iconLeft} size={18} />}
      <span>{children}</span>
      {icon && <Icon name={icon} size={16} />}
    </SmartLink>
  );
}
