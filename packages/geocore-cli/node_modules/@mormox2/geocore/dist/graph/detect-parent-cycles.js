import { GC_RELATIONSHIP_PARENT_CYCLE } from "../validation/validation-codes.js";
export function detectParentCycles(registry) {
    const issues = [];
    const adj = new Map();
    for (const node of registry.nodes) {
        if (node.id) {
            adj.set(node.id, []);
        }
    }
    for (const rel of registry.relationships) {
        const { sourceId, targetId, type } = rel;
        if (!sourceId || !targetId)
            continue;
        if (!adj.has(sourceId))
            adj.set(sourceId, []);
        if (!adj.has(targetId))
            adj.set(targetId, []);
        if (type === "parent_of") {
            adj.get(sourceId).push(targetId);
        }
        else if (type === "child_of") {
            adj.get(targetId).push(sourceId);
        }
    }
    const state = new Map();
    const path = [];
    const cyclesFound = new Set();
    function dfs(nodeId) {
        state.set(nodeId, 1);
        path.push(nodeId);
        const neighbors = adj.get(nodeId) || [];
        for (const neighbor of neighbors) {
            const neighborState = state.get(neighbor) || 0;
            if (neighborState === 1) {
                const cycleStartIndex = path.indexOf(neighbor);
                const cyclePath = path.slice(cycleStartIndex);
                const cycleString = [...cyclePath, neighbor].join(" -> ");
                const sortedCycle = [...cyclePath].sort().join(",");
                if (!cyclesFound.has(sortedCycle)) {
                    cyclesFound.add(sortedCycle);
                    issues.push({
                        id: `${GC_RELATIONSHIP_PARENT_CYCLE}_${neighbor}_cycle`,
                        severity: "critical",
                        code: GC_RELATIONSHIP_PARENT_CYCLE,
                        message: `Parent-child cycle detected: ${cycleString}`,
                        objectId: neighbor,
                        recommendation: `Remove the cyclical parent-child relationship in the cycle: ${cycleString}.`,
                    });
                }
            }
            else if (neighborState === 0) {
                dfs(neighbor);
            }
        }
        path.pop();
        state.set(nodeId, 2);
    }
    for (const node of adj.keys()) {
        if ((state.get(node) || 0) === 0) {
            dfs(node);
        }
    }
    return issues;
}
