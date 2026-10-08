// ─── GeoCore Studio Engine (pure, DOM-free) ──────────────────────────────────
//
// The Studio is a static page with no backend, so it runs browser ports of the
// GeoCore algorithms on its embedded datasets instead of displaying fixed numbers:
//   - contentTokens / verifyGrounding  ⇔ @mormo_mossaab/geocore-ai (citation-grounding)
//   - embedText                        ⇔ DeterministicEmbeddingProvider (geocore-vector)
//   - hybridSearch                     ⇔ searchHybrid RRF fusion (geocore-vector)
// tests/studio.test.ts checks these ports against the packages to prevent drift.

const STOPWORDS = new Set([
  // fr
  "alors", "aussi", "autre", "autres", "avec", "avoir", "ailleurs", "cela", "celle", "celles", "celui",
  "cette", "ceux", "chaque", "comme", "dans", "depuis", "donc", "elle", "elles", "encore", "entre",
  "etre", "etait", "leur", "leurs", "lorsqu", "lorsque", "mais", "meme", "moins", "nous", "notre",
  "parce", "pendant", "peut", "plus", "pour", "pourquoi", "quand", "quel", "quelle", "quels",
  "quelles", "selon", "sans", "sera", "sont", "sous", "tous", "tout", "toute", "toutes", "tres",
  "votre", "vous", "puisqu", "puisque", "comment", "combien", "faut",
  // en
  "about", "also", "been", "being", "does", "from", "have", "into", "more", "most", "only",
  "other", "over", "some", "such", "than", "that", "their", "them", "then", "there", "these",
  "they", "this", "those", "very", "were", "what", "when", "where", "which", "while", "with",
  "would", "your",
]);

export function normalizeText(text) {
  return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function stem(token) {
  return token.replace(/(es|s|x)$/, "").replace(/e$/, "");
}

export function contentTokens(text) {
  return normalizeText(text)
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

/**
 * Checks every sentence of `answer` against the evidence texts.
 * @param {string} answer
 * @param {{ texts: string[], entities: Array<{ id: string, label: string }> }} evidence
 */
export function verifyGrounding(answer, evidence, threshold = 0.5) {
  const normalizedAnswer = normalizeText(answer);
  const matchedEntities = evidence.entities
    .filter((e) => normalizedAnswer.includes(normalizeText(e.label).trim()))
    .map((e) => e.id);

  const vocabulary = new Set(evidence.texts.flatMap((t) => (t ? contentTokens(t) : [])));
  const claims = splitClaims(answer);
  const unsupportedClaims = claims.filter((claim) => {
    const tokens = contentTokens(claim);
    return tokens.filter((t) => vocabulary.has(t)).length / tokens.length < threshold;
  });

  const supportRatio = claims.length > 0 ? (claims.length - unsupportedClaims.length) / claims.length : 0;
  const entityRatio = evidence.entities.length > 0 ? matchedEntities.length / evidence.entities.length : supportRatio;
  const score = Math.min(1, Math.max(0, 0.8 * supportRatio + 0.2 * entityRatio));

  let hallucinationRisk = "low";
  if (supportRatio < 0.5 || score < 0.3) hallucinationRisk = "high";
  else if (unsupportedClaims.length > 0 || score < 0.6) hallucinationRisk = "medium";

  return {
    isGrounded: hallucinationRisk !== "high" && unsupportedClaims.length === 0,
    score: Math.round(score * 100) / 100,
    matchedEntities,
    unsupportedClaims,
    hallucinationRisk,
  };
}

// ─── Deterministic embeddings & hybrid search ────────────────────────────────

export function embedText(text, dimension = 64) {
  const vector = new Array(dimension).fill(0);
  const normalized = text.toLowerCase().trim();
  if (!normalized) return vector;

  for (const word of normalized.split(/\s+/)) {
    let hash = 5381;
    for (let i = 0; i < word.length; i++) {
      hash = (hash * 33) ^ word.charCodeAt(i);
    }
    const idx = Math.abs(hash) % dimension;
    const sign = (hash & 1) === 0 ? 1 : -1;
    vector[idx] += sign * (1.0 + (word.length > 5 ? 0.5 : 0.0));

    for (let b = 0; b < word.length - 1; b++) {
      vector[(word.charCodeAt(b) * 31 + word.charCodeAt(b + 1)) % dimension] += 0.2;
    }
  }

  const magnitude = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0));
  return magnitude === 0 ? vector : vector.map((v) => v / magnitude);
}

export function cosineSimilarity(a, b) {
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  return magA === 0 || magB === 0 ? 0 : dot / Math.sqrt(magA * magB);
}

/**
 * Ranks objects for a query with lexical term overlap and deterministic vector similarity,
 * fused with Reciprocal Rank Fusion (k = 60), like searchHybrid.
 */
