import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  ChevronDown,
  FileCheck2,
  HardHat,
  LogIn,
  MapPin,
  ShieldCheck,
  UserCog,
  Users,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import hero from "@/assets/site-hero.jpg";

const roles = [
  {
    to: "/login/super-admin",
    label: "Super Admin",
    text: "Masters, admins, assignments and final invoice review.",
    icon: ShieldCheck,
  },
  {
    to: "/login/site-admin",
    label: "Site Admin",
    text: "Manage your sites, workforce and invoice approvals.",
    icon: UserCog,
  },
  {
    to: "/login/site-user",
    label: "Site User",
    text: "Submit invoices and track their status.",
    icon: HardHat,
  },
];

const features = [
  {
    icon: MapPin,
    title: "States & locations",
    text: "Organise every project by state and location with clean master data.",
  },
  {
    icon: Building2,
    title: "Site management",
    text: "Track site codes, names and assigned admins in one place.",
  },
  {
    icon: Users,
    title: "Workforce",
    text: "Onboard site users, assign them to sites and control access.",
  },
  {
    icon: FileCheck2,
    title: "Invoice approvals",
    text: "Two-step review from site admin to super admin with clear reasons.",
  },
];

function LoginMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <Button onClick={() => setOpen(!open)}>
        <LogIn />
        Login
        <ChevronDown />
      </Button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-64 rounded-lg border border-border bg-popover p-2 shadow-xl">
          {roles.map((r) => (
            <Link
              key={r.to}
              to={r.to}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-popover-foreground hover:bg-accent"
            >
              <r.icon className="size-4 text-primary" />
              {r.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Landing() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Logo compact />
            {/* <div>
              <div className="text-lg font-black text-foreground">GAJA</div>
              <div className="text-[9px] font-bold uppercase text-primary">
                Engineering DSS
              </div>
            </div> */}
          </div>
          <nav className="hidden gap-6 text-sm font-semibold text-muted-foreground md:flex">
            <a href="#features" className="hover:text-primary">
              Features
            </a>
            <a href="#roles" className="hover:text-primary">
              Workspaces
            </a>
          </nav>
          <LoginMenu />
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <img
            src={hero}
            alt="Construction site at dusk"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-overlay" />
          <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
            <p className="text-xs font-bold uppercase tracking-widest text-sidebar-muted">
              Field operations platform
            </p>
            <h1 className="mt-3 max-w-2xl text-4xl font-extrabold text-sidebar-foreground sm:text-6xl">
              Run every construction site from one dashboard.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-sidebar-muted">
              States, sites, workforce and invoices organised by role so each team
              sees exactly what it needs.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild className="bg-[#210F37]">
                <a href="#roles">Get started</a>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <a href="#features">See features</a>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="text-3xl font-extrabold text-foreground">
            Everything your sites need
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-border bg-card p-6 shadow-sm"
              >
                <span className="grid size-11 place-items-center rounded-lg bg-primary text-primary-foreground">
                  <f.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-bold text-foreground">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="roles" className="bg-brand py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-3xl font-extrabold text-foreground">
              Choose your workspace
            </h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {roles.map((r) => (
                <Link
                  key={r.to}
                  to={r.to}
                  className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-colors hover:border-primary"
                >
                  <span className="grid size-12 place-items-center rounded-lg bg-accent text-accent-foreground">
                    <r.icon className="size-6" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-foreground">{r.label}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{r.text}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    <LogIn className="size-4" />
                    Sign in
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#222831] text-sidebar-foreground py-4 px-4">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
          <div>
            <p className="text-xl font-extrabold">GAJA Engineering</p>
            <p className="mt-2 text-sm text-sidebar-muted">
              Construction operations, workforce and invoice management.
            </p>
          </div>
          <div>
            <p className="font-bold">Workspaces</p>
            <ul className="mt-2 space-y-1 text-md text-sidebar-muted">
              {roles.map((r) => (
                <li key={r.to}>
                  <Link to={r.to} className="hover:text-sidebar-foreground">
                    {r.label} login
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-bold">Explore</p>
            <ul className="mt-2 space-y-1 text-md text-sidebar-muted">
              <li>
                <a href="#features" className="hover:text-sidebar-foreground">
                  Features
                </a>
              </li>
              <li>
                <a href="#roles" className="hover:text-sidebar-foreground">
                  Workspaces
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-sidebar-border py-4 text-center text-xs text-sidebar-muted">
          Copyright © GAJA. 2026
        </div>
      </footer>
    </div>
  );
}
export default Landing;
