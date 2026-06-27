export type CliErrorCode = "CONFIG_ERROR" | "COMMAND_ERROR" | "FILESYSTEM_ERROR" | "VALIDATION_FAILED";
export declare class CliError extends Error {
    code: CliErrorCode;
    exitCode: number;
    constructor(code: CliErrorCode, message: string);
}