export function hybridSearch(query, objects, { limit = 3, minVectorScore = 0.1, k = 60 } = {}) {
  const queryTerms = new Set(contentTokens(query));
  const queryVector = embedText(query);

  const scored = objects.map((obj) => {
    const text = `${obj.title}\n${obj.summary}`;
    const objectTerms = new Set(contentTokens(text));
    return {
      objectId: obj.id,
      title: obj.title,
      summary: obj.summary,
      matchedQueryTerms: [...queryTerms].filter((t) => objectTerms.has(t)).length,
      vectorSimilarity: cosineSimilarity(queryVector, embedText(text)),
    };
  });

  const lexical = scored.filter((s) => s.matchedQueryTerms > 0).sort((a, b) => b.matchedQueryTerms - a.matchedQueryTerms);
  const vector = scored.filter((s) => s.vectorSimilarity >= minVectorScore).sort((a, b) => b.vectorSimilarity - a.vectorSimilarity);

  for (const item of scored) {
    const lexRank = lexical.indexOf(item) + 1;
    const vecRank = vector.indexOf(item) + 1;
    item.lexicalRank = lexRank || null;
    item.vectorRank = vecRank || null;
    item.rrfScore = Math.round(((lexRank ? 1 / (k + lexRank) : 0) + (vecRank ? 1 / (k + vecRank) : 0)) * 10000) / 10000;
    item.matchType = lexRank && vecRank ? "both" : lexRank ? "lexical-only" : vecRank ? "semantic-only" : "none";
  }

  return scored
    .filter((s) => s.rrfScore > 0)
    .sort((a, b) => b.rrfScore - a.rrfScore)
    .slice(0, limit);
}

// ─── Local frontmatter validation (subset of `geocore validate`) ─────────────

const REQUIRED_FIELDS = ["id", "slug", "title", "summary", "language", "status", "version", "author", "createdAt", "updatedAt"];
const STATUSES = ["draft", "review", "published", "archived"];
const VISIBILITIES = ["public", "internal", "private", "hidden"];

function unquote(value) {
  return value.trim().replace(/^(["'])(.*)\1$/, "$2");
}

/** Parses the YAML subset used by GeoCore frontmatter (scalars and "- item" lists). */
export function parseFrontmatter(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  if (lines[0].trim() !== "---") return null;
  const end = lines.indexOf("---", 1);
  if (end === -1) return null;

  const data = {};
  let currentList = null;
  for (const line of lines.slice(1, end)) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const item = line.match(/^\s+-\s+(.*)$/);
    if (item && currentList) {
      currentList.push(unquote(item[1]));
      continue;
    }
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (value === "") {
      currentList = [];
      data[key] = currentList;
    } else {
      currentList = null;
      data[key] = unquote(value);
    }
  }
  return { data, body: lines.slice(end + 1).join("\n").trim() };
}

/**
 * Runs the checks that can be done in the browser on one Markdown knowledge object.
 * @returns {Array<{ name: string, status: "passed" | "warning" | "error", msg: string }>}
 */
export function validateKnowledgeMarkdown(markdown, dataset) {
  const parsed = parseFrontmatter(markdown);
  if (!parsed) {
    return [{ name: "Frontmatter", status: "error", msg: "Bloc --- frontmatter absent ou non fermé" }];
  }
  const { data, body } = parsed;
  const stages = [{ name: "Frontmatter", status: "passed", msg: "Bloc frontmatter lu" }];

  const missing = REQUIRED_FIELDS.filter((f) => !data[f]);
  stages.push(
    missing.length === 0
      ? { name: "Champs obligatoires", status: "passed", msg: `${REQUIRED_FIELDS.length} champs présents` }
      : { name: "Champs obligatoires", status: "error", msg: `Manquant : ${missing.join(", ")}` }
  );

  const statusOk = STATUSES.includes(data.status);
  const visibilityOk = data.visibility === undefined || VISIBILITIES.includes(data.visibility);
  stages.push(
    statusOk && visibilityOk
      ? { name: "Statut & visibilité", status: "passed", msg: `${data.status}${data.visibility ? ` / ${data.visibility}` : ""}` }
      : {
          name: "Statut & visibilité",
          status: "error",
          msg: !statusOk ? `Statut invalide « ${data.status ?? ""} »` : `Visibilité invalide « ${data.visibility} »`,
        }
  );

  const slugOk = typeof data.slug === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug);
  stages.push(
    slugOk
      ? { name: "Slug", status: "passed", msg: data.slug }
      : { name: "Slug", status: "error", msg: "Le slug doit être en minuscules, chiffres et tirets" }
  );

  const knownIds = new Set([...dataset.entities, ...dataset.citations].map((n) => n.id));
  const refs = [...(Array.isArray(data.entities) ? data.entities : []), ...(Array.isArray(data.citations) ? data.citations : [])];
  const unknown = refs.filter((id) => !knownIds.has(id));
  stages.push(
    unknown.length === 0
      ? { name: "Références", status: "passed", msg: `${refs.length} entité(s)/citation(s) résolue(s)` }
      : { name: "Références", status: "warning", msg: `Inconnue(s) dans « ${dataset.name} » : ${unknown.join(", ")}` }
  );

  stages.push(
    body
      ? { name: "Corps", status: "passed", msg: `${body.split(/\s+/).length} mots` }
      : { name: "Corps", status: "error", msg: "Le corps Markdown est vide" }
  );

  return stages;
}
