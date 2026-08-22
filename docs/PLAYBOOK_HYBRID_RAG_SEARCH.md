# Playbook: Hybrid Vector Search & RAG Anti-Hallucination Guardrails

This playbook details how GeoCore's **hybrid search engine** (`@mormox2/geocore-vector`) and **RAG verification layer** (`@mormox2/geocore-ai`) prevent AI hallucinations and deliver grounded answers in regulated medical and enterprise domains.

---

## 1. Why Hybrid Search (Dense Vectors + BM25)?

Single-channel search mechanisms frequently fail in specialized domains:
- **Dense Vector Search Only**: Struggles with exact medical keywords, drug dosages, or ISO codes.
- **Lexical BM25 Search Only**: Misses synonyms, layman terminology (*"dents jaunes"* ➔ *"tartre et coloration"*), and conversational questions.

GeoCore uses **Reciprocal Rank Fusion (RRF)** to blend both channels into a unified relevance score:

$$RRF(d) = \frac{w_{\text{lexical}}}{k + \text{rank}_{\text{lexical}}(d)} + \frac{w_{\text{vector}}}{k + \text{rank}_{\text{vector}}(d)}$$

Where:
- $k = 60$ (standard smoothing constant).
- $w_{\text{lexical}} = 1.0$, $w_{\text{vector}} = 1.0$ (configurable channel weights).

---

## 2. Setting Up Embedding Providers

### A. OpenAI Embeddings (`text-embedding-3-small` / `text-embedding-3-large`)
```ts
import { OpenAiEmbeddingProvider } from "@mormox2/geocore-vector";

const provider = new OpenAiEmbeddingProvider({
  apiKey: process.env.OPENAI_API_KEY!,
  model: "text-embedding-3-small", // 1536 dimensions
});
```

### B. Fast Local / Deterministic Provider (Offline / Testing)
```ts
import { DeterministicEmbeddingProvider } from "@mormox2/geocore-vector";

const provider = new DeterministicEmbeddingProvider(64);
```

### C. Custom Transformer / Local LLM (HuggingFace / Ollama)
```ts
import { CustomEmbeddingProvider } from "@mormox2/geocore-vector";

const provider = new CustomEmbeddingProvider(384, async (text) => {
  const embedding = await myLocalModel.embed(text);
  return embedding;
});
```

---

## 3. Dataset Vectorization Pipeline

GeoCore breaks knowledge objects into structured markdown chunks preserving heading context before generating vectors:

```ts
import { vectorizeDataset, MemoryVectorStore } from "@mormox2/geocore-vector";
import { dataset } from "./dataset";

const store = new MemoryVectorStore();
const report = await vectorizeDataset(dataset, store, provider, {
  chunkSize: 500,
  overlap: 50,
});

console.log(`Indexed ${report.vectorsIndexed} semantic vectors in ${report.durationMs}ms`);
```

---

## 4. Executing Hybrid Search

```ts
import { searchHybrid } from "@mormox2/geocore-vector";

const query = "comment enlever le tartre sans douleur";
const response = await searchHybrid(query, dataset, store, provider, {
  limit: 5,
  lexicalWeight: 1.0,
  vectorWeight: 1.2,
});

for (const hit of response.results) {
  console.log(`[${hit.matchType}] ${hit.title} (Score: ${hit.combinedScore})`);
}
```

---

## 5. RAG Citation Grounding & Hallucination Scoring

Before returning any AI answer to a clinical patient or enterprise user, run `verifyAnswerGrounding`:

```ts
import { getAiContext } from "@mormox2/geocore";
import { verifyAnswerGrounding } from "@mormox2/geocore-ai";

const aiPackage = getAiContext(dataset, { objectId: "ko_detartrage_abime_dents" }).data!;
const generatedAnswer = "Le détartrage n'abîme pas les dents selon les normes de l'OMS...";

const result = verifyAnswerGrounding(generatedAnswer, aiPackage);

console.log(`Score d'ancrage: ${result.score}%`);
console.log(`Risque d'hallucination: ${result.hallucinationRisk}`); // 'low' | 'medium' | 'high'
console.log(`Entités vérifiées: ${result.matchedEntities.join(", ")}`);
console.log(`Sources citées: ${result.matchedSources.join(", ")}`);
```
