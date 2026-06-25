import { GenerateLlmsInput } from "../types/llms.js";
import { LlmsOutput } from "../types/llms-output.js";
import { LlmsDiagnostic } from "../types/llms-diagnostic.js";
import { filterLlmsPublicObjects } from "./llms-filter.js";
import { createLlmsOutputId, extractLlmsEntities, extractLlmsCitations, isLlmsPublicObject } from "./llms-utils.js";
import { formatLlmsMetadataBlock, stringifyLlmsContent, formatLlmsList } from "./llms-formatters.js";
import { validateLlmsOutput } from "./validate-llms-output.js";
import * as codes from "../validation/validation-codes.js";

/**
 * Generates expanded llms-full.txt content metadata and context.
 */
export function generateLlmsFullTxt(input: GenerateLlmsInput): LlmsOutput {
  const diagnostics: LlmsDiagnostic[] = [];

  // Check header
  if (!input.siteName || input.siteName.trim() === "") {
    diagnostics.push({
      id: `${codes.GC_LLMS_SITE_NAME_MISSING}_gen`,
      severity: "error",
      code: codes.GC_LLMS_SITE_NAME_MISSING,
      message: "Site name is missing.",
      field: "siteName",
    });
  }

  // Record excluded private objects
  for (const obj of input.objects) {
    if (!isLlmsPublicObject(obj)) {
      diagnostics.push({
        id: `${codes.GC_LLMS_PRIVATE_OBJECT_EXCLUDED}_${obj.id}`,
        severity: "info",
        code: codes.GC_LLMS_PRIVATE_OBJECT_EXCLUDED,
        message: `Excluded non-public object: ${obj.id}`,
        objectId: obj.id,
      });
    }
  }

  const publicObjects = filterLlmsPublicObjects(input);

  if (publicObjects.length === 0) {
    diagnostics.push({
      id: `${codes.GC_LLMS_NO_PUBLIC_OBJECTS}_gen`,
      severity: "warning",
      code: codes.GC_LLMS_NO_PUBLIC_OBJECTS,
      message: "No public objects matching visibility and language criteria are present.",
    });
  }

  const lines: string[] = [];
  lines.push(`# ${input.siteName} — Full Knowledge Context`);
  lines.push("");

  if (input.siteDescription) {
    lines.push(input.siteDescription);
    lines.push("");
  }

  if (input.siteUrl) {
    lines.push(`Website: ${input.siteUrl}`);
    lines.push("");
  }

  for (let i = 0; i < publicObjects.length; i++) {
    const obj = publicObjects[i];
    const meta = input.metadata?.[obj.id];

    lines.push(`## Document: ${obj.title}`);
    lines.push("");

    const author = meta?.author || obj.author || undefined;
    const url = meta?.canonicalUrl || meta?.seo?.canonicalUrl || (obj as any).canonicalUrl || undefined;
    if (!url) {
      diagnostics.push({
        id: `${codes.GC_LLMS_CANONICAL_URL_MISSING}_${obj.id}`,
        severity: "warning",
        code: codes.GC_LLMS_CANONICAL_URL_MISSING,
        message: `Object lacks a canonical URL: ${obj.id}`,
        objectId: obj.id,
      });
    }

    const metadataBlock = formatLlmsMetadataBlock({
      id: obj.id,
      language: obj.language,
      version: obj.version || undefined,
      author,
      canonicalUrl: url,
      trustLevel: meta?.trustLevel || undefined,
      freshness: meta?.freshness || undefined,
    });
    lines.push(metadataBlock);
    lines.push("");

    const summaryVal = meta?.summary || obj.summary;
    lines.push("Summary:");
    lines.push(summaryVal);
    lines.push("");

    lines.push("Content:");
    lines.push(stringifyLlmsContent(obj.body));
    lines.push("");

    // Entities
    const entities = extractLlmsEntities(obj, meta, input.relationships);
    if (entities.length > 0) {
      lines.push("Entities:");
      lines.push(formatLlmsList(entities));
      lines.push("");
    }

    // Collections
    const collections = meta?.collections || [];
    if (collections.length > 0) {
      lines.push("Collections:");
      lines.push(formatLlmsList(collections));
      lines.push("");
    }

    // Citations
    const citations = extractLlmsCitations(obj, meta, input.relationships);
    if (citations.length > 0) {
      lines.push("Citations:");
      lines.push(formatLlmsList(citations));
      lines.push("");
    }

    if (i < publicObjects.length - 1) {
      lines.push("---");
      lines.push("");
    }
  }

  const content = lines.join("\n").trim();
  const id = createLlmsOutputId("llms-full.txt", input.siteName, input.language);
  const generatedAt = new Date().toISOString();

  const output: LlmsOutput = {
    id,
    type: "llms-full.txt",
    siteName: input.siteName,
    language: input.language,
    content,
    sourceObjectIds: publicObjects.map((o) => o.id),
    generatedAt,
    diagnostics,
  };

  const validation = validateLlmsOutput(output);
  if (!validation.valid || validation.issues.length > 0) {
    for (const issue of validation.issues) {
      const exists = diagnostics.some((d) => d.code === issue.code && d.objectId === issue.objectId);
      if (!exists) {
        diagnostics.push({
          id: issue.id,
          severity: issue.severity,
          code: issue.code,
          message: issue.message,
          objectId: issue.objectId,
          field: issue.field,
          recommendation: issue.recommendation,
        });
      }
    }
  }

  return output;
}
