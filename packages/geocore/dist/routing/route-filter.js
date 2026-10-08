import { isNeverExposedObject, isPublicKnowledgeObject } from "../metadata/object-visibility.js";
/**
 * Filter the input objects to those that should produce routes.
 *
 * Public mode (default): only published objects.
 * Internal mode: draft / review / published / archived, but never private/hidden.
 *
 * When `input.language` is set, only objects whose language matches are kept.
 */
export function filterRouteObjects(input) {
    const mode = input.visibility ?? "public";
    const language = input.language;
    return input.objects.filter((object) => {
        if (!object)
            return false;
        // Private/hidden objects are never routed, whatever the mode.
        if (isNeverExposedObject(object)) {
            return false;
        }
        if (mode === "public") {
            if (!isPublicKnowledgeObject(object))
                return false;
        }
        else {
            // internal mode: allow draft/review/published/archived
            const allowed = new Set([
                "draft",
                "review",
                "published",
                "archived",
            ]);
            if (!allowed.has(object.status))
                return false;
        }
        if (language && object.language !== language)
            return false;
        return true;
    });
}
