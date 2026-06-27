import { describe, it, expect } from "vitest";
import { loadKnowledgeDataset } from "../src/loader/knowledge-loader.js";
import { validateKnowledgeDataset } from "../src/loader/validate-knowledge-dataset.js";
import {
  rtimiDentalLoaderInput,
  dawajinProLoaderInput,
} from "../src/fixtures/loader.fixture.js";

describe("Loader Fixture Tests", () => {
  describe("RTimi Dental", () => {
    const dataset = loadKnowledgeDataset(rtimiDentalLoaderInput);

    it("loads successfully with no errors", () => {
      const errors = dataset.diagnostics.filter((d) => d.severity === "error" || d.severity === "critical");
      expect(errors).toHaveLength(0);
      expect(dataset.objects).toHaveLength(1);
      expect(dataset.entities).toHaveLength(2);
    });

    it("includes expected title on the loaded object", () => {
      const obj = dataset.objects[0];
      expect(obj.title).toBe("Le détartrage abîme-t-il les dents ?");
    });

    it("includes expected entities in loaded object's metadata", () => {
      const obj = dataset.objects[0];
      expect(obj.metadata).toBeDefined();
      expect(obj.metadata!.entities).toEqual(["entity_scaling", "entity_tartar"]);
    });

    it("validates as a KnowledgeDataset", () => {
      const result = validateKnowledgeDataset(dataset);
      expect(result.valid).toBe(true);
      expect(result.publishable).toBe(true);
    });
  });

  describe("Dawajin Pro", () => {
    const dataset = loadKnowledgeDataset(dawajinProLoaderInput);

    it("loads successfully with no errors", () => {
      const errors = dataset.diagnostics.filter((d) => d.severity === "error" || d.severity === "critical");
      expect(errors).toHaveLength(0);
      expect(dataset.objects).toHaveLength(1);
      expect(dataset.entities).toHaveLength(1);
    });

    it("includes expected title on the loaded object", () => {
      const obj = dataset.objects[0];
      expect(obj.title).toBe("Gestion des créances clients");
    });

    it("includes expected entities in loaded object's metadata", () => {
      const obj = dataset.objects[0];
      expect(obj.metadata).toBeDefined();
      expect(obj.metadata!.entities).toEqual([
        "entity_customer_balance",
        "entity_invoice",
        "entity_payment",
      ]);
    });

    it("validates as a KnowledgeDataset", () => {
      const result = validateKnowledgeDataset(dataset);
      expect(result.valid).toBe(true);
      expect(result.publishable).toBe(true);
    });
  });
});
