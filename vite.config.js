import { existsSync, readFileSync } from "node:fs";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// The Download CV button only renders when the PDF named in site.json is actually in public/.
const site = JSON.parse(readFileSync(new URL("./src/content/site.json", import.meta.url), "utf8"));
const hasCv = Boolean(site.cv) && existsSync(new URL(`./public${site.cv}`, import.meta.url));

export default defineConfig({
  plugins: [react()],
  define: { __HAS_CV__: JSON.stringify(hasCv) },
});
