import * as path from "path";
export function isSafePath(base, target) {
    const resolvedBase = path.resolve(base);
    const resolvedTarget = path.resolve(resolvedBase, target);
    return resolvedTarget.startsWith(resolvedBase);
}
