import { EXIT_CODES } from "./exit-codes.js";

export type CliErrorCode =
  | "CONFIG_ERROR"
  | "COMMAND_ERROR"
  | "FILESYSTEM_ERROR"
  | "VALIDATION_FAILED";

export class CliError extends Error {
  public code: CliErrorCode;
  public exitCode: number;

  constructor(code: CliErrorCode, message: string) {
    super(message);
    this.name = "CliError";
    this.code = code;

    switch (code) {
      case "VALIDATION_FAILED":
        this.exitCode = EXIT_CODES.VALIDATION_FAILED;
        break;
      case "COMMAND_ERROR":
        this.exitCode = EXIT_CODES.COMMAND_ERROR;
        break;
      case "CONFIG_ERROR":
        this.exitCode = EXIT_CODES.CONFIG_ERROR;
        break;
      case "FILESYSTEM_ERROR":
        this.exitCode = EXIT_CODES.FILESYSTEM_ERROR;
        break;
      default:
        this.exitCode = EXIT_CODES.COMMAND_ERROR;
    }
  }
}
