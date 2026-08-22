/**
 * Calculates the dot product of two vectors of equal length.
 */
export function dotProduct(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error(`Vector length mismatch: ${a.length} vs ${b.length}`);
  }
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += a[i] * b[i];
  }
  return sum;
}

/**
 * Calculates the Euclidean norm (magnitude) of a vector.
 */
export function vectorMagnitude(v: number[]): number {
  let sum = 0;
  for (let i = 0; i < v.length; i++) {
    sum += v[i] * v[i];
  }
  return Math.sqrt(sum);
}

/**
 * Calculates the Cosine Similarity between two vectors.
 * Returns a value between -1.0 and 1.0 (or 0.0 if either vector has 0 magnitude).
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;
  const magA = vectorMagnitude(a);
  const magB = vectorMagnitude(b);
  if (magA === 0 || magB === 0) return 0;
  const dot = dotProduct(a, b);
  return dot / (magA * magB);
}

/**
 * Calculates the Euclidean distance between two vectors.
 */
export function euclideanDistance(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error(`Vector length mismatch: ${a.length} vs ${b.length}`);
  }
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const diff = a[i] - b[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

/**
 * Normalizes a vector so that its magnitude equals 1.
 */
export function normalizeVector(v: number[]): number[] {
  const mag = vectorMagnitude(v);
  if (mag === 0) return v.slice();
  return v.map((x) => x / mag);
}
