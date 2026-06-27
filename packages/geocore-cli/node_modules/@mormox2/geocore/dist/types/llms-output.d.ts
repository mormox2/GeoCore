import { LlmsDiagnostic } from "./llms-diagnostic.js";
export type LlmsOutputType = "llms.txt" | "llms-full.txt";
export type LlmsOutput = {
    id: string;
    type: LlmsOutputType;
    siteName: string;
    language?: string;
    content: string;
    sourceObjectIds: string[];
    generatedAt: string;
    diagnostics: LlmsDiagnostic[];
};
