import { createFileRoute } from "@tanstack/react-router";
import { Activity, BrainCircuit, Eye, Sparkles, Zap } from "lucide-react";
import { AppShell } from "@/components/nidra/AppShell";
import { Waveform } from "@/components/nidra/Waveform";
import { STAGE_COLOR, stageConfidence } from "@/lib/nidra-data";

export const Route = createFileRoute("/ai-analysis")({
  head: () => ({
    meta: [
      { title: "AI Sleep Analysis — NIDRA" },
      {
        name: "description",
        content:
          "Epoch-level AI sleep-stage classification with confidence levels across Awake, N1, N2, N3 and REM.",
      },
      { property: "og:title", content: "AI Sleep Analysis — NIDRA" },
      {
        property: "og:description",
        content: "Detected stage, model confidence and extracted signal features.",
      },
    ],
  }),
  component: AIAnalysis,
});

const CARDS = [
  {
    title: "EEG Activity",
    icon: BrainCircuit,
    rows: [
      ["Dominant rhythm", "Theta 4–7 Hz"],
      ["Sleep spindles", "6 per epoch"],
      ["K-complexes", "Present"],
      ["Delta power", "18%"],
    ],
  },
  {
    title: "Eye Movement Activity",
    icon: Eye,
    rows: [
      ["Rapid movements", "None detected"],
      ["Slow rolling", "Low"],
      ["Blink rate", "0.2 /min"],
      ["EOG correlation", "-0.71"],
    ],
  },
  {
    title: "Muscle Activity",
    icon: Zap,
    rows: [
      ["Chin EMG tone", "Reduced"],
      ["RMS amplitude", "4.8 µV"],
      ["Bursts", "1 per epoch"],
      ["Atonia index", "0.62"],
    ],
  },
  {
    title: "Extracted Signal Features",
    icon: Sparkles,
    rows: [
      ["Spectral entropy", "0.74"],
      ["Hjorth mobility", "0.41"],
      ["Band-power ratio", "1.86"],
      ["Feature vector", "128-dim"],
    ],
  },
];

function AIAnalysis() {
  return (
    <AppShell
      title="AI Sleep Analysis"
      subtitle="Epoch 142 · 02:14:30 – 02:15:00 · Sequence classifier v2.4"
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <section className="rounded-3xl bg-brand p-7 text-primary-foreground shadow-float animate-rise">
          <span className="text-xs font-medium uppercase tracking-[0.18em] opacity-80">
            Detected Sleep Stage
          </span>
          <p className="mt-3 text-4xl font-extrabold">N2</p>
          <p className="text-lg font-medium opacity-90">Light Sleep</p>

          <div className="mt-7">
            <div className="flex items-end justify-between">
              <span className="text-xs uppercase tracking-wide opacity-80">AI Confidence</span>
              <span className="text-3xl font-bold">94%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-primary-foreground/20">
              <div className="h-full rounded-full bg-primary-foreground transition-all duration-700" style={{ width: "94%" }} />
            </div>
          </div>

          <dl className="mt-7 grid grid-cols-2 gap-3 text-sm">
            {[
              ["Epochs analysed", "886"],
              ["Model latency", "38 ms"],
              ["Channels used", "3"],
              ["Artefact rejected", "4%"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-primary-foreground/10 p-3">
                <dt className="text-[11px] opacity-80">{k}</dt>
                <dd className="text-base font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="font-semibold">Classification confidence by stage</h2>
          <p className="text-xs text-muted-foreground">Softmax distribution for the current epoch</p>
          <ul className="mt-6 space-y-4">
            {stageConfidence.map((s) => (
              <li key={s.stage}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium">
                    <span className="size-2.5 rounded-full" style={{ background: STAGE_COLOR[s.stage] }} />
                    {s.stage}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">{s.confidence}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${s.confidence}%`, background: STAGE_COLOR[s.stage] }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-6 rounded-xl bg-muted/60 p-3 text-xs text-muted-foreground">
            <Activity className="mr-1 inline size-3.5" />
            Confidence values are model outputs on simulated data and are informational only.
          </p>
        </section>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {CARDS.map(({ title, icon: Icon, rows }) => (
          <section key={title} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-lg bg-secondary">
                <Icon className="size-4 text-secondary-foreground" />
              </span>
              <h3 className="text-sm font-semibold">{title}</h3>
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              {rows.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-2 border-b border-border pb-2 last:border-0">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>

      <section className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card">
        <h2 className="mb-4 font-semibold">Input signals for this epoch</h2>
        <div className="grid gap-3 lg:grid-cols-3">
          <Waveform kind="eeg" label="EEG" unit="µV" />
          <Waveform kind="eog" label="EOG" unit="µV" />
          <Waveform kind="emg" label="EMG" unit="µV" />
        </div>
      </section>
    </AppShell>
  );
}
