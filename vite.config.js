import { readFileSync } from "node:fs";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// The CV is generated from the content on every build (scripts/build-cv.mjs), so the Download CV
// button shows whenever site.json has a "cv" path.
const site = JSON.parse(readFileSync(new URL("./src/content/site.json", import.meta.url), "utf8"));
const hasCv = Boolean(site.cv);

export default defineConfig({
  plugins: [react()],
  define: { __HAS_CV__: JSON.stringify(hasCv) },
});
