import { getEmail } from "../../lib/email";
import { useState } from "react";
import Icon from "./Icon";

// Copies the address to the clipboard for people without a mail app. The address itself is never shown.
export default function CopyEmail({ className = "" }) {
  const [state, setState] = useState("idle");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(getEmail());
      setState("done");
    } catch {
      setState("fail");
    }
    setTimeout(() => setState("idle"), 2500);
  };
  return (
    <button type="button" className={`copy-email ${className}`.trim()} onClick={copy}>
      <Icon name="mail" size={16} />
      <span aria-live="polite">{state === "done" ? "Email copied" : state === "fail" ? "Couldn't copy, use Email me" : "Copy email"}</span>
    </button>
  );
}
