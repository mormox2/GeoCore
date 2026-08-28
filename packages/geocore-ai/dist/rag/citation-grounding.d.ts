import type { AiContextPackage } from "@mormo_mossaab/geocore";
export type GroundingVerificationResult = {
    isGrounded: boolean;
    score: number;
    matchedSources: string[];
    matchedEntities: string[];
    unsupportedClaims: string[];
    hallucinationRisk: "low" | "medium" | "high";
    checkedAt: string;
};
/**
 * Evaluates whether an AI generated answer is grounded in the provided AiContextPackage.
 */
export declare function verifyAnswerGrounding(generatedText: string, context: AiContextPackage): GroundingVerificationResult;
