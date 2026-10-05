import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowUpRight, Anchor, LayoutDashboard, Menu, Plus, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { PrototypeButton } from "@/components/ui/prototype-button";

export function SiteShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: s => s.location.pathname });
  return <div className="min-h-screen bg-background text-foreground">
    <header className="site-header">
      <div className="shell flex h-18 items-center justify-between gap-5">
        <Link to="/" className="brand" onClick={() => setOpen(false)} aria-label="Charterwise home"><span className="brand-icon"><Anchor size={19} strokeWidth={2.3}/></span><span>Charterwise<span className="brand-dot">.</span></span></Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground" aria-label="Main navigation">
          <Link to="/" className={path === "/" ? "nav-current" : "nav-link"}>Overview</Link>
          <Link to="/dashboard" className={path === "/dashboard" ? "nav-current" : "nav-link"}>Dashboard</Link>
          <Link to="/new-analysis" className={path === "/new-analysis" ? "nav-current" : "nav-link"}>New analysis</Link>
        </nav>
        <div className="hidden md:flex items-center gap-4"><span className="text-xs font-semibold uppercase text-muted-foreground tracking-widest">SIH 2026 · Prototype</span><PrototypeButton asChild className="h-10 px-5"><Link to="/new-analysis">Start analysis <ArrowUpRight size={16}/></Link></PrototypeButton></div>
        <PrototypeButton variant="ghost" size="icon" className="md:hidden" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</PrototypeButton>
      </div>
      {open && <nav className="mobile-nav" aria-label="Mobile navigation"><Link to="/" onClick={() => setOpen(false)}>Overview</Link><Link to="/dashboard" onClick={() => setOpen(false)}><LayoutDashboard size={17}/> Dashboard</Link><Link to="/new-analysis" onClick={() => setOpen(false)}><Plus size={17}/> New analysis</Link></nav>}
    </header>
    <main>{children}</main>
    <footer className="border-t border-border py-8"><div className="shell flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground"><span>© 2026 Charterwise · Intelligent freight decision support</span><span>SIH Problem Statement 26006 · Frontend demonstration</span></div></footer>
  </div>;
}
