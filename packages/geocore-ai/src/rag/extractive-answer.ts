import type { AiContextPackage } from "@mormo_mossaab/geocore";
import { contentTokens } from "./text-tokens.js";

export type ExtractiveAnswerOptions = {
  /** Maximum answer length in characters (default 600). Whole sentences are never cut. */
  maxLength?: number;
};

export type ExtractiveAnswer = {
  /** Sentences copied verbatim from the certified knowledge object, in document order. */
  answer: string;
  /** Number of distinct query terms found in the knowledge object (0 means unrelated). */
  matchedQueryTerms: number;
};

/** Converts Markdown to plain prose: drops headings, list markers, emphasis and link targets. */
export function markdownToPlainText(markdown: string): string {
  return markdown
    .split("\n")
    .filter((line) => !/^\s*#/.test(line))
    .map((line) => line.replace(/^\s*(?:[-*+]|\d+\.)\s+/, ""))
    .join("\n")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * Builds an answer by selecting sentences of the certified knowledge object that best match
 * the query. Nothing is generated: every sentence comes from the object body (or its summary
 * when the body is empty), so the answer can always be verified with verifyAnswerGrounding.
 */
export function buildExtractiveAnswer(
  query: string,
  context: AiContextPackage,
  options: ExtractiveAnswerOptions = {}
): ExtractiveAnswer {
  const maxLength = options.maxLength ?? 600;
  const queryTerms = new Set(contentTokens(query));

  const objectTerms = new Set(
    contentTokens(
      [
        context.object.title,
        context.object.summary,
        context.object.body,
        ...context.entities.flatMap((e) => [e.canonicalName, ...(e.aliases ?? [])]),
      ].join(" ")
    )
  );
  const matchedQueryTerms = [...queryTerms].filter((t) => objectTerms.has(t)).length;

  const text = markdownToPlainText(context.object.body) || context.object.summary.trim();
  const sentences = splitSentences(text);

  const scored = sentences.map((sentence, index) => ({
    sentence,
    index,
    score: new Set(contentTokens(sentence).filter((t) => queryTerms.has(t))).size,
  }));

  // Prefer the most relevant sentences; fall back to document order when nothing overlaps.
  const ranked = scored.some((s) => s.score > 0)
    ? [...scored].sort((a, b) => b.score - a.score || a.index - b.index)
    : scored;

  const selected: typeof scored = [];
  let length = 0;
  for (const item of ranked) {
    const added = item.sentence.length + (selected.length > 0 ? 1 : 0);
    if (selected.length > 0 && length + added > maxLength) continue;
    selected.push(item);
    length += added;
  }

  const answer = selected
    .sort((a, b) => a.index - b.index)
    .map((s) => s.sentence)
    .join(" ");

  return { answer, matchedQueryTerms };
}
