import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Cpu, Microscope, Server, Stethoscope, User } from "lucide-react";
import { AppShell } from "@/components/nidra/AppShell";

export const Route = createFileRoute("/roles")({
  head: () => ({
    meta: [
      { title: "User Roles — NIDRA" },
      {
        name: "description",
        content:
          "Role-based interfaces for users, healthcare professionals, researchers and system administrators.",
      },
      { property: "og:title", content: "User Roles — NIDRA" },
      {
        property: "og:description",
        content: "Scoped access for every NIDRA persona, from personal dashboards to system monitoring.",
      },
    ],
  }),
  component: Roles,
});

const ROLES = [
  {
    id: "user",
    name: "User",
    icon: User,
    tagline: "Understand your own sleep",
    features: ["Personal Sleep Dashboard", "Sleep Reports", "Personalized Insights"],
    stats: [
      ["Sessions", "128"],
      ["Avg. efficiency", "84%"],
      ["Reports", "26"],
    ],
  },
  {
    id: "clinician",
    name: "Healthcare Professional",
    icon: Stethoscope,
    tagline: "Review authorized patient data",
    features: ["Authorized Patient Reports", "Sleep Pattern Analysis", "Detailed Signal Overview"],
    stats: [
      ["Patients", "42"],
      ["Pending reviews", "7"],
      ["Consents active", "39"],
    ],
  },
  {
    id: "researcher",
    name: "Researcher",
    icon: Microscope,
    tagline: "Study consented cohorts",
    features: ["Consent-Based Data Access", "Signal Analysis", "Research Trends"],
    stats: [
      ["Cohorts", "5"],
      ["Consented records", "1,284"],
      ["Exports", "18"],
    ],
  },
  {
    id: "admin",
    name: "System Administrator",
    icon: Server,
    tagline: "Operate the platform",
    features: ["User Management", "Device Management", "System Monitoring"],
    stats: [
      ["Active users", "312"],
      ["Devices online", "268"],
      ["Uptime", "99.9%"],
    ],
  },
];

function Roles() {
  const [active, setActive] = useState(ROLES[0].id);
  const role = ROLES.find((r) => r.id === active)!;
  const Icon = role.icon;

  return (
    <AppShell
      title="User Roles"
      subtitle="Every persona sees only the data their role and consent scope permits"
    >
      <div className="flex flex-wrap gap-2">
        {ROLES.map((r) => (
          <button
            key={r.id}
            onClick={() => setActive(r.id)}
            className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
              active === r.id
                ? "border-transparent bg-brand text-primary-foreground shadow-float"
                : "border-border bg-card text-muted-foreground hover:bg-muted"
            }`}
          >
            <r.icon className="size-4" />
            {r.name}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <section
          key={role.id}
          className="rounded-2xl border border-border bg-card p-6 shadow-card animate-rise"
        >
          <span className="grid size-11 place-items-center rounded-xl bg-brand">
            <Icon className="size-5 text-primary-foreground" />
          </span>
          <h2 className="mt-4 text-xl font-bold">{role.name}</h2>
          <p className="text-sm text-muted-foreground">{role.tagline}</p>
          <ul className="mt-5 space-y-2.5">
            {role.features.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm">
                <span className="grid size-5 place-items-center rounded-full bg-success/15">
                  <Check className="size-3 text-success" />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {role.stats.map(([k, v]) => (
              <div key={k} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{k}</p>
                <p className="mt-2 text-2xl font-bold">{v}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h3 className="mb-4 font-semibold">Access matrix</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="py-2 font-medium">Capability</th>
                    {ROLES.map((r) => (
                      <th key={r.id} className="py-2 text-center font-medium">
                        {r.name.split(" ")[0]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Own sleep dashboard", [true, false, false, false]],
                    ["Patient reports", [false, true, false, false]],
                    ["Raw signal review", [false, true, true, false]],
                    ["Cohort trends", [false, false, true, false]],
                    ["Device & user management", [false, false, false, true]],
                  ].map(([label, flags]) => (
                    <tr key={label as string} className="border-b border-border last:border-0">
                      <td className="py-2.5">{label as string}</td>
                      {(flags as boolean[]).map((f, i) => (
                        <td key={i} className="py-2.5 text-center">
                          {f ? (
                            <Check className="mx-auto size-4 text-success" />
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/50 p-5 text-sm text-muted-foreground">
            <Cpu className="size-4 shrink-0" />
            Role assignment and consent scopes are simulated in this prototype.
          </div>
        </section>
      </div>
    </AppShell>
  );
}
