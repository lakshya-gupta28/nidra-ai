import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  Activity,
  BrainCircuit,
  FileBarChart2,
  LayoutDashboard,
  Lightbulb,
  Moon,
  ShieldCheck,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { DISCLAIMER } from "@/lib/nidra-data";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/signal-processing", label: "Signal Processing", icon: SlidersHorizontal },
  { to: "/ai-analysis", label: "AI Analysis", icon: BrainCircuit },
  { to: "/insights", label: "Insights", icon: Lightbulb },
  { to: "/events", label: "Events", icon: Activity },
  { to: "/reports", label: "Reports", icon: FileBarChart2 },
  { to: "/privacy", label: "Privacy & Data", icon: ShieldCheck },
  { to: "/roles", label: "User Roles", icon: Users },
] as const;

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-xl bg-brand shadow-card">
        <Moon className="size-4.5 text-primary-foreground" strokeWidth={2.2} />
      </span>
      <span className="leading-tight">
        <span className="block text-base font-extrabold tracking-[0.14em]">NIDRA</span>
        {!compact && (
          <span className="block text-[10px] font-medium tracking-wide text-muted-foreground">
            Sleep Intelligence Platform
          </span>
        )}
      </span>
    </Link>
  );
}

export function AppShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3">
          <Brand compact />
          <nav className="scrollbar-none -mx-1 flex flex-1 items-center gap-1 overflow-x-auto px-1">
            {NAV.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                activeProps={{ className: "bg-secondary text-secondary-foreground" }}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Icon className="size-3.5" />
                {label}
              </Link>
            ))}
          </nav>
          <span className="hidden items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[11px] font-medium text-muted-foreground lg:inline-flex">
            <span className="size-1.5 animate-pulse-soft rounded-full bg-success" />
            Device connected
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4 animate-rise">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
        {children}
      </main>

      <footer className="mt-10 border-t border-border py-6">
        <p className="mx-auto max-w-7xl px-4 text-xs text-muted-foreground">{DISCLAIMER}</p>
      </footer>
    </div>
  );
}
