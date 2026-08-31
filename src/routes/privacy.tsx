import { createFileRoute } from "@tanstack/react-router";
import {
  ChevronDown,
  Cpu,
  Database,
  KeyRound,
  LayoutDashboard,
  Lock,
  RefreshCcw,
  ShieldCheck,
  Watch,
} from "lucide-react";
import { AppShell } from "@/components/nidra/AppShell";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy & Data — NIDRA" },
      {
        name: "description",
        content:
          "Local signal processing, encrypted storage, controlled access and secure synchronization of physiological data.",
      },
      { property: "og:title", content: "Privacy & Data — NIDRA" },
      {
        property: "og:description",
        content: "How NIDRA handles physiological data securely and privately.",
      },
    ],
  }),
  component: Privacy,
});

const FEATURES = [
  {
    title: "Local Signal Processing",
    body: "Raw EEG, EOG and EMG are filtered and staged on-device before anything leaves the sensor hub.",
    icon: Cpu,
  },
  {
    title: "Encrypted Data Storage",
    body: "Session records are stored with AES-256 at rest and per-user key isolation.",
    icon: Lock,
  },
  {
    title: "Controlled User Access",
    body: "Role-scoped permissions with explicit, revocable consent for clinicians and researchers.",
    icon: KeyRound,
  },
  {
    title: "Secure Data Synchronization",
    body: "TLS 1.3 transport with signed payloads and integrity verification on every sync.",
    icon: RefreshCcw,
  },
];

const FLOW = [
  { label: "Wearable Device", detail: "Signal acquisition · 256 Hz", icon: Watch },
  { label: "Secure Processing", detail: "On-device filtering & staging", icon: Cpu },
  { label: "Encrypted Storage", detail: "AES-256 at rest", icon: Database },
  { label: "User Dashboard", detail: "Authenticated access only", icon: LayoutDashboard },
];

const CONTROLS = [
  ["Share reports with my clinician", true],
  ["Contribute anonymised data to research", false],
  ["Cloud backup of processed sessions", true],
  ["Retain raw signal beyond 30 days", false],
] as const;

function Privacy() {
  return (
    <AppShell
      title="Privacy & Data"
      subtitle="Physiological data is sensitive — NIDRA is designed around minimal, consented data movement"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {FEATURES.map(({ title, body, icon: Icon }, i) => (
          <article
            key={title}
            className="rounded-2xl border border-border bg-card p-5 shadow-card"
            style={{ animation: `rise .5s cubic-bezier(.16,1,.3,1) ${i * 70}ms both` }}
          >
            <span className="grid size-10 place-items-center rounded-xl bg-brand">
              <Icon className="size-5 text-primary-foreground" />
            </span>
            <h3 className="mt-4 font-semibold">{title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="font-semibold">Secure data flow</h2>
          <p className="mb-5 text-xs text-muted-foreground">Every hop is authenticated and encrypted.</p>
          {FLOW.map(({ label, detail, icon: Icon }, i) => (
            <div key={label}>
              <div className="flex items-center gap-3 rounded-xl border border-border bg-background/60 px-4 py-3">
                <span className="grid size-9 place-items-center rounded-lg bg-secondary">
                  <Icon className="size-4 text-secondary-foreground" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="text-xs text-muted-foreground">{detail}</p>
                </div>
                <ShieldCheck className="ml-auto size-4 text-success" />
              </div>
              {i < FLOW.length - 1 && (
                <div className="flex justify-center py-1">
                  <ChevronDown className="size-4 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="font-semibold">Your data controls</h2>
          <p className="mb-5 text-xs text-muted-foreground">
            Consent is granular and can be withdrawn at any time.
          </p>
          <ul className="space-y-3">
            {CONTROLS.map(([label, on]) => (
              <li
                key={label}
                className="flex items-center justify-between gap-4 rounded-xl border border-border px-4 py-3"
              >
                <span className="text-sm font-medium">{label}</span>
                <Switch defaultChecked={on} />
              </li>
            ))}
          </ul>
          <div className="mt-5 rounded-xl bg-muted/60 p-4 text-xs text-muted-foreground">
            Retention policy: processed sleep metrics are kept for 12 months; raw waveform buffers are
            discarded after 30 days unless explicitly retained.
          </div>
        </section>
      </div>
    </AppShell>
  );
}
