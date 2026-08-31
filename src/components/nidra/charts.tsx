import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { STAGE_COLOR, STAGE_ORDER, hypnogram, stageDistribution, weeklySleep } from "@/lib/nidra-data";
import type { Stage } from "@/lib/nidra-data";

const axis = {
  stroke: "var(--color-border)",
  tick: { fill: "var(--color-muted-foreground)", fontSize: 11 },
  tickLine: false,
  axisLine: false,
} as const;

const tooltipStyle = {
  contentStyle: {
    borderRadius: 12,
    border: "1px solid var(--color-border)",
    background: "var(--color-card)",
    fontSize: 12,
    boxShadow: "var(--shadow-card)",
  },
} as const;

export function Hypnogram() {
  const [hover, setHover] = useState<number | null>(null);
  const w = 960;
  const h = 200;
  const stepX = w / (hypnogram.length - 1);
  const rowH = h / STAGE_ORDER.length;
  const y = (level: number) => level * rowH + rowH / 2;

  const path = hypnogram
    .map((p, i) => {
      const x = i * stepX;
      const prev = hypnogram[i - 1];
      return i === 0
        ? `M${x},${y(p.level)}`
        : `L${x},${y(prev.level)} L${x},${y(p.level)}`;
    })
    .join(" ");

  const active = hover !== null ? hypnogram[hover] : null;

  return (
    <div>
      <div className="flex items-start gap-3">
        <div className="flex flex-col justify-between pt-1 text-[11px] font-medium text-muted-foreground" style={{ height: 200 }}>
          {STAGE_ORDER.map((s) => (
            <span key={s} className="flex h-[40px] items-center">
              {s}
            </span>
          ))}
        </div>
        <div className="relative flex-1">
          <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 200 }} preserveAspectRatio="none">
            {STAGE_ORDER.map((s, i) => (
              <rect
                key={s}
                x="0"
                y={i * rowH}
                width={w}
                height={rowH}
                fill={i % 2 ? "var(--color-muted)" : "transparent"}
                opacity="0.5"
              />
            ))}
            <path d={path} fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinejoin="round" />
            {hypnogram.map((p, i) => (
              <g key={i}>
                <circle
                  cx={i * stepX}
                  cy={y(p.level)}
                  r={hover === i ? 6 : 3.5}
                  fill={STAGE_COLOR[p.stage as Stage]}
                  className="transition-all"
                />
                <rect
                  x={i * stepX - stepX / 2}
                  y="0"
                  width={stepX}
                  height={h}
                  fill="transparent"
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                />
              </g>
            ))}
          </svg>
          <div className="mt-1 flex justify-between font-mono text-[10px] text-muted-foreground">
            {hypnogram
              .filter((_, i) => i % 6 === 0)
              .map((p) => (
                <span key={p.time}>{p.time}</span>
              ))}
          </div>
        </div>
      </div>
      <div className="mt-3 h-6 text-sm">
        {active ? (
          <span className="font-medium">
            <span className="font-mono text-muted-foreground">{active.time}</span> · {active.stage}
          </span>
        ) : (
          <span className="text-muted-foreground">Hover the hypnogram to inspect each 15-minute epoch.</span>
        )}
      </div>
    </div>
  );
}

export function StageDonut() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={stageDistribution}
          dataKey="percent"
          nameKey="stage"
          innerRadius={62}
          outerRadius={95}
          paddingAngle={3}
          stroke="none"
        >
          {stageDistribution.map((d) => (
            <Cell key={d.stage} fill={STAGE_COLOR[d.stage]} />
          ))}
        </Pie>
        <Tooltip {...tooltipStyle} formatter={(v: number, n) => [`${v}%`, n as string]} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function StageBars() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={stageDistribution} margin={{ left: -20 }}>
        <XAxis dataKey="stage" {...axis} />
        <YAxis {...axis} unit="%" />
        <Tooltip {...tooltipStyle} cursor={{ fill: "var(--color-muted)" }} />
        <Bar dataKey="percent" radius={[8, 8, 0, 0]}>
          {stageDistribution.map((d) => (
            <Cell key={d.stage} fill={STAGE_COLOR[d.stage]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function WeeklyDurationChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={weeklySleep} margin={{ left: -22 }}>
        <XAxis dataKey="day" {...axis} />
        <YAxis {...axis} unit="h" />
        <Tooltip {...tooltipStyle} cursor={{ fill: "var(--color-muted)" }} />
        <Bar dataKey="hours" fill="var(--color-chart-1)" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function QualityTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={weeklySleep} margin={{ left: -22 }}>
        <defs>
          <linearGradient id="q" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-violet)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--color-violet)" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <XAxis dataKey="day" {...axis} />
        <YAxis {...axis} domain={[50, 100]} />
        <Tooltip {...tooltipStyle} />
        <Area
          dataKey="quality"
          stroke="var(--color-violet)"
          strokeWidth={2.5}
          fill="url(#q)"
          type="monotone"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function BedtimeChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={weeklySleep} margin={{ left: -22 }}>
        <XAxis dataKey="day" {...axis} />
        <YAxis {...axis} domain={[22, 24.5]} tickFormatter={(v: number) => `${Math.floor(v % 24)}h`} />
        <Tooltip {...tooltipStyle} formatter={(v: number) => [`${Math.floor(v % 24)}:${String(Math.round((v % 1) * 60)).padStart(2, "0")}`, "Bedtime"]} />
        <Line
          dataKey="bedtime"
          stroke="var(--color-teal)"
          strokeWidth={2.5}
          dot={{ r: 4, fill: "var(--color-teal)" }}
          type="monotone"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
