import { createLoaderDiagnostic, asStringArray } from "./loader-utils.js";
import { GC_LOADER_FRONTMATTER_MISSING, GC_LOADER_FRONTMATTER_EMPTY, GC_LOADER_FRONTMATTER_MALFORMED, GC_LOADER_MARKDOWN_BODY_MISSING, } from "../validation/validation-codes.js";
/**
 * Parses simple frontmatter at the beginning of a markdown string.
 */
export function parseSimpleFrontmatter(markdown) {
    const diagnostics = [];
    const data = {};
    if (!markdown || typeof markdown !== "string") {
        diagnostics.push(createLoaderDiagnostic({
            severity: "error",
            code: GC_LOADER_FRONTMATTER_MISSING,
            message: "Markdown content is empty or not a string.",
        }));
        return { data, body: "", diagnostics };
    }
    const trimmed = markdown.trimStart();
    if (!trimmed.startsWith("---")) {
        diagnostics.push(createLoaderDiagnostic({
            severity: "error",
            code: GC_LOADER_FRONTMATTER_MISSING,
            message: "Frontmatter block is missing (must start with '---').",
        }));
        return { data, body: markdown, diagnostics };
    }
    const lines = trimmed.split(/\r?\n/);
    let closingIndex = -1;
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === "---") {
            closingIndex = i;
            break;
        }
    }
    if (closingIndex === -1) {
        diagnostics.push(createLoaderDiagnostic({
            severity: "error",
            code: GC_LOADER_FRONTMATTER_MALFORMED,
            message: "Frontmatter block is not closed (missing closing '---').",
        }));
        return { data, body: markdown, diagnostics };
    }
    const frontmatterLines = lines.slice(1, closingIndex);
    const bodyLines = lines.slice(closingIndex + 1);
    let hasProperties = false;
    for (let i = 0; i < frontmatterLines.length; i++) {
        const line = frontmatterLines[i];
        const trimmedLine = line.trim();
        if (trimmedLine === "" || trimmedLine.startsWith("#")) {
            continue;
        }
        const colonIdx = line.indexOf(":");
        if (colonIdx === -1) {
            diagnostics.push(createLoaderDiagnostic({
                severity: "error",
                code: GC_LOADER_FRONTMATTER_MALFORMED,
                message: `Malformed frontmatter line: "${trimmedLine}". Missing colon separator.`,
            }));
            continue;
        }
        hasProperties = true;
        const key = line.slice(0, colonIdx).trim();
        const val = line.slice(colonIdx + 1).trim();
        if (!key) {
            diagnostics.push(createLoaderDiagnostic({
                severity: "error",
                code: GC_LOADER_FRONTMATTER_MALFORMED,
                message: `Malformed frontmatter line: empty key in "${trimmedLine}".`,
            }));
            continue;
        }
        const KNOWN_ARRAYS = new Set([
            "entities",
            "collections",
            "citations",
            "topics",
            "domains",
            "audiences",
            "tags",
            "keywords",
        ]);
        if (KNOWN_ARRAYS.has(key)) {
            data[key] = asStringArray(val);
        }
        else {
            data[key] = val;
        }
    }
    if (!hasProperties) {
        diagnostics.push(createLoaderDiagnostic({
            severity: "warning",
            code: GC_LOADER_FRONTMATTER_EMPTY,
            message: "Frontmatter is empty.",
        }));
    }
    let body = bodyLines.join("\n");
    if (body.startsWith("\n")) {
        body = body.slice(1);
    }
    else if (body.startsWith("\r\n")) {
        body = body.slice(2);
    }
    if (body.trim() === "") {
        diagnostics.push(createLoaderDiagnostic({
            severity: "warning",
            code: GC_LOADER_MARKDOWN_BODY_MISSING,
            message: "Markdown body content is missing or empty.",
        }));
    }
    return { data, body, diagnostics };
}
