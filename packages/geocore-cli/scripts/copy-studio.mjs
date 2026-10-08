// Bundles the static Studio app (apps/geocore-studio) into this package so that
// `geocore studio` works from an npm install, not only inside the monorepo.
import { cpSync, existsSync, rmSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(packageDir, "../../apps/geocore-studio");
const target = join(packageDir, "studio");

if (!existsSync(source)) {
  console.warn(`[copy-studio] ${source} not found; keeping the existing bundled studio.`);
  process.exit(0);
}

const EXCLUDED = new Set(["tests", "node_modules", "package.json"]);
rmSync(target, { recursive: true, force: true });
cpSync(source, target, {
  recursive: true,
  filter: (src) => src === source || !EXCLUDED.has(basename(src)),
});
console.log(`[copy-studio] Studio bundled into ${target}`);
