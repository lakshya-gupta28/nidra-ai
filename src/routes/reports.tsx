import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, FileBarChart2, Printer } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/nidra/AppShell";
import { Hypnogram, QualityTrendChart, WeeklyDurationChart } from "@/components/nidra/charts";
import { Button } from "@/components/ui/button";
import { STAGE_COLOR, stageDistribution, summaryMetrics } from "@/lib/nidra-data";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Nightly Sleep Report — NIDRA" },
      {
        name: "description",
        content:
          "Structured nightly sleep report with staging timeline, signal summary, metrics and weekly trends.",
      },
      { property: "og:title", content: "Nightly Sleep Report — NIDRA" },
      {
        property: "og:description",
        content: "Report format suitable for healthcare professionals and researchers.",
      },
    ],
  }),
  component: Reports,
});

const SIGNALS = [
  ["EEG · C4-A1", "256 Hz", "24.6 dB", "Good"],
  ["EEG · O2-A1", "256 Hz", "22.1 dB", "Good"],
  ["EOG · Right", "256 Hz", "19.4 dB", "Moderate"],
  ["EMG · Chin", "512 Hz", "21.8 dB", "Good"],
];

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <h2 className="mb-4 border-b border-border pb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Reports() {
  return (
    <AppShell
      title="Nightly Sleep Report"
      subtitle="Subject ID NDR-4471 · Session 31 Aug 2026 · Generated 06:42"
      actions={
        <>
          <Button size="sm" onClick={() => toast.success("Report export prepared (simulated).")}>
            <Download /> Export Report
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link to="/ai-analysis">View Detailed Analysis</Link>
          </Button>
          <Button size="sm" variant="ghost" onClick={() => toast("Print preview is simulated.")}>
            <Printer />
          </Button>
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="h-fit rounded-2xl border border-border bg-card p-4 shadow-card lg:sticky lg:top-24">
          <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            <FileBarChart2 className="size-3.5" /> Contents
          </p>
          <ul className="space-y-1 text-sm">
            {[
              ["summary", "Sleep Summary"],
              ["timeline", "Sleep Stage Timeline"],
              ["signals", "Physiological Signal Summary"],
              ["metrics", "Sleep Metrics"],
              ["ai", "AI Analysis Results"],
              ["trends", "Weekly Trends"],
            ].map(([id, label]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="block rounded-lg px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <div className="space-y-6">
          <Section id="summary" title="Sleep Summary">
            <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-5">
              {summaryMetrics.map((m) => (
                <div key={m.label} className="rounded-xl bg-muted/50 p-4">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{m.label}</p>
                  <p className="mt-2 text-xl font-bold">{m.value}</p>
                  <p className="text-[11px] text-muted-foreground">{m.sub}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="timeline" title="Sleep Stage Timeline">
            <Hypnogram />
          </Section>

          <Section id="signals" title="Physiological Signal Summary">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="py-2 font-medium">Channel</th>
                    <th className="py-2 font-medium">Sampling</th>
                    <th className="py-2 font-medium">SNR</th>
                    <th className="py-2 font-medium">Quality</th>
                  </tr>
                </thead>
                <tbody>
                  {SIGNALS.map((r) => (
                    <tr key={r[0]} className="border-b border-border last:border-0">
                      <td className="py-2.5 font-medium">{r[0]}</td>
                      <td className="py-2.5 font-mono text-xs text-muted-foreground">{r[1]}</td>
                      <td className="py-2.5 font-mono text-xs">{r[2]}</td>
                      <td className="py-2.5">{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section id="metrics" title="Sleep Metrics">
            <ul className="space-y-3">
              {stageDistribution.map((d) => (
                <li key={d.stage}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium">{d.stage}</span>
                    <span className="text-muted-foreground">
                      {d.percent}% · {d.minutes} min
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${d.percent}%`, background: STAGE_COLOR[d.stage] }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </Section>

          <Section id="ai" title="AI Analysis Results">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-brand p-5 text-primary-foreground">
                <p className="text-xs uppercase tracking-wide opacity-80">Dominant classified stage</p>
                <p className="mt-2 text-2xl font-bold">N2 – Light Sleep</p>
                <p className="mt-1 text-sm opacity-90">Mean epoch confidence 91.4%</p>
              </div>
              <ul className="space-y-2 text-sm">
                {[
                  ["Epochs classified", "886 / 922"],
                  ["Epochs rejected (artefact)", "36"],
                  ["Model", "NIDRA sequence classifier v2.4"],
                  ["Analysis mode", "On-device, offline"],
                ].map(([k, v]) => (
                  <li key={k} className="flex justify-between border-b border-border pb-2 last:border-0">
                    <span className="text-muted-foreground">{k}</span>
                    <span className="font-medium">{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Section>

          <Section id="trends" title="Weekly Trends">
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-medium">Sleep duration</p>
                <WeeklyDurationChart />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">Sleep quality</p>
                <QualityTrendChart />
              </div>
            </div>
          </Section>
        </div>
      </div>
    </AppShell>
  );
}
