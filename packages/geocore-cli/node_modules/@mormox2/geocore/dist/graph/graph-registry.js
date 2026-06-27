export function createGraphRegistry(nodes = [], relationships = []) {
    return { nodes, relationships };
}
export function findNodeById(registry, id) {
    return registry.nodes.find((n) => n.id === id);
}
export function hasNode(registry, id) {
    return registry.nodes.some((n) => n.id === id);
}
export function getOutgoingRelationships(registry, nodeId) {
    return registry.relationships.filter((r) => r.sourceId === nodeId);
}
export function getIncomingRelationships(registry, nodeId) {
    return registry.relationships.filter((r) => r.targetId === nodeId);
}
export function getRelationshipsForNode(registry, nodeId) {
    return registry.relationships.filter((r) => r.sourceId === nodeId || r.targetId === nodeId);
}
