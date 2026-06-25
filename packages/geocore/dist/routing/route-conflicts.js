import { GC_ROUTE_ID_DUPLICATE, GC_ROUTE_PATH_DUPLICATE, GC_ROUTE_CANONICAL_URL_DUPLICATE, GC_ROUTE_REDIRECT_LOOP, GC_ROUTE_REDIRECT_SELF, } from "../validation/validation-codes.js";
function diagnostic(index, severity, code, message, extra = {}) {
    return {
        id: `route-diagnostic-${index}`,
        severity,
        code,
        message,
        ...extra,
    };
}
/**
 * Detect duplicate route ids, duplicate paths, duplicate canonical URLs,
 * redirect loops, and self-redirects across the given routes.
 *
 * Severity rules:
 * - duplicate id / path / canonical URL -> error
 * - redirect loop -> critical
 * - self-redirect -> error
 */
export function detectRouteConflicts(routes) {
    const diagnostics = [];
    let counter = 0;
    const idIndex = new Map();
    const pathIndex = new Map();
    const canonicalIndex = new Map();
    for (const route of routes) {
        pushIndex(idIndex, route.id, route);
        if (route.path)
            pushIndex(pathIndex, route.path, route);
        if (route.canonicalUrl)
            pushIndex(canonicalIndex, route.canonicalUrl, route);
        // Redirect checks operate per-route: a loop/self can be fully described
        // by a single route's own redirect list, or across two routes' redirects.
        for (const redirect of route.redirects ?? []) {
            if (redirect.from === redirect.to) {
                diagnostics.push(diagnostic(counter++, "error", GC_ROUTE_REDIRECT_SELF, `Redirect source equals target ("${redirect.from}").`, { routeId: route.id, path: route.path }));
            }
        }
    }
    for (const [id, group] of idIndex) {
        if (group.length > 1) {
            diagnostics.push(diagnostic(counter++, "error", GC_ROUTE_ID_DUPLICATE, `Duplicate route id "${id}" detected on ${group.length} routes.`, { routeId: id }));
        }
    }
    for (const [path, group] of pathIndex) {
        if (group.length > 1) {
            diagnostics.push(diagnostic(counter++, "error", GC_ROUTE_PATH_DUPLICATE, `Duplicate route path "${path}" detected on ${group.length} routes.`, { path }));
        }
    }
    for (const [canonical, group] of canonicalIndex) {
        if (group.length > 1) {
            diagnostics.push(diagnostic(counter++, "error", GC_ROUTE_CANONICAL_URL_DUPLICATE, `Duplicate canonical URL "${canonical}" detected on ${group.length} routes.`, { path: canonical }));
        }
    }
    // Redirect loops: build a from->to graph across all routes' redirects and
    // look for a cycle reachable within the redirect set. Reported once per loop.
    const fromTo = new Map();
    for (const route of routes) {
        for (const redirect of route.redirects ?? []) {
            if (!fromTo.has(redirect.from))
                fromTo.set(redirect.from, new Set());
            fromTo.get(redirect.from).add(redirect.to);
        }
    }
    const reportedLoops = new Set();
    for (const start of fromTo.keys()) {
        const cycle = findCycleFrom(start, fromTo);
        if (cycle) {
            const signature = [...cycle].sort().join("|");
            if (reportedLoops.has(signature))
                continue;
            reportedLoops.add(signature);
            diagnostics.push(diagnostic(counter++, "critical", GC_ROUTE_REDIRECT_LOOP, `Redirect loop detected involving: ${cycle.join(" -> ")}.`, { path: start }));
        }
    }
    return diagnostics;
}
function pushIndex(index, key, route) {
    if (!index.has(key))
        index.set(key, []);
    index.get(key).push(route);
}
/**
 * DFS cycle search from a starting node. Returns the cycle path if found.
 */
function findCycleFrom(start, fromTo) {
    const stack = [start];
    const onStack = new Set([start]);
    const visited = new Set();
    const dfs = (node) => {
        visited.add(node);
        const neighbors = fromTo.get(node);
        if (!neighbors)
            return null;
        for (const next of neighbors) {
            if (next === start && stack.length > 0) {
                return [...stack, next];
            }
            if (!visited.has(next) && !onStack.has(next)) {
                stack.push(next);
                onStack.add(next);
                const found = dfs(next);
                if (found)
                    return found;
                stack.pop();
                onStack.delete(next);
            }
            else if (onStack.has(next)) {
                // back edge to a node currently on the stack -> cycle
                const startIdx = stack.indexOf(next);
                return [...stack.slice(startIdx), next];
            }
        }
        return null;
    };
    return dfs(start);
}
