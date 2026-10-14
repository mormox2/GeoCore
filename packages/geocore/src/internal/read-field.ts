/**
 * Reads a property that the static type does not declare (extension fields from raw
 * input, optional properties of other shapes). Returns `unknown` so callers must check
 * the value before using it, instead of casting the whole object to `any`.
 */
export function readField(value: unknown, key: string): unknown {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>)[key] : undefined;
}

/** Like readField, but only returns the value when it is a non-empty string. */
export function readString(value: unknown, key: string): string | undefined {
  const field = readField(value, key);
  return typeof field === "string" && field.length > 0 ? field : undefined;
}
