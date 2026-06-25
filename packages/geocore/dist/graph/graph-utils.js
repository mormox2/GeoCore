export function getNeighbors(registry, nodeId) {
    const neighborIds = new Set();
    for (const rel of registry.relationships) {
        if (rel.sourceId === nodeId && rel.targetId) {
            neighborIds.add(rel.targetId);
        }
        else if (rel.targetId === nodeId && rel.sourceId) {
            neighborIds.add(rel.sourceId);
        }
    }
    return registry.nodes.filter((node) => neighborIds.has(node.id));
}
export function hasPath(registry, startNodeId, endNodeId) {
    const visited = new Set();
    function dfs(currentId) {
        if (currentId === endNodeId) {
            return true;
        }
        visited.add(currentId);
        const outgoing = registry.relationships.filter((r) => r.sourceId === currentId);
        for (const rel of outgoing) {
            if (rel.targetId && !visited.has(rel.targetId)) {
                if (dfs(rel.targetId)) {
                    return true;
                }
            }
        }
        return false;
    }
    return dfs(startNodeId);
}
