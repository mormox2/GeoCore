#!/usr/bin/env node
import { runCli } from "./cli.js";
export { runCli };
export { initCommand } from "./commands/init.command.js";
export { validateCommand } from "./commands/validate.command.js";
export { exportCommand } from "./commands/export.command.js";
export { inspectCommand } from "./commands/inspect.command.js";
export { loadConfig } from "./config/load-config.js";
export { DEFAULT_CONFIG } from "./config/default-config.js";
export { discoverKnowledgeFiles } from "./fs/discover-files.js";
export { readKnowledgeFiles } from "./fs/read-knowledge-files.js";
export { writeExportBundle } from "./fs/write-export-bundle.js";
export { formatValidationReport } from "./output/format-validation-report.js";
export { formatExportSummary } from "./output/format-export-summary.js";
export { formatInspectOutput } from "./output/format-inspect-output.js";
export { EXIT_CODES } from "./utils/exit-codes.js";
export { CliError } from "./utils/cli-error.js";
export { parseArgs } from "./utils/parse-args.js";
if (process.argv[1] && (process.argv[1].includes("index.js") || process.argv[1].includes("geocore"))) {
    runCli(process.argv.slice(2)).then((code) => {
        process.exit(code);
    });
}
