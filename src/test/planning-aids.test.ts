import { describe, expect, it } from "vitest";
import { evaluate, initialScenario } from "@/lib/chartering";
import { illustrativeOutlook, planningAids } from "@/lib/planning-aids";

describe("Supplementary planning aids preserve the core", () => {
  it("adds coal and existing voyage cost without changing the recommendation", () => {
    const before = evaluate(initialScenario);
    const aids = planningAids(initialScenario);
    expect(aids.commodityCost).toBe(113 * 75000);
    expect(aids.landedTotal).toBe(113 * 75000 + (before.best?.total ?? 0));
    expect(evaluate(initialScenario)).toEqual(before);
  });
  it("compares all four destinations using unchanged core evaluations", () => {
    const aids = planningAids(initialScenario);
    expect(aids.portOptions).toHaveLength(4);
    const current = aids.portOptions.find(option => option.port.id === "paradip");
    expect(current?.delta).toBe(0);
    expect(current?.feasibleCount).toBe(2);
    expect(aids.portOptions.map(option => option.total)).toEqual([...aids.portOptions.map(option => option.total)].sort((a, b) => (a ?? Infinity) - (b ?? Infinity)));
  });
  it("reports only sailing and destination wait, not a delivery guarantee", () => {
    const aids = planningAids(initialScenario);
    expect(aids.windowDays).toBe(27);
    expect(aids.transitAndWait).toBeCloseTo(5350 / (13 * 24) + 2.8);
    expect(aids.remainingDays).toBeCloseTo(27 - (5350 / (13 * 24) + 2.8));
    expect(planningAids({ ...initialScenario, arrivalDate: "2026-11-06" }).remainingDays).toBeLessThan(0);
    expect(planningAids({ ...initialScenario, loadDate: "" }).windowDays).toBeNull();
  });
  it.each([30, 60, 90])("matches the existing %s-day core trend at the chart endpoint", horizon => {
    const scenario = { ...initialScenario, horizon };
    const chart = illustrativeOutlook(scenario);
    expect(chart[0]?.value).toBe(100);
    expect(chart.at(-1)?.value).toBeCloseTo(100 * (1 + evaluate(scenario).trend));
  });
});