import { normalizeSearchText } from "./search-utils.js";

export type ExtractSearchTextInput = {
  title?: string;
  summary?: string;
  body?: string | Record<string, unknown>;
  entities?: string[];
  aliases?: string[];
  keywords?: string[];
};

/**
 * Extracts searchable text by concatenating title, summary, body, entities,
 * aliases, and keywords, and normalizing whitespace.
 */
export function extractSearchText(input: ExtractSearchTextInput): string {
  const parts: string[] = [];

  if (input.title !== undefined && input.title !== null) {
    parts.push(input.title);
  }

  if (input.summary !== undefined && input.summary !== null) {
    parts.push(input.summary);
  }

  if (input.body !== undefined && input.body !== null) {
    if (typeof input.body === "string") {
      parts.push(input.body);
    } else if (typeof input.body === "object") {
      try {
        parts.push(JSON.stringify(input.body));
      } catch (err) {
        // Fallback in case of circular references or serialization errors
        parts.push(String(input.body));
      }
    }
  }

  if (Array.isArray(input.entities)) {
    for (const ent of input.entities) {
      if (ent !== undefined && ent !== null) {
        parts.push(ent);
      }
    }
  }

  if (Array.isArray(input.aliases)) {
    for (const alias of input.aliases) {
      if (alias !== undefined && alias !== null) {
        parts.push(alias);
      }
    }
  }

  if (Array.isArray(input.keywords)) {
    for (const kw of input.keywords) {
      if (kw !== undefined && kw !== null) {
        parts.push(kw);
      }
    }
  }

  const concatenated = parts.join(" ");
  return normalizeSearchText(concatenated);
}
