import { CalendarDays, CircleAlert, Database, MapPin } from "lucide-react";
import { compactMoney, money, type Scenario } from "@/lib/chartering";
import { planningAids } from "@/lib/planning-aids";

export function ScheduleLens({ scenario, compact = false }: { scenario: Scenario; compact?: boolean }) {
  const plan = planningAids(scenario);
  return <div>
    <div className="flex items-center gap-2"><CalendarDays size={19} className="text-accent"/><h3 className="font-display font-bold">Schedule lens</h3></div>
    <dl className={`mt-4 grid gap-4 ${compact ? "grid-cols-2" : "sm:grid-cols-3"}`}>
      <div><dt className="text-xs text-muted-foreground">Requested window</dt><dd className="mt-1 font-semibold">{plan.windowDays === null ? "Check dates" : `${plan.windowDays} days`}</dd></div>
      <div><dt className="text-xs text-muted-foreground">Sailing + destination wait</dt><dd className="mt-1 font-semibold">{plan.transitAndWait === null ? "No feasible vessel" : `${plan.transitAndWait.toFixed(1)} days`}</dd></div>
      <div><dt className="text-xs text-muted-foreground">Time remaining before other operations</dt><dd className={`mt-1 font-semibold ${plan.remainingDays !== null && plan.remainingDays < 0 ? "text-destructive" : "text-foreground"}`}>{plan.remainingDays === null ? "—" : `${plan.remainingDays.toFixed(1)} days`}</dd></div>
    </dl>
    {plan.remainingDays !== null && plan.remainingDays < 0 && <p className="mt-4 flex gap-2 text-sm text-destructive" role="status"><CircleAlert size={17} className="shrink-0"/>Sailing and assumed waiting alone exceed this date window.</p>}
    <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Per voyage at the selected class’s assumed speed. Excludes loading, discharge, origin waiting, weather and sequencing of multiple voyages. Dates do not constrain the core recommendation; this is not a delivery guarantee.</p>
  </div>;
}

export function PortComparison({ scenario }: { scenario: Scenario }) {
  const { portOptions } = planningAids(scenario);
  return <section className="panel min-w-0 p-6 md:p-8">
    <div className="eyebrow">09 / PORT ALTERNATIVES</div><h2 className="mt-2 flex items-center gap-3 font-display text-2xl font-bold"><MapPin size={23} className="shrink-0 text-accent"/>Compare every destination</h2>
    <p className="mt-2 text-sm text-muted-foreground">Same cargo, origin and prices; only the destination changes. Ranked by voyage cost.</p>
    <div className="mt-6 overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b border-border text-xs text-muted-foreground"><tr><th className="pb-3 pr-3">Port / vessel</th><th className="pb-3 pr-3">Wait</th><th className="pb-3 pr-3">Voyage cost</th><th className="pb-3">Vs. current</th></tr></thead><tbody>{portOptions.map(option => <tr key={option.port.id} className="border-b border-border"><td className="py-4 pr-3"><div className="font-semibold">{option.port.name}{option.port.id === scenario.destination && <span className="ml-2 text-xs text-accent">Current</span>}</div><div className="mt-1 text-xs text-muted-foreground">{option.vessel ?? "No feasible class"} · {option.feasibleCount}/3 fit</div></td><td className="py-4 pr-3">{option.port.wait}d</td><td className="py-4 pr-3 whitespace-nowrap font-semibold">{option.total === null ? "—" : compactMoney(option.total)}</td><td className="py-4 text-xs">{option.delta === null ? "—" : option.delta === 0 ? "Same" : `${money(Math.abs(option.delta))} ${option.delta < 0 ? "less" : "more"}`}</td></tr>)}</tbody></table></div>
    <p className="mt-4 text-xs text-muted-foreground">Destination draft, length and beam only. Origin limits, part-loading, inland transport and berth availability are not verified.</p>
  </section>;
}

export function LandedCostLens({ scenario }: { scenario: Scenario }) {
  const plan = planningAids(scenario);
  return <section className="panel p-6 md:p-8"><div className="eyebrow">10 / PROCUREMENT & TIMING</div><h2 className="mt-2 font-display text-2xl font-bold">From voyage cost to landed cost</h2><p className="mt-2 text-sm text-muted-foreground">Selected origin’s entered coal price plus the core voyage estimate.</p><dl className="mt-6 grid gap-5 border-y border-border py-5 sm:grid-cols-3"><div><dt className="text-xs text-muted-foreground">Coal subtotal</dt><dd className="mt-2 font-display text-xl font-bold">{compactMoney(plan.commodityCost)}</dd></div><div><dt className="text-xs text-muted-foreground">Coal + voyage</dt><dd className="mt-2 font-display text-xl font-bold">{plan.landedTotal === null ? "—" : compactMoney(plan.landedTotal)}</dd></div><div><dt className="text-xs text-muted-foreground">Combined cost per tonne</dt><dd className="mt-2 font-display text-xl font-bold">{plan.landedPerTonne === null ? "—" : `$${plan.landedPerTonne.toFixed(2)}/t`}</dd></div></dl><p className="mt-4 text-xs text-muted-foreground">Excludes duties, taxes, insurance and inland delivery. Thermal and coking coal quality premiums are not modeled.</p><div className="mt-7 border-t border-border pt-6"><ScheduleLens scenario={scenario}/></div></section>;
}

export function DataAssumptions() {
  return <section className="border-y border-border py-6"><details><summary className="flex cursor-pointer flex-wrap items-center gap-2 text-sm font-semibold"><Database size={18} className="text-accent"/>Data & model assumptions<span className="ml-auto text-xs font-normal text-muted-foreground">Illustrative · expand for details</span></summary><div className="mt-5 grid gap-6 md:grid-cols-3"><div><h3 className="text-sm font-bold">What powers this report</h3><p className="mt-2 text-xs leading-relaxed text-muted-foreground">Fixed illustrative port limits, vessel specifications, route distances and prices. Market direction is a deterministic assumption, not a trained SARIMA, LightGBM or GARCH forecast. No back-test accuracy or statistical prediction intervals are available.</p></div><div><h3 className="text-sm font-bold">Before using market proxies</h3><p className="mt-2 text-xs leading-relaxed text-muted-foreground">The supplied project describes licensed Baltic class series in USD/day, not index points; IMF Australian thermal coal is not coking-coal FOB, and Brent × 7.5 is only a bunker proxy. None of these feeds is connected here. Validate units, licences and source dates before use.</p></div><div><h3 className="text-sm font-bold">What is not evaluated</h3><p className="mt-2 text-xs leading-relaxed text-muted-foreground">Origin-port limits, tidal windows, part-loads, seasonal congestion, weather routing, fleet scheduling and multi-lane optimisation. Backhaul credit is zero. Contract and risk indicators are illustrative. Scenarios remain in this session and reset on refresh.</p></div></div></details></section>;
}