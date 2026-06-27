import { validationPipelineReportSchema } from "../schemas/validation-report.schema.js";
import * as codes from "../validation/validation-codes.js";
export function validatePipelineReport(report) {
    const checkedAt = new Date().toISOString();
    const issues = [];
    if (!report || typeof report !== "object") {
        return {
            valid: false,
            publishable: false,
            checkedAt,
            issues: [
                {
                    id: `${codes.GC_PIPELINE_REPORT_ID_MISSING}_ROOT`,
                    severity: "critical",
                    code: codes.GC_PIPELINE_REPORT_ID_MISSING,
                    message: "ValidationPipelineReport must be a non-null object",
                },
            ],
        };
    }
    // 1. Zod validation
    const parsed = validationPipelineReportSchema.safeParse(report);
    if (!parsed.success) {
        parsed.error.issues.forEach((zodIssue, index) => {
            const field = zodIssue.path.join(".");
            let code = codes.GC_PIPELINE_SUMMARY_INVALID;
            let severity = "error";
            if (field === "id") {
                code = codes.GC_PIPELINE_REPORT_ID_MISSING;
                severity = "critical";
            }
            else if (field === "mode") {
                code = codes.GC_PIPELINE_MODE_INVALID;
            }
            else if (field === "startedAt") {
                code = codes.GC_PIPELINE_STARTED_AT_MISSING;
            }
            else if (field === "finishedAt") {
                code = codes.GC_PIPELINE_FINISHED_AT_MISSING;
            }
            else if (field === "stages") {
                code = codes.GC_PIPELINE_STAGES_INVALID;
            }
            else if (field === "issues") {
                code = codes.GC_PIPELINE_ISSUES_INVALID;
            }
            else if (field.startsWith("stages.")) {
                const parts = zodIssue.path;
                const subField = parts[parts.length - 1];
                if (subField === "id") {
                    code = codes.GC_PIPELINE_STAGE_ID_INVALID;
                }
                else if (subField === "status") {
                    code = codes.GC_PIPELINE_STAGE_STATUS_INVALID;
                }
                else if (subField === "startedAt") {
                    code = codes.GC_PIPELINE_STAGE_STARTED_AT_MISSING;
                }
                else if (subField === "finishedAt") {
                    code = codes.GC_PIPELINE_STAGE_FINISHED_AT_MISSING;
                }
                else if (subField === "issues") {
                    code = codes.GC_PIPELINE_STAGE_ISSUES_INVALID;
                }
                else {
                    code = codes.GC_PIPELINE_STAGES_INVALID;
                }
            }
            issues.push({
                id: `zod_${code}_${field || "field"}_${index}`,
                severity,
                code,
                message: `Report field '${field}' is invalid: ${zodIssue.message}`,
                field: field || undefined,
            });
        });
    }
    // 2. Custom consistency checks
    if (report.stages && Array.isArray(report.stages)) {
        const validStageIds = new Set([
            "dataset",
            "knowledge-objects",
            "relationships",
            "metadata",
            "routes",
            "search",
            "schema",
            "llms",
            "sitemap",
            "static-export",
        ]);
        const defaultRequired = new Set([
            "dataset",
            "knowledge-objects",
            "relationships",
            "metadata",
        ]);
        let sumInfo = 0;
        let sumWarnings = 0;
        let sumErrors = 0;
        let sumCritical = 0;
        let cntPassed = 0;
        let cntWarning = 0;
        let cntFailed = 0;
        let cntSkipped = 0;
        report.stages.forEach((stage, idx) => {
            if (!stage || typeof stage !== "object")
                return;
            // Validate ID
            if (!stage.id || !validStageIds.has(stage.id)) {
                issues.push({
                    id: `${codes.GC_PIPELINE_STAGE_ID_INVALID}_stage_${idx}`,
                    severity: "error",
                    code: codes.GC_PIPELINE_STAGE_ID_INVALID,
                    message: `Stage ID '${stage.id}' is invalid.`,
                    field: `stages[${idx}].id`,
                });
            }
            // Validate status
            const validStatuses = new Set(["pending", "passed", "warning", "failed", "skipped"]);
            if (!stage.status || !validStatuses.has(stage.status)) {
                issues.push({
                    id: `${codes.GC_PIPELINE_STAGE_STATUS_INVALID}_stage_${idx}`,
                    severity: "error",
                    code: codes.GC_PIPELINE_STAGE_STATUS_INVALID,
                    message: `Stage status '${stage.status}' is invalid.`,
                    field: `stages[${idx}].status`,
                });
            }
            // Required stage skipped check
            if (defaultRequired.has(stage.id) && stage.status === "skipped") {
                issues.push({
                    id: `${codes.GC_PIPELINE_STAGE_REQUIRED_SKIPPED}_${stage.id}`,
                    severity: "error",
                    code: codes.GC_PIPELINE_STAGE_REQUIRED_SKIPPED,
                    message: `Required stage '${stage.id}' was skipped.`,
                    field: `stages[${idx}].status`,
                });
            }
            // Sum counts
            if (stage.summary) {
                sumInfo += stage.summary.info ?? 0;
                sumWarnings += stage.summary.warnings ?? 0;
                sumErrors += stage.summary.errors ?? 0;
                sumCritical += stage.summary.critical ?? 0;
            }
            if (stage.status === "passed")
                cntPassed++;
            else if (stage.status === "warning")
                cntWarning++;
            else if (stage.status === "failed")
                cntFailed++;
            else if (stage.status === "skipped")
                cntSkipped++;
        });
        // Check summary consistency
        if (report.summary) {
            if (report.summary.stagesTotal !== report.stages.length) {
                issues.push({
                    id: `${codes.GC_PIPELINE_SUMMARY_INVALID}_stagesTotal`,
                    severity: "error",
                    code: codes.GC_PIPELINE_SUMMARY_INVALID,
                    message: `summary.stagesTotal (${report.summary.stagesTotal}) does not match stages count (${report.stages.length}).`,
                    field: "summary.stagesTotal",
                });
            }
            if (report.summary.stagesPassed !== cntPassed) {
                issues.push({
                    id: `${codes.GC_PIPELINE_SUMMARY_INVALID}_stagesPassed`,
                    severity: "error",
                    code: codes.GC_PIPELINE_SUMMARY_INVALID,
                    message: `summary.stagesPassed (${report.summary.stagesPassed}) does not match passed count (${cntPassed}).`,
                    field: "summary.stagesPassed",
                });
            }
            if (report.summary.stagesWarning !== cntWarning) {
                issues.push({
                    id: `${codes.GC_PIPELINE_SUMMARY_INVALID}_stagesWarning`,
                    severity: "error",
                    code: codes.GC_PIPELINE_SUMMARY_INVALID,
                    message: `summary.stagesWarning (${report.summary.stagesWarning}) does not match warning count (${cntWarning}).`,
                    field: "summary.stagesWarning",
                });
            }
            if (report.summary.stagesFailed !== cntFailed) {
                issues.push({
                    id: `${codes.GC_PIPELINE_SUMMARY_INVALID}_stagesFailed`,
                    severity: "error",
                    code: codes.GC_PIPELINE_SUMMARY_INVALID,
                    message: `summary.stagesFailed (${report.summary.stagesFailed}) does not match failed count (${cntFailed}).`,
                    field: "summary.stagesFailed",
                });
            }
            if (report.summary.stagesSkipped !== cntSkipped) {
                issues.push({
                    id: `${codes.GC_PIPELINE_SUMMARY_INVALID}_stagesSkipped`,
                    severity: "error",
                    code: codes.GC_PIPELINE_SUMMARY_INVALID,
                    message: `summary.stagesSkipped (${report.summary.stagesSkipped}) does not match skipped count (${cntSkipped}).`,
                    field: "summary.stagesSkipped",
                });
            }
            // Check issue counts consistency
            if (report.summary.info !== sumInfo) {
                issues.push({
                    id: `${codes.GC_PIPELINE_SUMMARY_INVALID}_info`,
                    severity: "error",
                    code: codes.GC_PIPELINE_SUMMARY_INVALID,
                    message: `summary.info (${report.summary.info}) does not match total stage info issues (${sumInfo}).`,
                    field: "summary.info",
                });
            }
            if (report.summary.warnings !== sumWarnings) {
                issues.push({
                    id: `${codes.GC_PIPELINE_SUMMARY_INVALID}_warnings`,
                    severity: "error",
                    code: codes.GC_PIPELINE_SUMMARY_INVALID,
                    message: `summary.warnings (${report.summary.warnings}) does not match total stage warning issues (${sumWarnings}).`,
                    field: "summary.warnings",
                });
            }
            if (report.summary.errors !== sumErrors) {
                issues.push({
                    id: `${codes.GC_PIPELINE_SUMMARY_INVALID}_errors`,
                    severity: "error",
                    code: codes.GC_PIPELINE_SUMMARY_INVALID,
                    message: `summary.errors (${report.summary.errors}) does not match total stage error issues (${sumErrors}).`,
                    field: "summary.errors",
                });
            }
            if (report.summary.critical !== sumCritical) {
                issues.push({
                    id: `${codes.GC_PIPELINE_SUMMARY_INVALID}_critical`,
                    severity: "error",
                    code: codes.GC_PIPELINE_SUMMARY_INVALID,
                    message: `summary.critical (${report.summary.critical}) does not match total stage critical issues (${sumCritical}).`,
                    field: "summary.critical",
                });
            }
        }
    }
    const hasErrorsOrCritical = issues.some((issue) => issue.severity === "error" || issue.severity === "critical");
    return {
        valid: !hasErrorsOrCritical,
        publishable: !hasErrorsOrCritical,
        issues,
        checkedAt,
    };
}
