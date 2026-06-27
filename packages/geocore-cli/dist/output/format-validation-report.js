import { green, red, yellow } from "./terminal-colors.js";
export function formatValidationReport(report) {
    const lines = [];
    lines.push("GeoCore Validation Report");
    lines.push("");
    lines.push(`Mode: ${report.mode}`);
    lines.push(`Valid: ${report.valid ? "yes" : "no"}`);
    lines.push(`Publishable: ${report.publishable ? "yes" : "no"}`);
    lines.push("");
    lines.push("Stages:");
    for (const stage of report.stages) {
        let statusStr = stage.status;
        if (stage.status === "passed") {
            statusStr = green("passed");
        }
        else if (stage.status === "warning") {
            statusStr = yellow("warning");
        }
        else if (stage.status === "failed") {
            statusStr = red("failed");
        }
        else if (stage.status === "skipped") {
            statusStr = "skipped";
        }
        lines.push(`- ${stage.id}: ${statusStr}`);
    }
    lines.push("");
    if (report.issues && report.issues.length > 0) {
        lines.push("Issues:");
        for (const issue of report.issues) {
            let sevStr = issue.severity;
            if (issue.severity === "critical" || issue.severity === "error") {
                sevStr = red(issue.severity);
            }
            else if (issue.severity === "warning") {
                sevStr = yellow(issue.severity);
            }
            lines.push(`[${sevStr}] ${issue.code} — ${issue.message}`);
        }
    }
    return lines.join("\n");
}
