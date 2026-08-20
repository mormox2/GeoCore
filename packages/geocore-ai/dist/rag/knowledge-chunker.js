/**
 * Splits a Knowledge Object into semantic chunks suitable for vector embeddings / search indexing.
 * Preserves heading context and attaches metadata to each chunk.
 */
export function chunkKnowledgeObject(object, metadata, options = {}) {
    const maxChunkSize = options.maxChunkSize ?? 600;
    const minChunkSize = options.minChunkSize ?? 80;
    const overlap = options.overlap ?? 50;
    const entityIds = [
        ...(options.entityIds ?? []),
        ...(metadata?.entities ?? []),
    ];
    const citationIds = [
        ...(options.citationIds ?? []),
        ...(metadata?.citations ?? []),
    ];
    const body = object.body.trim();
    if (!body) {
        return [
            {
                id: `${object.id}_chunk_0`,
                objectId: object.id,
                title: object.title,
                chunkIndex: 0,
                totalChunks: 1,
                content: object.summary || object.title,
                language: object.language,
                entityIds,
                citationIds,
                charCount: (object.summary || object.title).length,
            },
        ];
    }
    // Split by markdown headers or double newlines (paragraphs)
    const rawSections = body.split(/(?=\n#{1,6}\s)/);
    const intermediateChunks = [];
    for (const sec of rawSections) {
        const trimmed = sec.trim();
        if (!trimmed)
            continue;
        // Check if section starts with a heading
        const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)/);
        let heading;
        let text = trimmed;
        if (headingMatch) {
            heading = headingMatch[2].trim();
            text = trimmed.slice(headingMatch[0].length).trim();
        }
        // If section fits in maxChunkSize, keep intact
        if (text.length <= maxChunkSize && text.length >= minChunkSize) {
            intermediateChunks.push({ heading, content: text });
        }
        else if (text.length > maxChunkSize) {
            // Split paragraphs
            const paragraphs = text.split(/\n\s*\n/);
            let currentBuffer = "";
            for (const p of paragraphs) {
                const cleanP = p.trim();
                if (!cleanP)
                    continue;
                if (currentBuffer.length + cleanP.length + 2 <= maxChunkSize) {
                    currentBuffer = currentBuffer ? `${currentBuffer}\n\n${cleanP}` : cleanP;
                }
                else {
                    if (currentBuffer) {
                        intermediateChunks.push({ heading, content: currentBuffer });
                    }
                    currentBuffer = cleanP;
                }
            }
            if (currentBuffer) {
                intermediateChunks.push({ heading, content: currentBuffer });
            }
        }
        else {
            // Short text
            intermediateChunks.push({ heading, content: text });
        }
    }
    // If no chunks produced, fallback to full body
    if (intermediateChunks.length === 0) {
        intermediateChunks.push({ content: body });
    }
    const totalChunks = intermediateChunks.length;
    return intermediateChunks.map((c, idx) => ({
        id: `${object.id}_chunk_${idx}`,
        objectId: object.id,
        title: object.title,
        chunkIndex: idx,
        totalChunks,
        content: c.content,
        heading: c.heading,
        language: object.language,
        entityIds: [...new Set(entityIds)],
        citationIds: [...new Set(citationIds)],
        charCount: c.content.length,
    }));
}
