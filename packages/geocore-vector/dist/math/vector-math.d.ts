/**
 * Calculates the dot product of two vectors of equal length.
 */
export declare function dotProduct(a: number[], b: number[]): number;
/**
 * Calculates the Euclidean norm (magnitude) of a vector.
 */
export declare function vectorMagnitude(v: number[]): number;
/**
 * Calculates the Cosine Similarity between two vectors.
 * Returns a value between -1.0 and 1.0 (or 0.0 if either vector has 0 magnitude).
 */
export declare function cosineSimilarity(a: number[], b: number[]): number;
/**
 * Calculates the Euclidean distance between two vectors.
 */
export declare function euclideanDistance(a: number[], b: number[]): number;
/**
 * Normalizes a vector so that its magnitude equals 1.
 */
export declare function normalizeVector(v: number[]): number[];
