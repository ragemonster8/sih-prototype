import { evaluate, ports, type Scenario } from "./chartering";

/** Descriptive aids only: never change evaluate() or the recommended action. */
export function planningAids(scenario: Scenario) {
  const base = evaluate(scenario);
  const start = Date.parse(`${scenario.loadDate}T00:00:00Z`);
  const end = Date.parse(`${scenario.arrivalDate}T00:00:00Z`);
  const windowDays = Number.isFinite(start) && Number.isFinite(end) && end > start
    ? (end - start) / 86400000 : null;
  const sailingDays = base.best ? base.distance / (base.best.speed * 24) : null;
  const transitAndWait = sailingDays === null ? null : sailingDays + base.port.wait;
  const remainingDays = windowDays === null || transitAndWait === null ? null : windowDays - transitAndWait;
  const commodityCost = scenario.coalPrice * base.quantity;
  const landedTotal = base.best ? commodityCost + base.best.total : null;
  const portOptions = ports.map(port => {
    const result = evaluate({ ...scenario, destination: port.id });
    return { port, vessel: result.best?.name, feasibleCount: result.rows.filter(row => row.feasible).length,
      total: result.best?.total ?? null, delta: result.best && base.best ? result.best.total - base.best.total : null };
  }).sort((a, b) => (a.total ?? Infinity) - (b.total ?? Infinity));
  return { windowDays, sailingDays, transitAndWait, remainingDays, commodityCost, landedTotal,
    landedPerTonne: landedTotal === null ? null : landedTotal / base.quantity, portOptions };
}

export function illustrativeOutlook(scenario: Scenario) {
  const { horizon, trend } = evaluate(scenario);
  return Array.from({ length: horizon / 15 + 1 }, (_, index) => ({
    day: index === 0 ? "Today" : `+${index * 15}d`,
    value: Number((100 * (1 + trend * index * 15 / horizon)).toFixed(2)),
  }));
}