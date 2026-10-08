import { describe, it, expect } from "vitest";
import { buildPromptContext } from "../src/rag/context-builder.js";
import { chunkKnowledgeObject } from "../src/rag/knowledge-chunker.js";
import { verifyAnswerGrounding } from "../src/rag/citation-grounding.js";
import { buildExtractiveAnswer, markdownToPlainText } from "../src/rag/extractive-answer.js";
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

    it("reports a fabricated claim appended to faithful text instead of rating it low risk", () => {
      const answer =
        contextPackage.object.body +
        " Par ailleurs, le détartrage guérit définitivement le cancer et remplace les antibiotiques.";

      const result = verifyAnswerGrounding(answer, contextPackage);
      expect(result.unsupportedClaims).toEqual([
        "Par ailleurs, le détartrage guérit définitivement le cancer et remplace les antibiotiques.",
      ]);
      expect(result.isGrounded).toBe(false);
      expect(result.hallucinationRisk).not.toBe("low");
    });

    it("never grounds an answer against an empty context", () => {
      const emptyContext = {
        ...contextPackage,
        object: { ...contextPackage.object, title: "", summary: "", body: "" },
        entities: [],
        citations: [],
        sources: [],
      };

      const result = verifyAnswerGrounding("La lune est entièrement faite de fromage.", emptyContext);
      expect(result.isGrounded).toBe(false);
      expect(result.hallucinationRisk).toBe("high");
      expect(result.score).toBe(0);
    });

    it("treats an empty answer as ungrounded", () => {
      const result = verifyAnswerGrounding("", contextPackage);
      expect(result.isGrounded).toBe(false);
      expect(result.hallucinationRisk).toBe("high");
    });
  });

  describe("buildExtractiveAnswer", () => {
    it("answers only with sentences from the certified object, so the answer is grounded", () => {
      const { answer, matchedQueryTerms } = buildExtractiveAnswer(
        "Est-ce que le détartrage abîme les dents ?",
        contextPackage
      );
      expect(contextPackage.object.body).toContain(answer.split(". ")[0]);
      expect(matchedQueryTerms).toBeGreaterThan(0);

      const grounding = verifyAnswerGrounding(answer, contextPackage);
      expect(grounding.isGrounded).toBe(true);
      expect(grounding.unsupportedClaims).toEqual([]);
    });

    it("reports zero matched terms for an unrelated question", () => {
      const { matchedQueryTerms } = buildExtractiveAnswer("Quel est le prix des fusées spatiales ?", contextPackage);
      expect(matchedQueryTerms).toBe(0);
    });

    it("keeps the most relevant sentences within maxLength, in document order", () => {
      const ctx = {
        ...contextPackage,
        object: {
          ...contextPackage.object,
          body: "## Titre\n\nPremière phrase générale sur la santé. Le tartre se forme sur les dents. Les implants remplacent une dent. Le tartre favorise la gingivite.",
        },
      };
      const { answer } = buildExtractiveAnswer("Comment se forme le tartre ?", ctx, { maxLength: 90 });
      expect(answer).toBe("Le tartre se forme sur les dents. Le tartre favorise la gingivite.");
    });

    it("converts markdown to plain prose", () => {
      expect(markdownToPlainText("# H\n\n- **Gras** et [lien](https://x.y)\n1. Item")).toBe("Gras et lien Item");
    });
  });
});
