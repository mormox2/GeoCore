/**
 * Shared, dependency-free tokenisation used by grounding checks and extractive answers.
 */

// Function words carry no factual content and must not count as evidence overlap.
const STOPWORDS = new Set([
  // fr
  "alors", "aussi", "autre", "autres", "avec", "avoir", "ailleurs", "cela", "celle", "celles", "celui",
  "cette", "ceux", "chaque", "comme", "dans", "depuis", "donc", "elle", "elles", "encore", "entre",
  "etre", "etait", "leur", "leurs", "lorsqu", "lorsque", "mais", "meme", "moins", "nous", "notre",
  "parce", "pendant", "peut", "plus", "pour", "pourquoi", "quand", "quel", "quelle", "quels",
  "quelles", "selon", "sans", "sera", "sont", "sous", "tous", "tout", "toute", "toutes", "tres",
  "votre", "vous", "puisqu", "puisque", "comment", "combien", "faut",
  // en
  "about", "also", "been", "being", "does", "from", "have", "into", "more", "most", "only",
  "other", "over", "some", "such", "than", "that", "their", "them", "then", "there", "these",
  "they", "this", "those", "very", "were", "what", "when", "where", "which", "while", "with",
  "would", "your",
]);

/** Lower-cases and strips diacritics so "détartrage" and "detartrage" compare equal. */
export function normalizeText(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function stem(token: string): string {
  return token.replace(/(es|s|x)$/, "").replace(/e$/, "");
}

/** Returns stemmed content words (4+ letters, stopwords removed). */
export function contentTokens(text: string): string[] {
  return normalizeText(text)
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 4 && !STOPWORDS.has(t))
    .map(stem);
}
