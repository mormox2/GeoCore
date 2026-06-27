export function parseArgs(args) {
    const parsed = {
        flags: {},
        unknownArgs: [],
    };
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === "init" || arg === "validate" || arg === "export" || arg === "inspect" || arg === "help") {
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
