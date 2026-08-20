/**
 * Builds a structured Markdown context string optimized for LLM prompting
 * from an AiContextPackage.
 */
export function buildPromptContext(contextPackage, options = {}) {
    const { includeSystemPreamble = true, includeCitations = true, includeEntities = true, includeTechnicalMeta = false, } = options;
    const { object, metadata, entities, citations, sources } = contextPackage;
    const sections = [];
    // 1. System Preamble
    if (includeSystemPreamble) {
        sections.push("### Knowledge Context Preamble\n" +
            "You are an authoritative AI assistant powered by GeoCore. " +
            "Base your responses strictly on the verified knowledge context provided below. " +
            "Do not extrapolate or speculate beyond the verified sources.");
    }
    // 2. Main Knowledge Object
    const mainObjectSection = [
        `### Knowledge Object: ${object.title}`,
        `- **ID**: ${object.id}`,
        `- **Language**: ${object.language}`,
        `- **Status**: ${object.status}`,
        `- **Summary**: ${object.summary}`,
        "",
        "#### Verified Body Content",
        object.body,
    ];
    sections.push(mainObjectSection.join("\n"));
    // 3. AI / SEO Metadata
    if (metadata.ai?.canonicalAnswer) {
        sections.push(`#### Canonical Answer\n${metadata.ai.canonicalAnswer}`);
    }
    if (metadata.ai?.keyTakeaways && metadata.ai.keyTakeaways.length > 0) {
        const takeaways = metadata.ai.keyTakeaways.map((t) => `- ${t}`).join("\n");
        sections.push(`#### Key Takeaways\n${takeaways}`);
    }
    // 4. Relevant Domain Entities
    if (includeEntities && entities.length > 0) {
        const entityLines = entities.map((e) => `- **${e.canonicalName}** (${e.type}): ${e.definition}`);
        sections.push(`### Relevant Entities\n${entityLines.join("\n")}`);
    }
    // 5. Verified Sources & Citations
    if (includeCitations && citations.length > 0) {
        const citationMap = new Map();
        for (const src of sources) {
            citationMap.set(src.id, src);
        }
        const citationLines = [];
        for (const c of citations) {
            const src = citationMap.get(c.sourceId);
            const srcTitle = src?.title ?? c.sourceId;
            const trust = src?.trustLevel ? ` [Trust: ${src.trustLevel}]` : "";
            const quote = c.quote ? ` "${c.quote}"` : "";
            const paraphrase = c.paraphrase ? ` (${c.paraphrase})` : "";
            citationLines.push(`- [${c.purpose}] **${srcTitle}**${trust}${quote}${paraphrase}`);
        }
        sections.push(`### Verified Evidence & Citations\n${citationLines.join("\n")}`);
    }
    // 6. Optional Technical Metadata
    if (includeTechnicalMeta && metadata.technical) {
        sections.push(`### Technical Provenance\n` +
            `- Version: ${object.version}\n` +
            `- Generated: ${contextPackage.generatedAt}`);
    }
    return sections.join("\n\n");
}
