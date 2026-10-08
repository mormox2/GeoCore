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
export type GroundingOptions = {
    /** Minimum share of a claim's content words that must appear in the evidence (default 0.5). */
    claimSupportThreshold?: number;
};
/**
 * Evaluates whether an AI generated answer is grounded in the provided AiContextPackage.
 *
 * Every sentence of the answer is treated as a claim and must be supported by the evidence
 * (object, entities, citations, sources). A claim whose content words are mostly absent from
 * the evidence is reported in `unsupportedClaims`, and any unsupported claim prevents the
 * answer from being considered grounded.
 */
export declare function verifyAnswerGrounding(generatedText: string, context: AiContextPackage, options?: GroundingOptions): GroundingVerificationResult;
