import { normalizeVector } from "../math/vector-math.js";

/**
 * Universal interface for vector embedding generation.
 */
export interface EmbeddingProvider {
  /**
   * Generates a dense embedding vector for a single text.
   */
  embedText(text: string): Promise<number[]>;

  /**
   * Generates dense embedding vectors for a batch of texts.
   */
  embedBatch(texts: string[]): Promise<number[][]>;

  /**
   * Returns the dimension of the embedding space.
   */
  getDimension(): number;
}

/**
 * High-performance deterministic embedding provider for offline testing and fast local execution.
 * Maps n-grams, tokens, and character hashes to a normalized float vector.
 */
export class DeterministicEmbeddingProvider implements EmbeddingProvider {
  private dimension: number;

  constructor(dimension = 64) {
    this.dimension = dimension;
  }

  getDimension(): number {
    return this.dimension;
  }

  async embedText(text: string): Promise<number[]> {
    const vector = new Array<number>(this.dimension).fill(0);
    const normalized = text.toLowerCase().trim();
    if (!normalized) return vector;

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

  async embedBatch(texts: string[]): Promise<number[][]> {
    return Promise.all(texts.map((t) => this.embedText(t)));
  }
}

export type OpenAiEmbeddingOptions = {
  apiKey: string;
  model?: "text-embedding-3-small" | "text-embedding-3-large" | "text-embedding-ada-002" | string;
  dimensions?: number;
  baseUrl?: string;
};

/**
 * Production OpenAI Embeddings Provider calling the /v1/embeddings endpoint.
 */
export class OpenAiEmbeddingProvider implements EmbeddingProvider {
  private apiKey: string;
  private model: string;
  private dimension: number;
  private baseUrl: string;

  constructor(options: OpenAiEmbeddingOptions) {
    this.apiKey = options.apiKey;
    this.model = options.model ?? "text-embedding-3-small";
    this.dimension = options.dimensions ?? (this.model === "text-embedding-3-large" ? 3072 : 1536);
    this.baseUrl = (options.baseUrl ?? "https://api.openai.com/v1").replace(/\/$/, "");
  }

  getDimension(): number {
    return this.dimension;
  }

  async embedText(text: string): Promise<number[]> {
    const results = await this.embedBatch([text]);
    return results[0];
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
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

    const json = (await res.json()) as { data: Array<{ embedding: number[] }> };
    return json.data.map((item) => item.embedding);
  }
}

/**
 * Custom function-driven embedding provider.
 */
export class CustomEmbeddingProvider implements EmbeddingProvider {
  private dimension: number;
  private embedFn: (text: string) => Promise<number[]>;

  constructor(dimension: number, embedFn: (text: string) => Promise<number[]>) {
    this.dimension = dimension;
    this.embedFn = embedFn;
  }

  getDimension(): number {
    return this.dimension;
  }

  async embedText(text: string): Promise<number[]> {
    return this.embedFn(text);
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    return Promise.all(texts.map((t) => this.embedFn(t)));
  }
}
