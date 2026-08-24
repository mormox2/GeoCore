# 📝 Technical Inbound Article (Dev.to / Medium / Hashnode)

> **Suggested Platforms**: [Dev.to](https://dev.to), [Hashnode](https://hashnode.com), [Medium](https://medium.com)  
> **Tags**: `#typescript`, `#ai`, `#rag`, `#webdev`, `#opensource`  
> **Estimated Read Time**: 6 minutes

---

# Why Pure Vector Search Fails in High-Stakes RAG (And How We Solved It with RRF in Pure TypeScript)

*By Dr. Mossaab Rtimi*

If you've built any Retrieval-Augmented Generation (RAG) system over the past two years, you know the standard recipe:
1. Chunk your markdown/PDF files.
2. Generate dense vector embeddings (e.g. OpenAI `text-embedding-3-small` or local BGE).
3. Store them in Pinecone, Qdrant, or pgvector.
4. Run cosine similarity on user queries and pass the top $K$ chunks to an LLM.

In generic chat applications, this works reasonably well. But when you deploy RAG into **high-stakes domains** — such as clinical healthcare, pharmaceuticals, legal compliance, or precision agriculture — this recipe fails catastrophically.

Here is why it fails, and how we solved it with **Reciprocal Rank Fusion (RRF)** and **deterministic grounding guardrails** in pure TypeScript with **[GeoCore](https://github.com/mormox2/GeoCore)**.

---

## 1. The Vector Search Blindspot Problem

Dense embeddings excel at conceptual, fuzzy matches. For example, *"how to treat tooth pain"* will successfully match *"analgesics for dental discomfort"*.

However, dense embeddings fail on:
* **Exact product numbers and serial codes**: e.g., `ISO 22000:2018 Section 8.5.2`
* **Exact dosages and clinical compounds**: e.g., `Amoxicillin 500mg` vs `Amoxicillin 1000mg`
* **Acronyms and rare technical terms**: e.g., `NaF varnish 5%`

To an embedding model, `500mg` and `1000mg` have nearly identical vector representations because their semantic contexts are virtually indistinguishable. But to a patient, that difference is critical.

---

## 2. The Solution: Reciprocal Rank Fusion (RRF)

To achieve 100% retrieval reliability without the blindspots, we must combine:
1. **Lexical BM25 Search**: Guarantees that exact keywords, numbers, and identifiers are ranked first.
2. **Dense Vector Search**: Guarantees that conceptual and semantic intent is understood.

Rather than trying to linearly combine raw BM25 scores (which are unbounded) with cosine similarity scores (which range between $-1$ and $+1$), we use **Reciprocal Rank Fusion (RRF)**:

$$RRF(d) = \frac{w_{\text{lexical}}}{60 + \text{rank}_{\text{lexical}}(d)} + \frac{w_{\text{vector}}}{60 + \text{rank}_{\text{vector}}(d)}$$

Where:
- $\text{rank}_{\text{lexical}}(d)$ is the 1-based position of document $d$ in the BM25 results.
- $\text{rank}_{\text{vector}}(d)$ is the 1-based position of document $d$ in the Vector similarity results.
- $60$ is the standard smoothing constant preventing top-ranked outliers from dominating.

---

## 3. Implementing In-Memory Hybrid Search in Pure TypeScript

Instead of orchestrating complex Python microservices or multi-cloud vector databases, we implemented the entire hybrid index in strict TypeScript:

```typescript
import { createVectorStore, createDeterministicEmbeddingProvider } from "@mormox2/geocore-vector";

// Initialize vector store
const vectorStore = createVectorStore({
  provider: createDeterministicEmbeddingProvider(64),
});

// Index your chunks
await vectorStore.addChunks([
  {
    id: "guideline-01",
    objectId: "fluoride-varnish",
    heading: "Clinical Application",
    content: "Apply 5% sodium fluoride (NaF) varnish every 6 months for high-risk patients (WHO/HAS Guidelines).",
    tokenCount: 22,
    embedding: await provider.embed("Apply 5% sodium fluoride varnish..."),
  }
]);

// Execute sub-2ms Hybrid Search
const results = await vectorStore.searchHybrid({
  query: "What is the recommended NaF percentage for fluoride varnish?",
  k: 5,
  lexicalWeight: 1.0,
  vectorWeight: 1.0,
});
```

---

## 4. Stopping Hallucinations with Grounding Guardrails

Even with perfect retrieval, LLMs can still introduce hallucinations during synthesis.

In GeoCore, we built `verifyAnswerGrounding` in `@mormox2/geocore-ai`:

```typescript
import { verifyAnswerGrounding } from "@mormox2/geocore-ai";

const evaluation = verifyAnswerGrounding(
  llmAnswer,
  retrievedContext
);

if (evaluation.hallucinationRisk === "high") {
  // Reject or flag the answer before presenting to the user
  console.warn("Answer rejected: Unsupported clinical claims detected.");
}
```

The evaluator verifies:
- Entity and taxonomy alignment.
- Direct grounding against certified evidence sources (e.g., PubMed, WHO, HAS).
- Exact numeric boundary consistency.

---

## 5. Get Started in 30 Seconds

GeoCore is 100% open source under the MIT License, structured as a clean 7-package monorepo tested with 747 automated tests.

You can try the visual studio and RAG engine locally:

```bash
npx @mormox2/geocore-cli init my-knowledge-base
cd my-knowledge-base
npx @mormox2/geocore-cli studio
```

⭐ **Check out the repository on GitHub**: [https://github.com/mormox2/GeoCore](https://github.com/mormox2/GeoCore)

Let me know in the comments: How are you handling hybrid retrieval and grounding in your AI applications?
