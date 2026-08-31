import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ActivitySquare,
  ArrowRight,
  BrainCircuit,
  ChevronDown,
  LineChart,
  Radio,
  ShieldCheck,
  SlidersHorizontal,
  Waves,
} from "lucide-react";
import { Brand } from "@/components/nidra/AppShell";
import { Waveform } from "@/components/nidra/Waveform";
import { Button } from "@/components/ui/button";
import { DISCLAIMER } from "@/lib/nidra-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NIDRA — AI-Powered Sleep Detection & Analysis" },
      {
        name: "description",
        content:
          "NIDRA turns EEG, EOG and EMG signals into AI-assisted sleep staging, metrics and personalized insights.",
      },
      { property: "og:title", content: "NIDRA — AI-Powered Sleep Detection & Analysis" },
      {
        property: "og:description",
        content:
          "Multimodal signal processing, AI sleep classification and pattern analysis in one privacy-focused platform.",
      },
    ],
  }),
  component: Landing,
});

const FLOW = [
  { label: "EEG + EOG + EMG", icon: Waves },
  { label: "Signal Processing", icon: SlidersHorizontal },
  { label: "AI Analysis", icon: BrainCircuit },
  { label: "Sleep Classification", icon: ActivitySquare },
  { label: "Personalized Insights", icon: LineChart },
];

const FEATURES = [
  {
    title: "Multimodal Signal Analysis",
    body: "Synchronised EEG, EOG and EMG channels processed together.",
    icon: Waves,
  },
  {
    title: "Intelligent Signal Processing",
    body: "Quality scoring, SNR evaluation, artefact detection and filtering.",
    icon: SlidersHorizontal,
  },
  {
    title: "AI Sleep Classification",
    body: "Epoch-level staging across Awake, N1, N2, N3 and REM.",
    icon: BrainCircuit,
  },
  {
    title: "Sleep Pattern Analysis",
    body: "Long-term trends, consistency and night-to-night changes.",
    icon: LineChart,
  },
  { title: "Real-Time Monitoring", body: "Live waveforms, events and signal health.", icon: Radio },
  {
    title: "Privacy-Focused Processing",
    body: "Local processing, encrypted storage and controlled access.",
    icon: ShieldCheck,
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Brand />
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/signal-processing">Start Analysis</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-soft">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="size-1.5 animate-pulse-soft rounded-full bg-teal" />
              AI-assisted sleep intelligence prototype
            </span>
            <h1 className="mt-5 text-6xl font-extrabold tracking-[0.16em] text-brand sm:text-7xl">
              NIDRA
            </h1>
            <p className="mt-3 text-xl font-semibold sm:text-2xl">
              AI-Powered Sleep Detection & Analysis System
            </p>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Transforming physiological signals into intelligent sleep insights through AI-driven
              analysis.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/ai-analysis">
                  Start Analysis <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/dashboard">View Dashboard</Link>
              </Button>
            </div>
            <dl className="mt-9 grid max-w-lg grid-cols-3 gap-4">
              {[
                ["94%", "Staging confidence"],
                ["3", "Signal modalities"],
                ["30s", "Epoch resolution"],
              ].map(([v, l]) => (
                <div key={l} className="rounded-xl border border-border bg-card p-3 shadow-card">
                  <dt className="text-xl font-bold">{v}</dt>
                  <dd className="text-[11px] text-muted-foreground">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="space-y-3 rounded-3xl border border-border bg-card/80 p-5 shadow-float backdrop-blur">
            <div className="flex items-center justify-between px-1">
              <span className="text-sm font-semibold">Live acquisition preview</span>
              <span className="font-mono text-[11px] text-muted-foreground">256 Hz</span>
            </div>
            <Waveform kind="eeg" label="EEG · C4-A1" unit="µV" />
            <Waveform kind="eog" label="EOG · Right" unit="µV" />
            <Waveform kind="emg" label="EMG · Chin" unit="µV" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-center text-2xl font-bold">How NIDRA works</h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          From raw physiology to interpretable insight.
        </p>
        <div className="mx-auto mt-10 max-w-md space-y-1">
          {FLOW.map(({ label, icon: Icon }, i) => (
            <div key={label}>
              <div
                className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5 shadow-card transition-transform hover:-translate-y-0.5"
                style={{ animation: `rise .6s cubic-bezier(.16,1,.3,1) ${i * 90}ms both` }}
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary">
                  <Icon className="size-4.5 text-secondary-foreground" />
                </span>
                <span className="font-semibold">{label}</span>
              </div>
              {i < FLOW.length - 1 && (
                <div className="flex justify-center py-1">
                  <ChevronDown className="size-4 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-muted/40 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold">Platform capabilities</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ title, body, icon: Icon }) => (
              <article
                key={title}
                className="rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-float"
              >
                <span className="grid size-10 place-items-center rounded-xl bg-brand">
                  <Icon className="size-5 text-primary-foreground" />
                </span>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Brand />
          <nav className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <Link to="/insights" className="hover:text-foreground">
              Insights
            </Link>
            <Link to="/reports" className="hover:text-foreground">
              Reports
            </Link>
            <Link to="/privacy" className="hover:text-foreground">
              Privacy & Data
            </Link>
            <Link to="/roles" className="hover:text-foreground">
              User Roles
            </Link>
          </nav>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">{DISCLAIMER}</p>
      </footer>
    </div>
  );
}
