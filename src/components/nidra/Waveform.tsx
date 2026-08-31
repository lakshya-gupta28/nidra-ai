import { useEffect, useRef, useState } from "react";

type Kind = "eeg" | "eog" | "emg";

const CONFIG: Record<Kind, { amp: number; freq: number; noise: number; speed: number }> = {
  eeg: { amp: 13, freq: 0.22, noise: 5.5, speed: 0.09 },
  eog: { amp: 18, freq: 0.055, noise: 1.6, speed: 0.05 },
  emg: { amp: 5, freq: 0.9, noise: 8, speed: 0.16 },
};

function build(kind: Kind, phase: number, width = 600, height = 80) {
  const { amp, freq, noise } = CONFIG[kind];
  const mid = height / 2;
  const pts: string[] = [];
  for (let x = 0; x <= width; x += 3) {
    const t = x * freq + phase;
    const base = Math.sin(t) * amp + Math.sin(t * 0.37 + 1.1) * amp * 0.5;
    const jitter = Math.sin(t * 5.3 + Math.cos(t * 2.1) * 3) * noise;
    const burst = kind === "emg" ? Math.max(0, Math.sin(t * 0.06)) ** 6 * 22 : 0;
    const y = mid - (base + jitter + burst * Math.sin(t * 9));
    pts.push(`${x},${y.toFixed(2)}`);
  }
  return `M${pts.join(" L")}`;
}

export function Waveform({
  kind,
  label,
  unit,
  live = true,
}: {
  kind: Kind;
  label: string;
  unit: string;
  live?: boolean;
}) {
  const [phase, setPhase] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!live) return;
    let p = 0;
    const tick = () => {
      p += CONFIG[kind].speed;
      setPhase(p);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [kind, live]);

  const color = `var(--color-${kind})`;

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full" style={{ background: color }} />
          <span className="text-sm font-semibold">{label}</span>
        </div>
        <span className="font-mono text-[11px] text-muted-foreground">{unit}</span>
      </div>
      <div className="relative h-20 overflow-hidden rounded-lg bg-muted/40">
        <svg viewBox="0 0 600 80" preserveAspectRatio="none" className="h-full w-full">
          <defs>
            <linearGradient id={`fade-${kind}`} x1="0" x2="1">
              <stop offset="0" stopColor={color} stopOpacity="0.15" />
              <stop offset="0.15" stopColor={color} stopOpacity="1" />
              <stop offset="1" stopColor={color} stopOpacity="1" />
            </linearGradient>
          </defs>
          {[20, 40, 60].map((y) => (
            <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="var(--color-border)" strokeWidth="0.5" />
          ))}
          <path
            d={build(kind, phase)}
            fill="none"
            stroke={`url(#fade-${kind})`}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
