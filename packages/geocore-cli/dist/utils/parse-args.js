export function parseArgs(args) {
    const parsed = {
        flags: {},
        unknownArgs: [],
    };
    const VALID_COMMANDS = new Set(["init", "validate", "export", "inspect", "serve", "vectorize", "studio", "help"]);
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (VALID_COMMANDS.has(arg)) {
            if (!parsed.command) {
                parsed.command = arg;
            }
            else {
                parsed.unknownArgs.push(arg);
            }
        }
        else if (arg === "--config") {
            parsed.flags.config = args[++i];
        }
        else if (arg === "--knowledge-dir") {
            parsed.flags.knowledgeDir = args[++i];
        }
        else if (arg === "--output-dir") {
            parsed.flags.outputDir = args[++i];
        }
        else if (arg === "--site-url") {
            parsed.flags.siteUrl = args[++i];
        }
        else if (arg === "--language") {
            parsed.flags.language = args[++i];
        }
        else if (arg === "--port") {
            const portVal = parseInt(args[++i], 10);
            if (!isNaN(portVal))
                parsed.flags.port = portVal;
        }
        else if (arg === "--host") {
            parsed.flags.host = args[++i];
        }
        else if (arg === "--dim" || arg === "--dimension") {
            const dimVal = parseInt(args[++i], 10);
            if (!isNaN(dimVal))
                parsed.flags.dim = dimVal;
        }
        else if (arg === "--api-key") {
            parsed.flags.apiKey = args[++i];
        }
        else if (arg === "--mode") {
            const modeVal = args[++i];
            if (modeVal === "public" || modeVal === "internal") {
                parsed.flags.mode = modeVal;
            }
        }
        else if (arg === "--json") {
            parsed.flags.json = true;
        }
        else if (arg === "--force") {
            parsed.flags.force = true;
        }
        else if (arg === "--fail-fast") {
            parsed.flags.failFast = true;
        }
        else if (arg === "--help" || arg === "-h") {
            parsed.flags.help = true;
        }
        else {
            parsed.unknownArgs.push(arg);
        }
    }
    return parsed;
}
