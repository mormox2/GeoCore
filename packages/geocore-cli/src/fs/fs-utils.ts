import * as path from "path";

export function isSafePath(base: string, target: string): boolean {
  const resolvedBase = path.resolve(base);
  const resolvedTarget = path.resolve(resolvedBase, target);
  return resolvedTarget.startsWith(resolvedBase);
}
