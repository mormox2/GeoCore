#!/usr/bin/env node
// Fails when source files under packages/*/src (and examples/*/src) use an explicit
// `any` type. AGENTS.md requires strict typing; use precise types or `unknown` plus a
// type guard instead. Uses the TypeScript AST, so comments and strings never match.
import ts from "typescript";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const roots = ["packages", "examples"].flatMap((group) => {
  const base = join(root, group);
  return readdirSync(base)
    .map((name) => join(base, name, "src"))
    .filter((dir) => existsSync(dir));
});

function* tsFiles(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* tsFiles(path);
    else if (/\.tsx?$/.test(name) && !name.endsWith(".d.ts")) yield path;
  }
}

const findings = [];
for (const dir of roots) {
  for (const file of tsFiles(dir)) {
    const source = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true);
    const visit = (node) => {
      if (node.kind === ts.SyntaxKind.AnyKeyword) {
        const { line, character } = source.getLineAndCharacterOfPosition(node.getStart());
        findings.push(`${relative(root, file)}:${line + 1}:${character + 1}  ${node.parent.getText().slice(0, 80)}`);
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
  }
}

if (findings.length > 0) {
  console.error(`Found ${findings.length} explicit 'any' type(s):\n${findings.join("\n")}`);
  process.exit(1);
}
console.log("No explicit 'any' types in packages/*/src and examples/*/src.");
