import { parseArgs } from "./utils/parse-args.js";
import { EXIT_CODES } from "./utils/exit-codes.js";
import { CliError } from "./utils/cli-error.js";
import { initCommand } from "./commands/init.command.js";
import { validateCommand } from "./commands/validate.command.js";
import { exportCommand } from "./commands/export.command.js";
import { inspectCommand } from "./commands/inspect.command.js";
import { serveCommand } from "./commands/serve.command.js";
import { vectorizeCommand } from "./commands/vectorize.command.js";
import { studioCommand } from "./commands/studio.command.js";

const HELP_TEXT = `GeoCore CLI — AI-Native Knowledge Operating System

Usage:
  geocore init                          Initialize a new knowledge repository
  geocore validate                      Run 10-stage validation pipeline
  geocore export                        Generate static markdown, schema, sitemap & llms.txt
  geocore inspect                       Inspect graph connectivity, orphans & metrics
  geocore serve                         Start standalone HTTP REST API server with OpenAPI & hybrid search
  geocore vectorize                     Index repository into dense semantic vectors
  geocore studio                        Launch interactive Visual Studio web interface

Options:
  --config <path>                       Path to geocore.config.json
  --knowledge-dir <path>                Path to markdown knowledge objects directory
  --output-dir <path>                   Path to static export directory
  --site-url <url>                      Canonical base URL for routing & SEO
  --language <lang>                     Language code filter (e.g. fr, en, ar)
  --mode <public|internal>              Validation & export visibility mode
  --port <number>                       Port for serve (default: 3000) or studio (default: 4200)
  --host <string>                       Host for serve or studio (default: 0.0.0.0 or 127.0.0.1)
  --dim <number>                        Embedding dimension for vectorize (default: 64)
  --api-key <key>                       API key for authentication or OpenAI embeddings
  --json                                Output results in structured JSON format
  --force                               Force export/overwrite even if warnings exist
  --fail-fast                           Stop validation pipeline at first error
  --help, -h                            Show this help message`;

export async function runCli(argv: string[]): Promise<number> {
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
    } else if (parsed.command === "validate") {
      await validateCommand({
        config: parsed.flags.config,
        knowledgeDir: parsed.flags.knowledgeDir,
        mode: parsed.flags.mode,
        language: parsed.flags.language,
        failFast: parsed.flags.failFast,
        json: parsed.flags.json,
      });
    } else if (parsed.command === "export") {
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
    } else if (parsed.command === "inspect") {
      await inspectCommand({
        config: parsed.flags.config,
        knowledgeDir: parsed.flags.knowledgeDir,
        json: parsed.flags.json,
      });
    } else if (parsed.command === "serve") {
      await serveCommand({
        config: parsed.flags.config,
        knowledgeDir: parsed.flags.knowledgeDir,
        port: parsed.flags.port,
        host: parsed.flags.host,
        siteUrl: parsed.flags.siteUrl,
        apiKey: parsed.flags.apiKey,
        json: parsed.flags.json,
      });
    } else if (parsed.command === "vectorize") {
      await vectorizeCommand({
        config: parsed.flags.config,
        knowledgeDir: parsed.flags.knowledgeDir,
        dim: parsed.flags.dim,
        apiKey: parsed.flags.apiKey,
        json: parsed.flags.json,
      });
    } else if (parsed.command === "studio") {
      await studioCommand({
        port: parsed.flags.port,
        host: parsed.flags.host,
        json: parsed.flags.json,
      });
    } else {
      throw new CliError("COMMAND_ERROR", `Unknown command: ${parsed.command}`);
    }

    return EXIT_CODES.SUCCESS;
  } catch (err: any) {
    if (err instanceof CliError) {
      console.error(`Error: ${err.message}`);
      return err.exitCode;
    } else {
      console.error(`Unexpected Error: ${err.message || String(err)}`);
      return EXIT_CODES.COMMAND_ERROR;
    }
  }
}
