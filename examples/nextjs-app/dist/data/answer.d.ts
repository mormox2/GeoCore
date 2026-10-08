import type { AiContextPackage } from "@mormo_mossaab/geocore";
import { type GroundingVerificationResult } from "@mormo_mossaab/geocore-ai";
export type GroundedAnswer = {
    answer: string;
    context: AiContextPackage;
    grounding: GroundingVerificationResult;
    matchType?: "both" | "lexical-only" | "semantic-only";
    combinedScore?: number;
};
/** Answers from one known object, or null when nothing in it relates to the question. */
export declare function answerFromObject(question: string, objectId: string): GroundedAnswer | null;
/**
 * Finds the best published object for a question with hybrid search and answers with
 * sentences extracted from it. Returns null rather than guessing when nothing relevant
 * and grounded is found.
 */
export declare function answerQuestion(question: string, language?: string): Promise<GroundedAnswer | null>;
