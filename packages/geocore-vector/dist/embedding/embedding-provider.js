import { normalizeVector } from "../math/vector-math.js";
/**
 * High-performance deterministic embedding provider for offline testing and fast local execution.
 * Maps n-grams, tokens, and character hashes to a normalized float vector.
 */
export class DeterministicEmbeddingProvider {
    dimension;
    constructor(dimension = 64) {
        this.dimension = dimension;
    }
    getDimension() {
        return this.dimension;
    }
    async embedText(text) {
        const vector = new Array(this.dimension).fill(0);
        const normalized = text.toLowerCase().trim();
        if (!normalized)
            return vector;
        const words = normalized.split(/\s+/);
        for (let w = 0; w < words.length; w++) {
            const word = words[w];
            let hash = 5381;
            for (let i = 0; i < word.length; i++) {
                hash = (hash * 33) ^ word.charCodeAt(i);
            }
            const idx = Math.abs(hash) % this.dimension;
            const sign = (hash & 1) === 0 ? 1 : -1;
            const weight = 1.0 + (word.length > 5 ? 0.5 : 0.0);
            vector[idx] += sign * weight;
            // Also hash character bigrams for subword similarity
            for (let b = 0; b < word.length - 1; b++) {
                const bigramHash = (word.charCodeAt(b) * 31 + word.charCodeAt(b + 1)) % this.dimension;
                vector[bigramHash] += 0.2;
            }
        }
        return normalizeVector(vector);
    }
    async embedBatch(texts) {
        return Promise.all(texts.map((t) => this.embedText(t)));
    }
}
/**
 * Production OpenAI Embeddings Provider calling the /v1/embeddings endpoint.
 */
export class OpenAiEmbeddingProvider {
    apiKey;
    model;
    dimension;
    baseUrl;
    constructor(options) {
        this.apiKey = options.apiKey;
        this.model = options.model ?? "text-embedding-3-small";
        this.dimension = options.dimensions ?? (this.model === "text-embedding-3-large" ? 3072 : 1536);
        this.baseUrl = (options.baseUrl ?? "https://api.openai.com/v1").replace(/\/$/, "");
    }
    getDimension() {
        return this.dimension;
    }
    async embedText(text) {
        const results = await this.embedBatch([text]);
        return results[0];
    }
    async embedBatch(texts) {
        const res = await fetch(`${this.baseUrl}/embeddings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify({
                input: texts,
                model: this.model,
                dimensions: this.dimension,
            }),
        });
        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`OpenAI Embedding API error (${res.status}): ${errText}`);
        }
        const json = (await res.json());
        return json.data.map((item) => item.embedding);
    }
}
/**
 * Custom function-driven embedding provider.
 */
export class CustomEmbeddingProvider {
    dimension;
    embedFn;
    constructor(dimension, embedFn) {
        this.dimension = dimension;
        this.embedFn = embedFn;
    }
    getDimension() {
        return this.dimension;
    }
    async embedText(text) {
        return this.embedFn(text);
    }
    async embedBatch(texts) {
        return Promise.all(texts.map((t) => this.embedFn(t)));
    }
}
