import { createFileRoute } from "@tanstack/react-router";
import { Info, Sparkles, TrendingUp, TriangleAlert } from "lucide-react";
import { AppShell } from "@/components/nidra/AppShell";
import {
  BedtimeChart,
  QualityTrendChart,
  StageBars,
  WeeklyDurationChart,
} from "@/components/nidra/charts";
import { insights, summaryMetrics } from "@/lib/nidra-data";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Sleep Insights — NIDRA" },
      {
        name: "description",
        content: "Sleep metrics, weekly pattern analysis and AI-generated informational insights.",
      },
      { property: "og:title", content: "Sleep Insights — NIDRA" },
      {
        property: "og:description",
        content: "Duration, efficiency, deep sleep, REM and long-term sleep trends.",
      },
    ],
  }),
  component: Insights,
});

const TONE = {
  positive: { icon: TrendingUp, cls: "bg-success/10 text-success" },
  attention: { icon: TriangleAlert, cls: "bg-warning/15 text-warning" },
  neutral: { icon: Info, cls: "bg-teal/15 text-teal-foreground" },
};

function Insights() {
  return (
    <AppShell title="Sleep Insights" subtitle="Night of 31 August · compared against a 7-night window">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {summaryMetrics.map((m, i) => (
          <div
            key={m.label}
            className="rounded-2xl border border-border bg-card p-5 shadow-card"
            style={{ animation: `rise .5s cubic-bezier(.16,1,.3,1) ${i * 60}ms both` }}
          >
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {m.label}
            </p>
            <p className="mt-3 text-2xl font-bold">{m.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{m.sub}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-lg font-semibold">Sleep Pattern Analysis</h2>
      <div className="mt-4 grid gap-6 lg:grid-cols-2">
        {[
          ["Weekly Sleep Duration", <WeeklyDurationChart key="a" />],
          ["Sleep Quality Trend", <QualityTrendChart key="b" />],
          ["Sleep Stage Distribution", <StageBars key="c" />],
          ["Bedtime Consistency", <BedtimeChart key="d" />],
        ].map(([title, chart]) => (
          <section key={title as string} className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h3 className="mb-4 font-semibold">{title as string}</h3>
            {chart as React.ReactNode}
          </section>
        ))}
      </div>

      <h2 className="mt-10 flex items-center gap-2 text-lg font-semibold">
        <Sparkles className="size-4 text-violet" /> Personalized AI Insights
      </h2>
      <p className="text-sm text-muted-foreground">
        Informational AI-assisted observations — not a clinical assessment.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {insights.map((ins) => {
          const { icon: Icon, cls } = TONE[ins.tone];
          return (
            <article
              key={ins.title}
              className="rounded-2xl border border-border bg-card p-5 shadow-card transition-transform hover:-translate-y-0.5"
            >
              <div className="flex items-start gap-3">
                <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${cls}`}>
                  <Icon className="size-4" />
                </span>
                <div>
                  <h3 className="font-semibold">{ins.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{ins.body}</p>
                  <span className="mt-3 inline-block rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Informational AI insight
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </AppShell>
  );
}
