import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  BrainCircuit,
  ChevronDown,
  Filter,
  Gauge,
  Grid3x3,
  Play,
  Ruler,
  Sparkles,
  Waves,
} from "lucide-react";
import { AppShell } from "@/components/nidra/AppShell";
import { Waveform } from "@/components/nidra/Waveform";
import { Button } from "@/components/ui/button";
import { pipelineSteps, signalQuality } from "@/lib/nidra-data";

export const Route = createFileRoute("/signal-processing")({
  head: () => ({
    meta: [
      { title: "Signal Processing — NIDRA" },
      {
        name: "description",
        content:
          "Visual processing pipeline from raw EEG/EOG/EMG through filtering, segmentation and feature extraction.",
      },
      { property: "og:title", content: "Signal Processing — NIDRA" },
      {
        property: "og:description",
        content: "Quality checks, artefact detection, filtering and feature extraction pipeline.",
      },
    ],
  }),
  component: SignalProcessing,
});

const ICONS: Record<string, typeof Waves> = {
  waves: Waves,
  gauge: Gauge,
  alert: AlertTriangle,
  filter: Filter,
  grid: Grid3x3,
  scale: Ruler,
  sparkles: Sparkles,
  brain: BrainCircuit,
};

const STATUS_STYLE: Record<string, string> = {
  Excellent: "bg-success/10 text-success",
  Good: "bg-teal/15 text-teal-foreground",
  Moderate: "bg-warning/15 text-warning",
  Poor: "bg-danger/10 text-danger",
};

function SignalProcessing() {
  const [active, setActive] = useState(3);

  return (
    <AppShell
      title="Signal Processing"
      subtitle="Deterministic pre-processing chain applied to every 30-second epoch"
      actions={
        <Button size="sm">
          <Play /> Run pipeline
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="font-semibold">Processing Pipeline</h2>
          <p className="mb-5 text-xs text-muted-foreground">Select a stage to inspect it.</p>
          <div>
            {pipelineSteps.map((step, i) => {
              const Icon = ICONS[step.icon];
              const isActive = active === i;
              return (
                <div key={step.title}>
                  <button
                    onClick={() => setActive(i)}
                    className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
                      isActive
                        ? "border-transparent bg-brand text-primary-foreground shadow-float"
                        : "border-border bg-card hover:bg-muted"
                    }`}
                  >
                    <span
                      className={`grid size-8 shrink-0 place-items-center rounded-lg ${
                        isActive ? "bg-primary-foreground/15" : "bg-secondary"
                      }`}
                    >
                      <Icon className="size-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">{step.title}</span>
                      <span
                        className={`block truncate text-xs ${isActive ? "opacity-80" : "text-muted-foreground"}`}
                      >
                        {step.detail}
                      </span>
                    </span>
                    <span className="ml-auto font-mono text-[11px] opacity-70">
                      0{i + 1}
                    </span>
                  </button>
                  {i < pipelineSteps.length - 1 && (
                    <div className="flex justify-center py-0.5">
                      <ChevronDown className="size-3.5 text-muted-foreground" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-semibold">Stage output preview</h2>
            <p className="mb-4 text-xs text-muted-foreground">
              {pipelineSteps[active].title} · {pipelineSteps[active].detail}
            </p>
            <div className="space-y-3">
              <Waveform kind="eeg" label="EEG · processed" unit="z-scored" />
              <Waveform kind="emg" label="EMG · processed" unit="RMS envelope" />
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            {signalQuality.map((q) => (
              <div key={q.label} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {q.label}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_STYLE[q.status]}`}
                  >
                    {q.status}
                  </span>
                </div>
                <p className="mt-3 text-xl font-bold">{q.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{q.detail}</p>
              </div>
            ))}
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-semibold">Signal Quality Scale</h2>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {(["Excellent", "Good", "Moderate", "Poor"] as const).map((s) => (
                <div
                  key={s}
                  className={`rounded-xl px-3 py-3 text-center text-xs font-semibold ${STATUS_STYLE[s]} ${
                    s === "Good" ? "ring-2 ring-ring" : ""
                  }`}
                >
                  {s}
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Current session classified as <span className="font-semibold text-foreground">Good</span>{" "}
              — 96% of epochs retained after artefact handling.
            </p>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
