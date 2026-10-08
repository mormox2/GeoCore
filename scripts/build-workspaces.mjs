#!/usr/bin/env node
// Builds every workspace that has a build script, dependencies first.
// `npm run build --workspaces` runs in alphabetical order, which builds
// geocore-cli before geocore-server/geocore-vector and fails on a clean checkout.
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const rootPkg = JSON.parse(readFileSync(join(root, "package.json"), "utf-8"));

const workspaces = rootPkg.workspaces
  .flatMap((pattern) => {
    const base = join(root, pattern.replace(/\/\*$/, ""));
    return readdirSync(base).map((dir) => join(base, dir, "package.json"));
  })
  .filter((file) => existsSync(file))
  .map((file) => JSON.parse(readFileSync(file, "utf-8")));

const byName = new Map(workspaces.map((pkg) => [pkg.name, pkg]));
const order = [];
const state = new Map(); // name -> "visiting" | "done"

function visit(name, trail) {
  if (state.get(name) === "done") return;
  if (state.get(name) === "visiting") throw new Error(`Dependency cycle: ${[...trail, name].join(" -> ")}`);
  state.set(name, "visiting");
  const pkg = byName.get(name);
  const deps = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies };
  for (const dep of Object.keys(deps).filter((d) => byName.has(d))) visit(dep, [...trail, name]);
  state.set(name, "done");
  order.push(pkg);
}

for (const pkg of workspaces) visit(pkg.name, []);

for (const pkg of order.filter((p) => p.scripts?.build)) {
  console.log(`\n▶ build ${pkg.name}`);
  execFileSync("npm", ["run", "build", "--workspace", pkg.name], { cwd: root, stdio: "inherit" });
}
