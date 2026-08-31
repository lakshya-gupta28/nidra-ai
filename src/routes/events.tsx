import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Activity, AlertTriangle, Move, SignalLow, Waves } from "lucide-react";
import { AppShell } from "@/components/nidra/AppShell";
import { events } from "@/lib/nidra-data";
import type { Severity } from "@/lib/nidra-data";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events & Monitoring — NIDRA" },
      {
        name: "description",
        content:
          "Timeline of detected artefacts, movement events, interruptions and signal quality drops.",
      },
      { property: "og:title", content: "Events & Monitoring — NIDRA" },
      {
        property: "og:description",
        content: "Severity-graded event detection across EEG, EOG and EMG channels.",
      },
    ],
  }),
  component: Events,
});

const SEVERITY: Record<Severity, string> = {
  Low: "bg-success/10 text-success",
  Medium: "bg-warning/15 text-warning",
  High: "bg-danger/10 text-danger",
};

const DOT: Record<Severity, string> = {
  Low: "bg-success",
  Medium: "bg-warning",
  High: "bg-danger",
};

const TYPE_ICON: Record<string, typeof Waves> = {
  "Signal Artefact": Waves,
  "Movement Event": Move,
  "Sleep Interruption": AlertTriangle,
  "Signal Quality Drop": SignalLow,
};

const FILTERS = ["All", "Low", "Medium", "High"] as const;

function Events() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const list = events.filter((e) => filter === "All" || e.severity === filter);

  return (
    <AppShell
      title="Events & Monitoring"
      subtitle="Automatically detected events for the session of 31 August"
      actions={
        <div className="flex rounded-lg border border-border p-0.5">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f ? "bg-secondary text-secondary-foreground" : "text-muted-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          ["Total events", String(events.length)],
          ["High severity", String(events.filter((e) => e.severity === "High").length)],
          ["Artefacts handled", "2"],
          ["Monitoring uptime", "99.4%"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className="mt-2 text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <section className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card">
        <h2 className="mb-6 flex items-center gap-2 font-semibold">
          <Activity className="size-4 text-violet" /> Event Timeline
        </h2>
        <ol className="relative space-y-4 border-l border-border pl-6">
          {list.map((e, i) => {
            const Icon = TYPE_ICON[e.type] ?? Waves;
            return (
              <li
                key={e.time + e.type}
                className="relative"
                style={{ animation: `rise .45s cubic-bezier(.16,1,.3,1) ${i * 60}ms both` }}
              >
                <span
                  className={`absolute -left-[31px] top-4 size-3 rounded-full ring-4 ring-card ${DOT[e.severity]}`}
                />
                <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-background/60 p-4 transition-colors hover:bg-muted/60">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-secondary">
                    <Icon className="size-4 text-secondary-foreground" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">{e.time}</span>
                      <span className="font-semibold">{e.type}</span>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                        {e.signal}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{e.description}</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${SEVERITY[e.severity]}`}
                  >
                    {e.severity}
                  </span>
                </div>
              </li>
            );
          })}
          {list.length === 0 && (
            <li className="py-6 text-sm text-muted-foreground">No events for this severity.</li>
          )}
        </ol>
      </section>
    </AppShell>
  );
}
