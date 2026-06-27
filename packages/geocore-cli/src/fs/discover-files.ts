import * as fs from "fs";
import * as path from "path";
import { CliError } from "../utils/cli-error.js";

function matchesPattern(filePath: string, pattern: string, baseDir: string): boolean {
  const normPath = filePath.replace(/\\/g, "/");
  const normPattern = pattern.replace(/\\/g, "/");

  if (normPattern.startsWith("**/*")) {
    const ext = normPattern.slice(4);
    return normPath.endsWith(ext);
  }

  if (normPattern.startsWith("*")) {
    const ext = normPattern.slice(1);
    const relative = normPath.replace(baseDir.replace(/\\/g, "/") + "/", "");
    return relative.endsWith(ext) && !relative.includes("/");
  }

  return normPath.endsWith(normPattern);
}

export async function discoverKnowledgeFiles(input: {
  knowledgeDir: string;
  include?: string[];
  exclude?: string[];
}): Promise<string[]> {
  const { knowledgeDir, include = ["**/*.md", "**/*.json"], exclude = [] } = input;

  if (!fs.existsSync(knowledgeDir)) {
    throw new CliError("FILESYSTEM_ERROR", `Knowledge directory not found: ${knowledgeDir}`);
  }

  const files: string[] = [];

  function scan(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith(".")) {
        continue;
      }
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scan(fullPath);
      } else if (entry.isFile()) {
        files.push(fullPath);
      }
    }
  }

  scan(knowledgeDir);

  const baseDirNormalized = path.resolve(knowledgeDir).replace(/\\/g, "/");

  const filtered = files.filter((file) => {
    const resolvedPath = path.resolve(file).replace(/\\/g, "/");

    const isIncluded = include.some((pattern) => matchesPattern(resolvedPath, pattern, baseDirNormalized));
    if (!isIncluded) return false;

    const isExcluded = exclude.some((pattern) => matchesPattern(resolvedPath, pattern, baseDirNormalized));
    return !isExcluded;
  });

  return filtered.sort();
}
