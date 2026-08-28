import { chunkKnowledgeObject } from "@mormo_mossaab/geocore-ai";
/**
 * Splits all published objects in a KnowledgeDataset into semantic chunks,
 * embeds them using the provided EmbeddingProvider, and indexes them into the VectorStore.
 */
export async function vectorizeDataset(dataset, store, provider, options = {}) {
    const startTime = Date.now();
    const chunkSize = options.chunkSize ?? 500;
    const overlap = options.overlap ?? 50;
    const batchSize = options.batchSize ?? 16;
    let objectsProcessed = 0;
    let chunksGenerated = 0;
    let vectorsIndexed = 0;
    const allDocuments = [];
    for (const obj of dataset.objects || []) {
        if (obj.status !== "published")
            continue;
        const chunks = chunkKnowledgeObject(obj, undefined, {
            maxChunkSize: chunkSize,
            overlap,
        });
        objectsProcessed++;
        chunksGenerated += chunks.length;
        for (const chunk of chunks) {
            // Create rich textual representation combining title, heading, and chunk content
            const richText = `${obj.title}\n${chunk.heading ? `### ${chunk.heading}\n` : ""}${chunk.content}`.trim();
            allDocuments.push({
                id: chunk.id,
                objectId: obj.id,
                chunkId: chunk.id,
                text: richText,
                vector: [], // to be populated
                metadata: {
                    title: obj.title,
                    slug: obj.slug,
                    language: obj.language,
                    heading: chunk.heading,
                    chunkIndex: chunk.chunkIndex,
                    entityIds: chunk.entityIds,
                    citationIds: chunk.citationIds,
                },
            });
        }
    }
    // Embed in batches
    for (let i = 0; i < allDocuments.length; i += batchSize) {
        const batch = allDocuments.slice(i, i + batchSize);
        const texts = batch.map((d) => d.text);
        const embeddings = await provider.embedBatch(texts);
        for (let j = 0; j < batch.length; j++) {
            batch[j].vector = embeddings[j];
        }
        await store.upsertBatch(batch);
        vectorsIndexed += batch.length;
    }
    return {
        objectsProcessed,
        chunksGenerated,
        vectorsIndexed,
        durationMs: Date.now() - startTime,
    };
}
