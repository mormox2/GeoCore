import type { AiContextPackage } from "@mormo_mossaab/geocore";
import { contentTokens, normalizeText } from "./text-tokens.js";

export type GroundingVerificationResult = {
  isGrounded: boolean;
  score: number; // 0.0 - 1.0
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

function splitClaims(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => contentTokens(s).length > 0);
}

function includesPhrase(normalizedText: string, phrase: string | undefined): boolean {
  if (!phrase) return false;
  const p = normalizeText(phrase).trim();
  return p.length > 0 && normalizedText.includes(p);
}

/**
 * Evaluates whether an AI generated answer is grounded in the provided AiContextPackage.
 *
 * Every sentence of the answer is treated as a claim and must be supported by the evidence
 * (object, entities, citations, sources). A claim whose content words are mostly absent from
 * the evidence is reported in `unsupportedClaims`, and any unsupported claim prevents the
 * answer from being considered grounded.
 */
export function verifyAnswerGrounding(
  generatedText: string,
  context: AiContextPackage,
  options: GroundingOptions = {}
): GroundingVerificationResult {
  const checkedAt = new Date().toISOString();
  const threshold = options.claimSupportThreshold ?? 0.5;
  const normalizedText = normalizeText(generatedText);

  // 1. Match known sources
  const matchedSources = context.sources
    .filter(
      (src) =>
        includesPhrase(normalizedText, src.title) ||
        includesPhrase(normalizedText, src.publisher) ||
        (src.authors ?? []).some((a: string) => includesPhrase(normalizedText, a))
    )
    .map((src) => src.id);

  // 2. Match known entities
  const matchedEntities = context.entities
    .filter(
      (ent) =>
        includesPhrase(normalizedText, ent.canonicalName) ||
        (ent.aliases ?? []).some((a: string) => includesPhrase(normalizedText, a))
    )
    .map((ent) => ent.id);

  // 3. Build the evidence vocabulary from everything the context certifies
  const evidenceTexts: string[] = [
    context.object.title,
    context.object.summary,
    context.object.body,
    ...context.entities.flatMap((e) => [e.canonicalName, e.definition, ...(e.aliases ?? [])]),
    ...context.citations.flatMap((c) => [c.quote ?? "", c.paraphrase ?? ""]),
    ...context.sources.flatMap((s) => [s.title, s.publisher ?? "", ...(s.authors ?? [])]),
  ];
  const evidence = new Set(evidenceTexts.flatMap((t) => (t ? contentTokens(t) : [])));

  // 4. Check every claim of the answer against the evidence
  const claims = splitClaims(generatedText);
  const unsupportedClaims = claims.filter((claim) => {
    const tokens = contentTokens(claim);
    const supported = tokens.filter((t) => evidence.has(t)).length;
    return supported / tokens.length < threshold;
  });

  const supportRatio = claims.length > 0 ? (claims.length - unsupportedClaims.length) / claims.length : 0;
  const entityRatio =
    context.entities.length > 0 ? matchedEntities.length / context.entities.length : supportRatio;

  const score = Math.min(1.0, Math.max(0.0, 0.8 * supportRatio + 0.2 * entityRatio));

  let hallucinationRisk: "low" | "medium" | "high";
  if (supportRatio < 0.5 || score < 0.3) {
    hallucinationRisk = "high";
  } else if (unsupportedClaims.length > 0 || score < 0.6) {
    hallucinationRisk = "medium";
  } else {
    hallucinationRisk = "low";
  }

  return {
    isGrounded: hallucinationRisk !== "high" && unsupportedClaims.length === 0,
    score: Math.round(score * 100) / 100,
    matchedSources,
    matchedEntities,
    unsupportedClaims,
    hallucinationRisk,
    checkedAt,
  };
}
