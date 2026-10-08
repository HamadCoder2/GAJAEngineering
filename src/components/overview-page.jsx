import { Activity, Building2, FileClock, MapPin, ShieldCheck, Users } from "lucide-react";
import { DashboardShell } from "./dashboard-shell";
import { useApp } from "./app-provider";
import { StatusBadge } from "./status-badge";

export function OverviewPage({ role }) {
  const { data } = useApp();

  const stats =
    role === "super_admin"
      ? [
          ["States", data.states.length, MapPin],
          ["Locations", data.locations.length, MapPin],
          ["Sites", data.sites.length, Building2],
          ["Site admins", data.admins.length, ShieldCheck],
          ["Site users", data.users.length, Users],
          [
            "Pending invoices",
            data.invoices.filter((i) => i.status === "Pending").length,
            FileClock,
          ],
        ]
      : role === "site_admin"
      ? [
          ["Assigned sites", 4, Building2],
          ["Site users", data.users.length, Users],
          [
            "Pending reviews",
            data.invoices.filter((i) => i.status === "Pending").length,
            FileClock,
          ],
        ]
      : [
          ["Assigned sites", 1, Building2],
          ["My invoices", data.invoices.length, FileClock],
          [
            "Pending",
            data.invoices.filter((i) => i.status === "Pending").length,
            Activity,
          ],
        ];

  return (
    <DashboardShell role={role} title="Operations overview">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map(([label, value, Icon]) => (
          <article
            key={String(label)}
            className="rounded-lg border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">
                  {String(label)}
                </p>
                <p className="mt-2 text-3xl font-black">{String(value)}</p>
              </div>
              <div className="grid size-10 place-items-center rounded-md bg-accent text-accent-foreground">
                <Icon className="size-5" />
              </div>
            </div>
            <div className="mt-5 h-1 rounded-full bg-muted">
              <div className="h-full w-2/3 rounded-full bg-brand-cyan" />
            </div>
          </article>
        ))}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_.6fr]">
        <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <h3 className="font-black">Recent activity</h3>
          <div className="mt-4 divide-y divide-border">
            {data.invoices.slice(0, 5).map((i) => (
              <div
                key={i.id}
                className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-bold">
                    {i.number} · {i.vendor}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {i.site} · {i.date}
                  </p>
                </div>
                <StatusBadge status={String(i.status)} />
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-lg bg-primary p-5 text-primary-foreground shadow-sm">
          <p className="text-xs font-black uppercase text-brand-cyan">
            Invoice health
          </p>
          <h3 className="mt-2 text-xl font-black">Reviews are moving</h3>
          <div className="mt-8 flex h-40 items-end gap-4">
            {[48, 76, 38, 62].map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t bg-brand-cyan"
                  style={{ height: `${v}%` }}
                />
                <span className="text-xs text-primary-foreground/70">
                  W{i + 1}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
