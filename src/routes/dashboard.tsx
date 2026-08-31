import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Activity, CalendarDays, Gauge, Moon, SignalHigh, Timer } from "lucide-react";
import { AppShell } from "@/components/nidra/AppShell";
import { Waveform } from "@/components/nidra/Waveform";
import { Hypnogram, StageBars, StageDonut } from "@/components/nidra/charts";
import { Button } from "@/components/ui/button";
import { STAGE_COLOR, stageDistribution } from "@/lib/nidra-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Sleep Dashboard — NIDRA" },
      {
        name: "description",
        content: "Live EEG, EOG and EMG monitoring with hypnogram and sleep-stage distribution.",
      },
      { property: "og:title", content: "Sleep Dashboard — NIDRA" },
      {
        property: "og:description",
        content: "Live multimodal signals, hypnogram and sleep-stage distribution in one view.",
      },
    ],
  }),
  component: Dashboard,
});

const CARDS = [
  { label: "Current Sleep Stage", value: "N2 – Light Sleep", sub: "Epoch 142 · 94% confidence", icon: Moon },
  { label: "Sleep Duration", value: "7h 24m", sub: "Time in bed 8h 31m", icon: Timer },
  { label: "Sleep Efficiency", value: "87%", sub: "+4% vs. weekly average", icon: Gauge },
  { label: "Signal Quality", value: "Good", sub: "SNR 24.6 dB · 2 artefacts", icon: SignalHigh },
];

function Dashboard() {
  const [night, setNight] = useState("Last night · 31 Aug");
  const [view, setView] = useState<"donut" | "bars">("donut");

  return (
    <AppShell
      title="Sleep Monitoring Dashboard"
      subtitle="Simulated multimodal acquisition session · Device NDR-217"
      actions={
        <>
          <label className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <select
              value={night}
              onChange={(e) => setNight(e.target.value)}
              className="h-9 cursor-pointer appearance-none rounded-md border border-input bg-card pl-9 pr-8 text-sm shadow-card"
            >
              <option>Last night · 31 Aug</option>
              <option>30 Aug</option>
              <option>29 Aug</option>
              <option>Weekly aggregate</option>
            </select>
          </label>
          <Button variant="outline" size="sm">
            <Activity /> Live session
          </Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {CARDS.map(({ label, value, sub, icon: Icon }, i) => (
          <div
            key={label}
            className="rounded-2xl border border-border bg-card p-5 shadow-card"
            style={{ animation: `rise .5s cubic-bezier(.16,1,.3,1) ${i * 70}ms both` }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {label}
              </span>
              <Icon className="size-4 text-muted-foreground" />
            </div>
            <p className="mt-3 text-2xl font-bold">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Live Physiological Signals</h2>
              <p className="text-xs text-muted-foreground">Streaming at 256 Hz · {night}</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
              <span className="size-1.5 animate-pulse-soft rounded-full bg-success" />
              Signal quality: Good
            </span>
          </div>
          <div className="space-y-3">
            <Waveform kind="eeg" label="EEG · C4-A1" unit="µV · 0.3–35 Hz" />
            <Waveform kind="eog" label="EOG · Right / Left" unit="µV · 0.3–10 Hz" />
            <Waveform kind="emg" label="EMG · Chin" unit="µV · 10–100 Hz" />
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-semibold">Sleep Distribution</h2>
            <div className="flex rounded-lg border border-border p-0.5">
              {(["donut", "bars"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
                    view === v ? "bg-secondary text-secondary-foreground" : "text-muted-foreground"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          {view === "donut" ? <StageDonut /> : <StageBars />}
          <ul className="mt-4 space-y-2">
            {stageDistribution.map((d) => (
              <li key={d.stage} className="flex items-center gap-2 text-sm">
                <span className="size-2.5 rounded-full" style={{ background: STAGE_COLOR[d.stage] }} />
                <span className="font-medium">{d.stage}</span>
                <span className="ml-auto text-muted-foreground">
                  {d.percent}% · {d.minutes}m
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold">Sleep Stage Timeline</h2>
            <p className="text-xs text-muted-foreground">Hypnogram · 22:45 → 06:15</p>
          </div>
          <div className="flex flex-wrap gap-3 text-xs">
            {stageDistribution.map((d) => (
              <span key={d.stage} className="inline-flex items-center gap-1.5">
                <span className="size-2.5 rounded-full" style={{ background: STAGE_COLOR[d.stage] }} />
                {d.stage}
              </span>
            ))}
          </div>
        </div>
        <Hypnogram />
      </section>
    </AppShell>
  );
}
