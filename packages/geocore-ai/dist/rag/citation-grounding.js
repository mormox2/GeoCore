/**
 * Evaluates whether an AI generated answer is grounded in the provided AiContextPackage.
 */
export function verifyAnswerGrounding(generatedText, context) {
    const checkedAt = new Date().toISOString();
    const normalizedText = generatedText.toLowerCase();
    // 1. Match known sources
    const matchedSources = [];
    for (const src of context.sources) {
        if (normalizedText.includes(src.title.toLowerCase()) ||
            (src.publisher && normalizedText.includes(src.publisher.toLowerCase())) ||
            (src.authors && src.authors.some((a) => normalizedText.includes(a.toLowerCase())))) {
            matchedSources.push(src.id);
        }
    }
    // 2. Match known entities
    const matchedEntities = [];
    for (const ent of context.entities) {
        if (normalizedText.includes(ent.canonicalName.toLowerCase()) ||
            (ent.aliases && ent.aliases.some((a) => normalizedText.includes(a.toLowerCase())))) {
            matchedEntities.push(ent.id);
        }
    }
    // 3. Keyword / Key sentence overlap with main object body
    const bodySentences = context.object.body
        .split(/[.!?]+/)
        .map((s) => s.trim().toLowerCase())
        .filter((s) => s.length > 15);
    let overlappingSentences = 0;
    for (const sentence of bodySentences) {
        const words = sentence.split(/\s+/).filter((w) => w.length > 4);
        const matchCount = words.filter((w) => normalizedText.includes(w)).length;
        if (words.length > 0 && matchCount / words.length >= 0.5) {
            overlappingSentences++;
        }
    }
    const sentenceRatio = bodySentences.length > 0 ? overlappingSentences / bodySentences.length : 1;
    const entityRatio = context.entities.length > 0 ? matchedEntities.length / context.entities.length : 1;
    // Composite Grounding Score
    const score = Math.min(1.0, Math.max(0.0, 0.4 * sentenceRatio + 0.4 * entityRatio + 0.2 * (matchedSources.length > 0 ? 1 : 0.5)));
    let hallucinationRisk;
    if (score >= 0.6) {
        hallucinationRisk = "low";
    }
    else if (score >= 0.3) {
        hallucinationRisk = "medium";
    }
    else {
        hallucinationRisk = "high";
    }
    const isGrounded = hallucinationRisk !== "high";
    return {
        isGrounded,
        score: Math.round(score * 100) / 100,
        matchedSources,
        matchedEntities,
        unsupportedClaims: [],
        hallucinationRisk,
        checkedAt,
    };
}
