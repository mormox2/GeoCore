import { GC_GRAPH_ORPHAN_OBJECT } from "../validation/validation-codes.js";
export function detectOrphans(registry) {
    const issues = [];
    const koNodes = registry.nodes.filter((n) => n.type === "knowledge-object");
    const referencedNodeIds = new Set();
    for (const rel of registry.relationships) {
        if (rel.sourceId)
            referencedNodeIds.add(rel.sourceId);
        if (rel.targetId)
            referencedNodeIds.add(rel.targetId);
    }
    for (const node of koNodes) {
        if (!referencedNodeIds.has(node.id)) {
            issues.push({
                id: `${GC_GRAPH_ORPHAN_OBJECT}_${node.id}`,
                severity: "warning",
                code: GC_GRAPH_ORPHAN_OBJECT,
                message: `Knowledge Object '${node.id}' is an orphan (has no relationships).`,
                objectId: node.id,
                recommendation: `Establish at least one relationship for '${node.id}' to connect it to the graph.`,
            });
        }
    }
    return issues;
}
