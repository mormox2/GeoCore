/**
 * Filters a list of SearchDocuments based on visibility, language, and status options.
 */
export function filterSearchDocuments(documents, options) {
    return documents.filter((doc) => {
        // 1. Visibility filtering
        if (options.visibility === "public") {
            if (doc.status !== "published" || doc.visibility !== "public") {
                return false;
            }
        }
        else if (options.visibility === "internal") {
            const allowedStatuses = ["draft", "review", "published", "archived"];
            if (!allowedStatuses.includes(doc.status)) {
                return false;
            }
            if (doc.visibility === "private" || doc.visibility === "hidden") {
                return false;
            }
        }
        // 2. Language filtering
        if (options.language !== undefined) {
            if (doc.language !== options.language) {
                return false;
            }
        }
        // 3. Status filtering
        if (options.status !== undefined) {
            if (doc.status !== options.status) {
                return false;
            }
        }
        return true;
    });
}
