import { describe, it, expect } from "vitest";
import { buildPromptContext } from "../src/rag/context-builder.js";
import { chunkKnowledgeObject } from "../src/rag/knowledge-chunker.js";
import { verifyAnswerGrounding } from "../src/rag/citation-grounding.js";
import { apiDatasetFixture, getAiContext } from "../../geocore/src/index.js";

describe("GeoCore AI Engine", () => {
  const contextRes = getAiContext(apiDatasetFixture, {
    objectId: "ko_detartrage_abime_dents",
    visibility: "public",
  });
  const contextPackage = contextRes.data!;

  describe("buildPromptContext", () => {
    it("builds a prompt-ready markdown string containing preamble, object, entities and citations", () => {
      const prompt = buildPromptContext(contextPackage);
      expect(prompt).toContain("Knowledge Context Preamble");
      expect(prompt).toContain("Le détartrage abîme-t-il les dents ?");
      expect(prompt).toContain("Relevant Entities");
      expect(prompt).toContain("Détartrage");
      expect(prompt).toContain("Verified Evidence & Citations");
    });

    it("respects formatting flags", () => {
      const prompt = buildPromptContext(contextPackage, {
        includeSystemPreamble: false,
        includeCitations: false,
        includeEntities: false,
      });
      expect(prompt).not.toContain("Knowledge Context Preamble");
      expect(prompt).not.toContain("Relevant Entities");
      expect(prompt).not.toContain("Verified Evidence & Citations");
      expect(prompt).toContain("Le détartrage abîme-t-il les dents ?");
    });
  });

  describe("chunkKnowledgeObject", () => {
    it("chunks a knowledge object into semantic sections with metadata", () => {
      const chunks = chunkKnowledgeObject(contextPackage.object, contextPackage.metadata, {
        maxChunkSize: 100,
      });

      expect(chunks.length).toBeGreaterThan(0);
      expect(chunks[0].objectId).toBe("ko_detartrage_abime_dents");
      expect(chunks[0].title).toBe("Le détartrage abîme-t-il les dents ?");
      expect(chunks[0].content).toBeTruthy();
      expect(chunks[0].charCount).toBeGreaterThan(0);
    });

    it("handles short/empty object bodies safely", () => {
      const shortObject = {
        ...contextPackage.object,
        body: "",
      };
      const chunks = chunkKnowledgeObject(shortObject);
      expect(chunks).toHaveLength(1);
      expect(chunks[0].content).toBe(shortObject.summary);
    });
  });

  describe("verifyAnswerGrounding", () => {
    it("returns high grounding score for faithful answers", () => {
      const faithfulAnswer =
        "Le détartrage n'abîme pas les dents lorsqu'il est réalisé par un dentiste. " +
        "Il permet d'éliminer le tartre dentaire selon l'Organisation Mondiale de la Santé (WHO).";

      const result = verifyAnswerGrounding(faithfulAnswer, contextPackage);
      expect(result.isGrounded).toBe(true);
      expect(result.hallucinationRisk).not.toBe("high");
      expect(result.score).toBeGreaterThan(0.3);
    });

    it("flags high hallucination risk for completely unrelated or ungrounded responses", () => {
      const hallucinatedAnswer =
        "Les fusées spatiales de la NASA utilisent de l'hydrogène liquide pour atteindre l'orbite martienne en 2030.";

      const result = verifyAnswerGrounding(hallucinatedAnswer, contextPackage);
      expect(result.hallucinationRisk).toBe("high");
      expect(result.isGrounded).toBe(false);
      expect(result.score).toBeLessThan(0.3);
    });
  });
});
