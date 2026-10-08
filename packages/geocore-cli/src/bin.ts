#!/usr/bin/env node
import { runCli } from "./cli.js";

runCli(process.argv.slice(2)).then((code) => {
  // Set the exit code instead of exiting so long-running commands (serve, studio)
  // keep their HTTP servers alive; one-shot commands exit once the event loop drains.
  process.exitCode = code;
});
