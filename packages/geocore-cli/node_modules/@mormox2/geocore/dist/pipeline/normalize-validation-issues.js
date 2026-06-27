export function normalizeValidationIssues(issues, context) {
    return issues.map((issue) => {
        const normalized = { ...issue };
        if (context?.stageId && !normalized.id.startsWith(context.stageId)) {
            normalized.id = `${context.stageId}_${normalized.id}`;
        }
        if (context?.sourceId && !normalized.objectId) {
            normalized.objectId = context.sourceId;
        }
        return normalized;
    });
}
