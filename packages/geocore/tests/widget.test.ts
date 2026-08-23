import { describe, it, expect } from "vitest";
import {
  createWidgetStyles,
  GeoCoreWidgetElement,
  initGeoCoreWidget,
} from "../src/widget/geocore-widget.js";

describe("GeoCore Web Widget Engine", () => {
  it("generates scoped CSS rules for dark and light themes", () => {
    const darkCss = createWidgetStyles("dark", "#38bdf8");
    expect(darkCss).toContain(".gc-fab");
    expect(darkCss).toContain(".gc-window");
    expect(darkCss).toContain("#0d121f");
    expect(darkCss).toContain("#38bdf8");

    const lightCss = createWidgetStyles("light", "#2563eb");
    expect(lightCss).toContain("#ffffff");
    expect(lightCss).toContain("#2563eb");
  });

  it("exports custom element class and initialization helper", () => {
    expect(typeof GeoCoreWidgetElement).toBe("function");
    expect(typeof initGeoCoreWidget).toBe("function");
  });
});
