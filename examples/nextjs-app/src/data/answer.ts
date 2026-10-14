import type { AiContextPackage } from "@mormo_mossaab/geocore";
import { getAiContext } from "@mormo_mossaab/geocore";
import {
  buildExtractiveAnswer,
  verifyAnswerGrounding,
  type GroundingVerificationResult,
} from "@mormo_mossaab/geocore-ai";
import {
  findGroundedAnswer,
  MemoryVectorStore,
  DeterministicEmbeddingProvider,
  type GroundedAnswer,
} from "@mormo_mossaab/geocore-vector";
import { appDataset } from "./dataset.js";

// Shared vector index for the chat route and the widget's answer route.
export const vectorStore = new MemoryVectorStore();
export const embeddingProvider = new DeterministicEmbeddingProvider(64);

export type ObjectAnswer = {
  answer: string;
  context: AiContextPackage;
  grounding: GroundingVerificationResult;
};

/** Answers from one known object, or null when nothing grounded can be extracted from it. */
export function answerFromObject(question: string, objectId: string): ObjectAnswer | null {
  const contextRes = getAiContext(appDataset, { objectId, visibility: "public" });
  if (contextRes.status !== "ok" || !contextRes.data) return null;

  const context = contextRes.data;
  const extracted = buildExtractiveAnswer(question || context.object.title, context);
  if (!extracted.answer) return null;

  const grounding = verifyAnswerGrounding(extracted.answer, context);
  return grounding.isGrounded ? { answer: extracted.answer, context, grounding } : null;
}

/** Finds and answers from the best published object (hybrid search + grounding check). */
export function answerQuestion(question: string, language?: string): Promise<GroundedAnswer | null> {
  return findGroundedAnswer(appDataset, question, { store: vectorStore, provider: embeddingProvider, language });
}
