import { Buffer } from "node:buffer";
import { readFileSync } from "node:fs";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// The CV is generated from the content on every build (scripts/build-cv.mjs), so the Download CV
// button shows whenever site.json has a "cv" path.
const site = JSON.parse(readFileSync(new URL("./src/content/site.json", import.meta.url), "utf8"));
const hasCv = Boolean(site.cv);

// The email address is never shipped as plain text: it is removed from the bundled site.json and passed in
// reversed + base64-encoded, so scrapers reading the page or the JS don't find it. See src/lib/email.js.
const emailCode = Buffer.from([...(site.email || "")].reverse().join("")).toString("base64");
const stripEmail = {
  name: "strip-email",
  enforce: "pre",
  transform(code, id) {
    if (!id.replace(/\\/g, "/").endsWith("src/content/site.json")) return null;
    const data = JSON.parse(code);
    delete data.email;
    return { code: JSON.stringify(data), map: null };
  },
};

export default defineConfig({
  plugins: [stripEmail, react()],
  define: { __HAS_CV__: JSON.stringify(hasCv), __EMAIL_CODE__: JSON.stringify(emailCode) },
});
