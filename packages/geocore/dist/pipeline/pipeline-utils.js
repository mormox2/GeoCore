export function createValidationPipelineReportId(input) {
    const mode = input.mode ?? "public";
    const lang = input.language ? `-${input.language}` : "";
    return `report-${input.datasetId}-${mode}${lang}`;
}
export function summarizeValidationIssues(issues) {
    const summary = { info: 0, warnings: 0, errors: 0, critical: 0 };
    for (const issue of issues) {
        if (issue.severity === "info") {
            summary.info++;
        }
        else if (issue.severity === "warning") {
            summary.warnings++;
        }
        else if (issue.severity === "error") {
            summary.errors++;
        }
        else if (issue.severity === "critical") {
            summary.critical++;
        }
    }
    return summary;
}
export function hasBlockingIssues(issues) {
    return issues.some((i) => i.severity === "error" || i.severity === "critical");
}
export function isStagePublishable(issues) {
    return !hasBlockingIssues(issues);
}
export function isReportPublishable(stages) {
    return stages.every((s) => s.publishable);
}
export function isReportValid(stages) {
    return stages.every((s) => s.valid);
}
export function createValidationStageResult(input) {
    const issues = input.issues ?? [];
    const startedAt = input.startedAt ?? new Date().toISOString();
    const finishedAt = input.finishedAt ?? startedAt;
    const summary = summarizeValidationIssues(issues);
    let status = "passed";
    if (input.skipped) {
        status = "skipped";
    }
    if (summary.errors > 0 || summary.critical > 0) {
        status = "failed";
    }
    else if (!input.skipped && summary.warnings > 0) {
        status = "warning";
    }
    const valid = summary.errors === 0 && summary.critical === 0;
    const publishable = valid;
    return {
        id: input.id,
        status,
        valid,
        publishable,
        startedAt,
        finishedAt,
        issues,
        summary,
    };
}
