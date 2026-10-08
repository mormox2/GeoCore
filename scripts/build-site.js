import { cpSync, mkdirSync, existsSync, rmSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const root = resolve(__dirname, "..");
const outDir = join(root, "dist", "site");
// Match on file/directory names, not on the absolute path (a checkout under ~/tests/ must still build).
const EXCLUDED = new Set(["tests", "node_modules", "package.json", "serve.js"]);

console.log("🚀 Building GeoCore Production Site Bundle for Vercel...\n");

// Clean and recreate output directory
if (existsSync(outDir)) {
  rmSync(outDir, { recursive: true, force: true });
}
mkdirSync(outDir, { recursive: true });

// 1. Copy Landing Page (apps/geocore-site) -> dist/site
const siteSrc = join(root, "apps", "geocore-site");
console.log("📄 Copying Landing Page assets from apps/geocore-site...");
cpSync(siteSrc, outDir, {
  recursive: true,
  filter: (src) => !EXCLUDED.has(basename(src))
});

// 2. Copy GeoCore Studio (apps/geocore-studio) -> dist/site/studio
const studioSrc = join(root, "apps", "geocore-studio");
const studioDest = join(outDir, "studio");
console.log("🎨 Copying GeoCore Studio assets -> dist/site/studio...");
mkdirSync(studioDest, { recursive: true });
cpSync(studioSrc, studioDest, {
  recursive: true,
  filter: (src) => !EXCLUDED.has(basename(src))
});

// 3. Copy GeoCore Web Component Widget -> dist/site/widget
const widgetSrc = join(root, "packages", "geocore", "dist", "widget");
const widgetDest = join(outDir, "widget");
if (existsSync(widgetSrc)) {
  console.log("💬 Copying Web Component Widget -> dist/site/widget...");
  mkdirSync(widgetDest, { recursive: true });
  cpSync(widgetSrc, widgetDest, { recursive: true });
  // The widget module imports ../renderer/html-safety.js; ship it alongside.
  mkdirSync(join(outDir, "renderer"), { recursive: true });
  cpSync(join(root, "packages", "geocore", "dist", "renderer", "html-safety.js"), join(outDir, "renderer", "html-safety.js"));
}

// 4. Copy Demo Datasets if available
const rtimiSrc = join(root, "dist", "rtimidental");
if (existsSync(rtimiSrc)) {
  console.log("🏥 Copying RTimi Dental demo dataset -> dist/site/data/rtimidental...");
  const dest = join(outDir, "data", "rtimidental");
  mkdirSync(dest, { recursive: true });
  cpSync(rtimiSrc, dest, { recursive: true });
}

const dawajinSrc = join(root, "dist", "dawajinpro");
if (existsSync(dawajinSrc)) {
  console.log("🐔 Copying Dawajin Pro demo dataset -> dist/site/data/dawajinpro...");
  const dest = join(outDir, "data", "dawajinpro");
  mkdirSync(dest, { recursive: true });
  cpSync(dawajinSrc, dest, { recursive: true });
}

console.log("\n✅ GeoCore Vercel bundle ready in dist/site!");
