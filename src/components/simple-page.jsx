import { Building2, CheckCircle2, MapPin, Users } from "lucide-react";
import { DashboardShell } from "./dashboard-shell";
import { useApp } from "./app-provider";

export function SitesView({ role }) {
  const { data } = useApp();
  return (
    <DashboardShell role={role} title="My assigned sites">
      <div className="grid gap-4 lg:grid-cols-2">
        {data.sites
          .slice(role === "site_user" ? 0 : 1, role === "site_user" ? 1 : 5)
          .map((s) => (
            <article
              key={s.id}
              className="rounded-lg border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="grid size-10 place-items-center rounded-md bg-accent text-accent-foreground">
                  <Building2 />
                </div>
                <span className="text-xs font-black text-success">ACTIVE</span>
              </div>
              <p className="mt-4 text-sm font-bold text-primary">{s.code}</p>
              <h3 className="mt-1 text-lg font-black">{s.name}</h3>
              <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="size-4" />
                {s.state}
              </p>
            </article>
          ))}
      </div>
    </DashboardShell>
  );
}

export function AssignSites() {
  const { data } = useApp();
  return (
    <DashboardShell role="super_admin" title="Assign sites">
      <div className="grid gap-5 lg:grid-cols-[.7fr_1.3fr]">
        <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <h3 className="font-black">Site admin</h3>
          <select className="mt-4 h-11 w-full rounded-md border border-input bg-background px-3">
            {data.admins.map((a) => (
              <option key={a.id}>{a.name}</option>
            ))}
          </select>
          <p className="mt-4 text-sm text-muted-foreground">
            Select the projects this administrator is responsible for.
          </p>
        </section>
        <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <h3 className="font-black">Available sites</h3>
          <div className="mt-4 divide-y divide-border">
            {data.sites.map((s, i) => (
              <label
                key={s.id}
                className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-3"
              >
                <input
                  type="checkbox"
                  defaultChecked={i < 3}
                  className="size-4 accent-primary"
                />
                <span className="min-w-0 truncate font-semibold">{s.name}</span>
                <span className="text-xs text-muted-foreground">{s.code}</span>
              </label>
            ))}
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}

export function ProfilePage() {
  const { session } = useApp();
  return (
    <DashboardShell role="site_user" title="My profile">
      <section className="max-w-2xl rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="grid size-16 place-items-center rounded-md bg-primary text-primary-foreground">
            <Users />
          </div>
          <div>
            <h3 className="text-xl font-black">{session?.name ?? "Site User"}</h3>
            <p className="text-muted-foreground">{session?.email}</p>
          </div>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-bold">Phone</span>
            <input
              className="h-10 rounded-md border border-input px-3"
              defaultValue="8500222765"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-bold">Employee ID</span>
            <input
              className="h-10 rounded-md border border-input px-3"
              defaultValue="88888"
              disabled
            />
          </label>
        </div>
        <div className="mt-6 border-t border-border pt-6">
          <p className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="size-4 text-success" />
            Account active
          </p>
        </div>
      </section>
    </DashboardShell>
  );
}
