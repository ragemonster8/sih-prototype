import { evaluate, ports, type Scenario } from "./chartering";

/** Optional decision aids derived only from the existing illustrative scenario model. */
export function decisionInsights(scenario: Scenario) {
  const base = evaluate(scenario);
  const alternatives = ports
    .filter(port => port.id !== scenario.destination)
    .map(port => ({ port, result: evaluate({ ...scenario, destination: port.id }) }))
    .filter(item => item.result.best)
    .sort((a, b) => (a.result.best?.total ?? Infinity) - (b.result.best?.total ?? Infinity));
  const alternate = alternatives[0];
  const idleShare = base.best ? (base.best.idle + base.best.demurrage) / base.best.total : 0;
  const warnings = [
    ...(base.port.wait > 2 ? [{ title: "Port wait exposure", detail: `${base.port.wait} assumed waiting days at ${base.port.name}; idle and demurrage add ${base.best ? `$${Math.round((base.best.idle + base.best.demurrage) / 1000).toLocaleString()}k` : "cost"} to the estimate.` }] : []),
    ...(base.horizon >= 60 ? [{ title: "Longer outlook window", detail: `The ${base.horizon}-day scenario uses a +${(base.trend * 100).toFixed(1)}% illustrative freight direction; recheck before committing.` }] : []),
    ...(!base.best ? [{ title: "No feasible vessel", detail: `None of the evaluated vessel classes fits ${base.port.name}'s physical limits. Compare another port.` }] : []),
  ];
  return { alternate, idleShare, warnings };
}