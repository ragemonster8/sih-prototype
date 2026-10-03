import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, CheckCircle2, Compass, Gauge, Layers3, Route as RouteIcon, ShieldCheck, Ship, TrendingUp } from "lucide-react";
import { PrototypeButton } from "@/components/ui/prototype-button";
import hero from "@/assets/port-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "PESticides — Intelligent Freight & Vessel Chartering" }, { name: "description", content: "Explainable freight forecasting and vessel chartering decisions for dry-bulk imports to India's East Coast." }, { property: "og:title", content: "PESticides — Intelligent Freight & Vessel Chartering" }, { property: "og:description", content: "From uncertain freight signals to feasible vessels, transparent costs and clear chartering decisions." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Home,
});
const stages = [
  { number: "01", icon: TrendingUp, title: "Read the market", text: "Explore 30, 60 and 90-day freight direction, volatility and market tightness." },
  { number: "02", icon: ShieldCheck, title: "Check what fits", text: "Filter vessel classes against port draft, length and beam before comparing cost." },
  { number: "03", icon: Layers3, title: "Price the entire voyage", text: "Bring freight, bunker, port dues, idle time and demurrage into one view." },
  { number: "04", icon: Compass, title: "Make a clear decision", text: "Compare contracts and see exactly why an option is recommended." },
];
function Home() {
  return <>
    <section className="home-hero relative overflow-hidden">
      <img className="absolute inset-0 h-full w-full object-cover" src={hero} alt="Bulk carrier docked at a coal terminal at sunrise" width={1600} height={1000}/>
      <div className="hero-wash absolute inset-0"/>
      <div className="shell relative z-10 flex h-full flex-col justify-between py-10 md:py-14">
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-hero-foreground"><span className="h-px w-7 bg-signal"/> TRANSPORTATION & LOGISTICS / SIH 2026</div>
        <div className="max-w-3xl pb-4 md:pb-10">
          <div className="mb-5 inline-flex items-center gap-2 border border-hero-foreground/35 px-3 py-2 text-xs font-medium text-hero-foreground backdrop-blur-sm"><span className="h-1.5 w-1.5 rounded-full bg-signal"/> DECISION INTELLIGENCE FOR DRY BULK</div>
          <h1 className="font-display text-5xl leading-[1.03] font-semibold text-hero-foreground sm:text-6xl md:text-7xl">PESticides<span className="text-signal">.</span></h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-hero-foreground/90 md:text-xl">From freight uncertainty to a chartering decision you can explain.</p>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-hero-foreground/75 md:text-base">Forecast the market, find feasible vessels and compare the true landed cost of moving coal to India’s East Coast.</p>
          <div className="mt-8 flex flex-wrap gap-3"><PrototypeButton asChild size="lg" className="h-12 px-6"><Link to="/new-analysis">Plan a voyage <ArrowUpRight/></Link></PrototypeButton><PrototypeButton asChild size="lg" variant="outline" className="hero-outline h-12 px-6"><Link to="/dashboard">Explore dashboard <ArrowRight/></Link></PrototypeButton></div>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-3 border-t border-hero-foreground/25 pt-5 text-xs font-semibold uppercase tracking-wider text-hero-foreground/85"><span>03 origin countries</span><span>04 East Coast ports</span><span>03 vessel classes</span><span>01 explainable decision</span></div>
      </div>
    </section>
    <section className="border-b border-border bg-background py-17 md:py-22"><div className="shell"><div className="grid gap-8 md:grid-cols-[1fr_1.25fr] md:gap-20"><div><div className="eyebrow">THE PURPOSE</div><h2 className="section-title mt-4">The right ship.<br/><span className="text-accent">The right moment.</span></h2></div><div className="max-w-xl self-end"><p className="text-lg leading-relaxed text-muted-foreground">Freight forecasts alone don’t tell a procurement team what to do. PESticides connects the market outlook to physical port limits, vessel economics and contract risk—so every recommendation is usable, not just predictive.</p><div className="mt-7 flex flex-wrap gap-5 text-sm font-semibold"><span className="inline-flex items-center gap-2"><CheckCircle2 className="text-accent" size={17}/> Feasibility first</span><span className="inline-flex items-center gap-2"><CheckCircle2 className="text-accent" size={17}/> Costs you can audit</span></div></div></div></div></section>
    <section className="bg-secondary py-17 md:py-22"><div className="shell"><div className="eyebrow">HOW A DECISION TAKES SHAPE</div><div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end"><h2 className="section-title max-w-2xl">One connected journey.<br/>No black box.</h2><PrototypeButton asChild variant="outline"><Link to="/dashboard">See the dashboard <ArrowUpRight/></Link></PrototypeButton></div><div className="mt-10 grid gap-px border border-border bg-border md:grid-cols-4">{stages.map(s => <div key={s.number} className="bg-secondary p-6 md:min-h-64"><div className="flex items-start justify-between"><s.icon size={26} strokeWidth={1.7} className="text-accent"/><span className="font-mono text-xs text-muted-foreground">{s.number} / 04</span></div><h3 className="mt-11 font-display text-xl font-semibold">{s.title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.text}</p></div>)}</div></div></section>
    <section className="bg-primary py-15 text-primary-foreground"><div className="shell flex flex-col gap-8 md:flex-row md:items-center md:justify-between"><div><div className="text-xs font-bold uppercase tracking-widest text-signal">READY TO EXPLORE?</div><h2 className="mt-3 font-display text-3xl font-semibold md:text-4xl">Turn a shipment into a strategy.</h2><p className="mt-3 text-sm text-primary-foreground/70">Try the interactive prototype with an illustrative coal shipment.</p></div><PrototypeButton asChild size="lg" className="h-12 shrink-0"><Link to="/new-analysis">Start an analysis <ArrowUpRight/></Link></PrototypeButton></div></section>
  </>;
}
