import { createContext, useContext, useState, type ReactNode } from "react";
import { initialScenario, type Scenario } from "./chartering";
const ScenarioContext = createContext<{ scenario: Scenario; setScenario: (value: Scenario) => void; hasRun: boolean; setHasRun: (value: boolean) => void } | null>(null);
export function ScenarioProvider({ children }: { children: ReactNode }) {
  const [scenario, setScenario] = useState<Scenario>(initialScenario);
  const [hasRun, setHasRun] = useState(false);
  return <ScenarioContext.Provider value={{ scenario, setScenario, hasRun, setHasRun }}>{children}</ScenarioContext.Provider>;
}
export function useScenario() {
  const context = useContext(ScenarioContext);
  if (!context) throw new Error("ScenarioProvider is missing");
  return context;
}
