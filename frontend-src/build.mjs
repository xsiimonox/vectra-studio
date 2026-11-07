#!/usr/bin/env node
/** Build Vectra Studio cards from GPL-2.0 ha-mobius sources. Commit output with sources. */

import * as esbuild from "esbuild";
import { readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = join(HERE, "src");
const DIST_DIR = join(HERE, "..", "custom_components", "vectra_studio", "frontend", "dist");

// Only files matching this naming convention are real, standalone
// cards (each defines and registers its own custom element) --
// anything else directly in src/ (format.ts, localize/) is a shared
// module, already bundled directly into whichever card(s) import it.
// Building it again as its own separate, unregistered output file
// would just be dead weight in dist/ that serves no purpose.
const entryPoints = readdirSync(SRC_DIR)
  .filter((f) => /^vectra-studio-.*-card\.(js|ts)$/.test(f))
  .map((f) => join(SRC_DIR, f));

if (entryPoints.length === 0) {
  console.error(`No .js files found in ${SRC_DIR}`);
  process.exit(1);
}

await esbuild.build({
  entryPoints,
  bundle: true,
  minify: true,
  format: "esm",
  // Explicit, not relying on esbuild's own current default (which
  // already happens to preserve native class syntax as of this
  // writing) -- Lit requires real ES6 class/extends semantics, and
  // downleveling them to ES5 function-based prototypes produces a
  // runtime "TypeError: Class constructor cannot be invoked without
  // 'new'" (a well-documented gotcha for exactly this kind of card;
  // see custom-cards/boilerplate-card's own README). Pinned so a
  // future esbuild version changing its own default can't silently
  // reintroduce that failure mode here.
  target: "es2022",
  outdir: DIST_DIR,
});

for (const f of entryPoints) console.log(`Built ${f.replace(HERE + "/", "")} -> dist/`);
