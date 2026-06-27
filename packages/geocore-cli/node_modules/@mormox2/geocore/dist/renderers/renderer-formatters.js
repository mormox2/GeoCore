export function formatMarkdownList(items) {
    if (!items || items.length === 0)
        return "";
    return items.map((item) => `- ${item}`).join("\n");
}
export function formatMarkdownMetadata(input) {
    const meta = input.metadata;
    const lines = [
        `- ID: ${meta.id}`,
        `- Slug: ${meta.slug || ""}`,
        `- Language: ${meta.language}`,
        `- Version: ${meta.version}`,
        `- Status: ${meta.status || ""}`,
        `- Author: ${meta.author}`,
        `- Last Updated: ${meta.updatedAt}`,
    ];
    return lines.join("\n");
}
export function stringifyContentForMarkdown(content) {
    if (typeof content === "string")
        return content;
    return "```json\n" + JSON.stringify(content, null, 2) + "\n```";
}
export function formatJsonContent(input) {
    const meta = input.metadata;
    return {
        id: input.objectId,
        slug: meta.slug,
        title: meta.title,
        summary: meta.summary,
        language: input.language,
        version: input.objectVersion,
        status: meta.status,
        body: input.content,
        metadata: {
            id: meta.id,
            title: meta.title,
            summary: meta.summary,
            language: meta.language,
            version: meta.version,
            status: meta.status,
            author: meta.author,
            canonicalUrl: meta.canonicalUrl,
            entities: meta.entities,
            collections: meta.collections,
            citations: meta.citations,
            trustLevel: meta.trustLevel,
            freshness: meta.freshness,
        },
        relationships: input.relationships || [],
        entities: input.entities || [],
        citations: input.citations || [],
        collections: input.collections || [],
        media: input.media || [],
        generatedFor: {
            format: "json",
            rendererId: "renderer_json_basic",
        },
    };
}
