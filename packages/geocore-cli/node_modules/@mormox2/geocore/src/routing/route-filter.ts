import type { ResolveRoutesInput } from "../types/route.js";
import type { KnowledgeObject } from "../types/knowledge-object.js";
import type { KnowledgeStatus } from "../types/metadata.js";

const PRIVATE_HIDDEN: ReadonlySet<string> = new Set(["private", "hidden"]);

/**
 * Filter the input objects to those that should produce routes.
 *
 * Public mode (default): only published objects.
 * Internal mode: draft / review / published / archived, but never private/hidden.
 *
 * When `input.language` is set, only objects whose language matches are kept.
 */
export function filterRouteObjects(input: ResolveRoutesInput): KnowledgeObject[] {
  const mode = input.visibility ?? "public";
  const language = input.language;

  return input.objects.filter((object) => {
    if (!object) return false;

    // Visibility override lives on object.metadata?.visibility in future sprints;
    // for now objects only carry status. Private/hidden objects (signaled by an
    // optional metadata flag) are always excluded.
    const explicitVisibility = readObjectVisibility(object);
    if (explicitVisibility && PRIVATE_HIDDEN.has(explicitVisibility)) {
      return false;
    }

    if (mode === "public") {
      if (object.status !== "published") return false;
      if (explicitVisibility && explicitVisibility !== "public") return false;
    } else {
      // internal mode: allow draft/review/published/archived
      const allowed: ReadonlySet<KnowledgeStatus> = new Set<KnowledgeStatus>([
        "draft",
        "review",
        "published",
        "archived",
      ]);
      if (!allowed.has(object.status)) return false;
      if (explicitVisibility && PRIVATE_HIDDEN.has(explicitVisibility)) return false;
    }

    if (language && object.language !== language) return false;

    return true;
  });
}

/**
 * Read an optional visibility hint from object.metadata. Sprint 10 does not
 * model visibility on the object itself, so this is forward-compatible only.
 */
function readObjectVisibility(object: KnowledgeObject): string | undefined {
  const meta = object.metadata as { visibility?: string } | undefined;
  return meta?.visibility;
}
