export type Scenario = {
  origin: string;
  destination: string;
  quantity: number;
  loadDate: string;
  arrivalDate: string;
  horizon: number;
  contract: string;
  risk: number;
  bunker: number;
  coalPrice: number;
};

export const origins = [
  { id: "newcastle", name: "Newcastle, Australia", country: "Australia", distance: 5350, rate: 20.4, coal: 113 },
  { id: "balikpapan", name: "Balikpapan, Indonesia", country: "Indonesia", distance: 2550, rate: 13.1, coal: 91 },
  { id: "maputo", name: "Maputo, Mozambique", country: "Mozambique", distance: 4890, rate: 19.2, coal: 105 },
];
export const ports = [
  { id: "paradip", name: "Paradip", draft: 14.5, loa: 260, beam: 40, wait: 2.8, dues: 175000 },
  { id: "dhamra", name: "Dhamra", draft: 17.5, loa: 300, beam: 50, wait: 1.9, dues: 205000 },
  { id: "gangavaram", name: "Gangavaram", draft: 20, loa: 320, beam: 55, wait: 1.6, dues: 220000 },
  { id: "visakhapatnam", name: "Visakhapatnam", draft: 14, loa: 260, beam: 40, wait: 3.2, dues: 185000 },
];
export const vessels = [
  { name: "Supramax", capacity: 58000, draft: 12.5, loa: 190, beam: 32, speed: 12.5, fuel: 27, index: "BSI", factor: 1.1 },
  { name: "Panamax", capacity: 82000, draft: 14.2, loa: 225, beam: 32.3, speed: 13, fuel: 35, index: "BPI", factor: 1 },
  { name: "Capesize", capacity: 180000, draft: 18.1, loa: 290, beam: 45, speed: 13.5, fuel: 52, index: "BCI", factor: .83 },
];
export const initialScenario: Scenario = {
  origin: "newcastle", destination: "paradip", quantity: 75000,
  loadDate: "2026-11-05", arrivalDate: "2026-12-02", horizon: 30,
  contract: "spot", risk: 55, bunker: 620, coalPrice: 113,
};
export function evaluate(s: Scenario) {
  const origin = origins.find(x => x.id === s.origin) ?? { id: "newcastle", name: "Newcastle, Australia", country: "Australia", distance: 5350, rate: 20.4, coal: 113 };
  const port = ports.find(x => x.id === s.destination) ?? { id: "paradip", name: "Paradip", draft: 14.5, loa: 260, beam: 40, wait: 2.8, dues: 175000 };
  const quantity = Math.max(10000, Math.min(1000000, Number(s.quantity) || 75000));
  const horizon = [30, 60, 90].includes(Number(s.horizon)) ? Number(s.horizon) : 30;
  const risk = Math.max(0, Math.min(100, Number(s.risk) || 0));
  const distance = origin.distance + (port.id === "gangavaram" ? 240 : port.id === "visakhapatnam" ? 190 : port.id === "dhamra" ? -65 : 0);
  const trend = horizon === 30 ? .035 : horizon === 60 ? .064 : .092;
  const rows = vessels.map(v => {
    const reasons = [v.draft > port.draft ? `Draft ${v.draft}m exceeds ${port.draft}m limit` : "", v.loa > port.loa ? `LOA ${v.loa}m exceeds ${port.loa}m limit` : "", v.beam > port.beam ? `Beam ${v.beam}m exceeds ${port.beam}m limit` : ""].filter(Boolean);
    const voyages = Math.ceil(quantity / v.capacity);
    const hire = origin.rate * v.factor * quantity * (1 + trend * .25);
    const bunker = (distance / (v.speed * 24)) * v.fuel * s.bunker * voyages;
    const portDues = port.dues * voyages * 2;
    const idle = port.wait * 22000 * voyages;
    const demurrage = Math.max(0, port.wait - 2) * 18000 * voyages;
    const total = hire + bunker + portDues + idle + demurrage;
    return { ...v, feasible: reasons.length === 0, reasons, voyages, hire, bunker, portDues, idle, demurrage, total, perTonne: total / quantity };
  });
  const feasible = rows.filter(x => x.feasible).sort((a, b) => a.total - b.total);
  const best = feasible[0];
  const riskLevel = risk > 70 || horizon === 90 ? "Elevated" : risk > 35 ? "Moderate" : "Low";
  const action = !best ? "Explore another port" : trend > .05 && risk > 40 ? "Charter now" : risk < 30 ? "Negotiate" : "Charter now";
  const contracts = best ? [
    { name: "Spot voyage", total: best.total, exposure: 100, note: "Maximum rate flexibility" },
    { name: "3-voyage agreement", total: best.total * 1.025, exposure: 56, note: "Moderate price stability" },
    { name: "6-month agreement", total: best.total * 1.045, exposure: 28, note: "Lowest rate exposure" },
  ] : [];
  const sourcing = origins.map(o => ({ name: o.country, total: (o.coal + ((Number(s.coalPrice) || origin.coal) - origin.coal)) * quantity + (best?.total ?? 0) * (o.distance / origin.distance) })).sort((a,b) => a.total - b.total);
  return { origin, port, quantity, horizon, risk, distance, trend, rows, best, contracts, sourcing, action, riskLevel };
}
export const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
export const compactMoney = (n: number) => "$" + (n / 1000000).toFixed(2) + "m";
