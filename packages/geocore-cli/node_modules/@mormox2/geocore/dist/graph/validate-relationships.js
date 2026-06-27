import { detectOrphans } from "./detect-orphans.js";
import { detectParentCycles } from "./detect-parent-cycles.js";
import { knowledgeRelationshipSchema } from "../schemas/relationship.schema.js";
import { graphNodeSchema } from "../schemas/graph.schema.js";
import * as codes from "../validation/validation-codes.js";
export function validateRelationships(registry) {
    const checkedAt = new Date().toISOString();
    const issues = [];
    // 1. Validate registry object structure
    if (!registry || typeof registry !== "object") {
        return {
            valid: false,
            publishable: false,
            checkedAt,
            issues: [
                {
                    id: `${codes.GC_METADATA_INVALID}_GRAPH_ROOT`,
                    severity: "critical",
                    code: codes.GC_METADATA_INVALID,
                    message: "GraphRegistry must be a non-null object",
                },
            ],
        };
    }
    // 2. Validate Nodes and track Node IDs
    const nodesList = Array.isArray(registry.nodes) ? registry.nodes : [];
    const nodeIds = new Set();
    nodesList.forEach((node, index) => {
        // Check if ID is missing
        if (!node || typeof node !== "object" || !node.id) {
            issues.push({
                id: `${codes.GC_GRAPH_NODE_ID_MISSING}_node_${index}`,
                severity: "critical",
                code: codes.GC_GRAPH_NODE_ID_MISSING,
                message: "Node identifier (id) is missing or empty.",
            });
            return;
        }
        const nodeResult = graphNodeSchema.safeParse(node);
        if (!nodeResult.success) {
            nodeResult.error.issues.forEach((zodIssue, zIndex) => {
                const field = zodIssue.path.join(".");
                const isTypeInvalid = field === "type";
                issues.push({
                    id: `${isTypeInvalid ? codes.GC_GRAPH_NODE_INVALID_TYPE : codes.GC_METADATA_INVALID}_node_${node.id}_${zIndex}`,
                    severity: "error",
                    code: isTypeInvalid ? codes.GC_GRAPH_NODE_INVALID_TYPE : codes.GC_METADATA_INVALID,
                    message: `Node '${node.id}' validation failed for field '${field}': ${zodIssue.message}`,
                    objectId: node.id,
                    field,
                });
            });
        }
        // Check duplicate Node ID
        if (nodeIds.has(node.id)) {
            issues.push({
                id: `${codes.GC_GRAPH_NODE_ID_DUPLICATE}_node_${node.id}`,
                severity: "critical",
                code: codes.GC_GRAPH_NODE_ID_DUPLICATE,
                message: `Node ID '${node.id}' is duplicated.`,
                objectId: node.id,
            });
        }
        else {
            nodeIds.add(node.id);
        }
    });
    // 3. Validate Relationships
    const relsList = Array.isArray(registry.relationships) ? registry.relationships : [];
    const relIds = new Set();
    const relContents = new Set(); // sourceId + targetId + type
    relsList.forEach((rel, index) => {
        if (!rel || typeof rel !== "object") {
            issues.push({
                id: `${codes.GC_METADATA_INVALID}_rel_${index}`,
                severity: "error",
                code: codes.GC_METADATA_INVALID,
                message: "Relationship must be a non-null object",
            });
            return;
        }
        const relResult = knowledgeRelationshipSchema.safeParse(rel);
        // Check ID missing
        if (!rel.id) {
            issues.push({
                id: `${codes.GC_RELATIONSHIP_ID_MISSING}_rel_${index}`,
                severity: "error",
                code: codes.GC_RELATIONSHIP_ID_MISSING,
                message: "Relationship identifier (id) is missing or empty.",
            });
        }
        else {
            // Check ID duplicate
            if (relIds.has(rel.id)) {
                issues.push({
                    id: `${codes.GC_RELATIONSHIP_ID_DUPLICATE}_rel_${rel.id}`,
                    severity: "error",
                    code: codes.GC_RELATIONSHIP_ID_DUPLICATE,
                    message: `Relationship ID '${rel.id}' is duplicated.`,
                    objectId: rel.id,
                });
            }
            else {
                relIds.add(rel.id);
            }
        }
        // Check sourceId missing
        if (!rel.sourceId) {
            issues.push({
                id: `${codes.GC_RELATIONSHIP_SOURCE_MISSING}_rel_${rel.id || index}`,
                severity: "error",
                code: codes.GC_RELATIONSHIP_SOURCE_MISSING,
                message: `Relationship '${rel.id || index}' is missing sourceId.`,
                objectId: rel.id || undefined,
                field: "sourceId",
            });
        }
        else if (!nodeIds.has(rel.sourceId)) {
            // Check unknown source node
            issues.push({
                id: `${codes.GC_RELATIONSHIP_SOURCE_UNKNOWN}_rel_${rel.id || index}`,
                severity: "error",
                code: codes.GC_RELATIONSHIP_SOURCE_UNKNOWN,
                message: `Relationship '${rel.id || index}' references unknown source node '${rel.sourceId}'.`,
                objectId: rel.id || undefined,
                field: "sourceId",
            });
        }
        // Check targetId missing
        if (!rel.targetId) {
            issues.push({
                id: `${codes.GC_RELATIONSHIP_TARGET_MISSING}_rel_${rel.id || index}`,
                severity: "error",
                code: codes.GC_RELATIONSHIP_TARGET_MISSING,
                message: `Relationship '${rel.id || index}' is missing targetId.`,
                objectId: rel.id || undefined,
                field: "targetId",
            });
        }
        else if (!nodeIds.has(rel.targetId)) {
            // Check unknown target node
            issues.push({
                id: `${codes.GC_RELATIONSHIP_TARGET_UNKNOWN}_rel_${rel.id || index}`,
                severity: "error",
                code: codes.GC_RELATIONSHIP_TARGET_UNKNOWN,
                message: `Relationship '${rel.id || index}' references unknown target node '${rel.targetId}'.`,
                objectId: rel.id || undefined,
                field: "targetId",
            });
        }
        // If schema validation failed, gather specific errors (e.g. invalid type/strength)
        if (!relResult.success) {
            relResult.error.issues.forEach((zodIssue, zIndex) => {
                const field = zodIssue.path.join(".");
                // Skip reporting missing id/sourceId/targetId here since we handled them with custom messages above
                if (field === "id" || field === "sourceId" || field === "targetId") {
                    return;
                }
                let code = codes.GC_METADATA_INVALID;
                let severity = "error";
                if (field === "type") {
                    code = codes.GC_RELATIONSHIP_INVALID_TYPE;
                }
                else if (field === "strength") {
                    code = codes.GC_RELATIONSHIP_INVALID_STRENGTH;
                }
                issues.push({
                    id: `${code}_rel_${rel.id || index}_${zIndex}`,
                    severity,
                    code,
                    message: `Relationship '${rel.id || index}' field '${field}' is invalid: ${zodIssue.message}`,
                    objectId: rel.id || undefined,
                    field,
                });
            });
        }
        // Check duplicate relationship content (sourceId + targetId + type)
        if (rel.sourceId && rel.targetId && rel.type) {
            const contentKey = `${rel.sourceId}_${rel.targetId}_${rel.type}`;
            if (relContents.has(contentKey)) {
                issues.push({
                    id: `${codes.GC_RELATIONSHIP_DUPLICATE}_rel_${rel.id || index}`,
                    severity: "error",
                    code: codes.GC_RELATIONSHIP_DUPLICATE,
                    message: `Duplicate relationship content: '${rel.sourceId}' -> '${rel.targetId}' via '${rel.type}'.`,
                    objectId: rel.id || undefined,
                });
            }
            else {
                relContents.add(contentKey);
            }
        }
    });
    // 4. Run cycle detection
    const cycleIssues = detectParentCycles(registry);
    issues.push(...cycleIssues);
    // 5. Run orphan detection
    const orphanIssues = detectOrphans(registry);
    issues.push(...orphanIssues);
    // 6. Calculate validity and publishability
    const hasErrorsOrCritical = issues.some((issue) => issue.severity === "error" || issue.severity === "critical");
    return {
        valid: !hasErrorsOrCritical,
        publishable: !hasErrorsOrCritical,
        issues,
        checkedAt,
    };
}
