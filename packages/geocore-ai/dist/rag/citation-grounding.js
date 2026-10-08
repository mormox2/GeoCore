// Function words carry no factual content and must not count as evidence overlap.
const STOPWORDS = new Set([
    // fr
    "alors", "aussi", "autre", "autres", "avec", "avoir", "ailleurs", "cela", "celle", "celles", "celui",
    "cette", "ceux", "chaque", "comme", "dans", "depuis", "donc", "elle", "elles", "encore", "entre",
    "etre", "etait", "leur", "leurs", "lorsqu", "lorsque", "mais", "meme", "moins", "nous", "notre",
    "parce", "pendant", "peut", "plus", "pour", "pourquoi", "quand", "quel", "quelle", "quels",
    "quelles", "selon", "sans", "sera", "sont", "sous", "tous", "tout", "toute", "toutes", "tres",
    "votre", "vous", "puisqu", "puisque",
    // en
    "about", "also", "been", "being", "does", "from", "have", "into", "more", "most", "only",
    "other", "over", "some", "such", "than", "that", "their", "them", "then", "there", "these",
    "they", "this", "those", "very", "were", "what", "when", "where", "which", "while", "with",
    "would", "your",
]);
function normalize(text) {
    return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}
function stem(token) {
    return token.replace(/(es|s|x)$/, "").replace(/e$/, "");
}
function contentTokens(text) {
    return normalize(text)
        .split(/[^a-z0-9]+/)
        .filter((t) => t.length >= 4 && !STOPWORDS.has(t))
        .map(stem);
}
function splitClaims(text) {
    return text
        .split(/(?<=[.!?])\s+|\n+/)
        .map((s) => s.trim())
        .filter((s) => contentTokens(s).length > 0);
}
function includesPhrase(normalizedText, phrase) {
    if (!phrase)
        return false;
    const p = normalize(phrase).trim();
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
export function verifyAnswerGrounding(generatedText, context, options = {}) {
    const checkedAt = new Date().toISOString();
    const threshold = options.claimSupportThreshold ?? 0.5;
    const normalizedText = normalize(generatedText);
    // 1. Match known sources
    const matchedSources = context.sources
        .filter((src) => includesPhrase(normalizedText, src.title) ||
        includesPhrase(normalizedText, src.publisher) ||
        (src.authors ?? []).some((a) => includesPhrase(normalizedText, a)))
        .map((src) => src.id);
    // 2. Match known entities
    const matchedEntities = context.entities
        .filter((ent) => includesPhrase(normalizedText, ent.canonicalName) ||
        (ent.aliases ?? []).some((a) => includesPhrase(normalizedText, a)))
        .map((ent) => ent.id);
    // 3. Build the evidence vocabulary from everything the context certifies
    const evidenceTexts = [
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
    const entityRatio = context.entities.length > 0 ? matchedEntities.length / context.entities.length : supportRatio;
    const score = Math.min(1.0, Math.max(0.0, 0.8 * supportRatio + 0.2 * entityRatio));
    let hallucinationRisk;
    if (supportRatio < 0.5 || score < 0.3) {
        hallucinationRisk = "high";
    }
    else if (unsupportedClaims.length > 0 || score < 0.6) {
        hallucinationRisk = "medium";
    }
    else {
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
