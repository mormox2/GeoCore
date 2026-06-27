import { parseArgs } from "./utils/parse-args.js";
import { EXIT_CODES } from "./utils/exit-codes.js";
import { CliError } from "./utils/cli-error.js";
import { initCommand } from "./commands/init.command.js";
import { validateCommand } from "./commands/validate.command.js";
import { exportCommand } from "./commands/export.command.js";
import { inspectCommand } from "./commands/inspect.command.js";
const HELP_TEXT = `GeoCore CLI

Usage:
  geocore init
  geocore validate
  geocore export
  geocore inspect

Options:
  --config <path>
  --knowledge-dir <path>
  --output-dir <path>
  --language <language>
  --mode public|internal
  --json
  --force
  --help`;
export async function runCli(argv) {
    const parsed = parseArgs(argv);
    if (parsed.flags.help || parsed.command === "help" || (argv.length === 1 && (argv[0] === "--help" || argv[0] === "-h"))) {
        console.log(HELP_TEXT);
        return EXIT_CODES.SUCCESS;
    }
    try {
        if (parsed.unknownArgs.length > 0 && !parsed.command) {
            throw new CliError("COMMAND_ERROR", `Unknown command or flag: ${parsed.unknownArgs[0]}`);
        }
        if (!parsed.command) {
            console.log(HELP_TEXT);
            return EXIT_CODES.SUCCESS;
        }
        if (parsed.command === "init") {
            await initCommand({ force: parsed.flags.force });
        }
        else if (parsed.command === "validate") {
            await validateCommand({
                config: parsed.flags.config,
                knowledgeDir: parsed.flags.knowledgeDir,
                mode: parsed.flags.mode,
                language: parsed.flags.language,
                failFast: parsed.flags.failFast,
                json: parsed.flags.json,
            });
        }
        else if (parsed.command === "export") {
            await exportCommand({
                config: parsed.flags.config,
                knowledgeDir: parsed.flags.knowledgeDir,
                outputDir: parsed.flags.outputDir,
                siteUrl: parsed.flags.siteUrl,
                language: parsed.flags.language,
                mode: parsed.flags.mode,
                force: parsed.flags.force,
                json: parsed.flags.json,
            });
        }
        else if (parsed.command === "inspect") {
            await inspectCommand({
                config: parsed.flags.config,
                knowledgeDir: parsed.flags.knowledgeDir,
                json: parsed.flags.json,
            });
        }
        else {
            throw new CliError("COMMAND_ERROR", `Unknown command: ${parsed.command}`);
        }
        return EXIT_CODES.SUCCESS;
    }
    catch (err) {
        if (err instanceof CliError) {
            console.error(`Error: ${err.message}`);
            return err.exitCode;
        }
        else {
            console.error(`Unexpected Error: ${err.message || String(err)}`);
            return EXIT_CODES.COMMAND_ERROR;
        }
    }
}
