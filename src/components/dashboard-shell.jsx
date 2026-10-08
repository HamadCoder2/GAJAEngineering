import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Building2,
  ChevronDown,
  ClipboardCheck,
  FileText,
  HardHat,
  LogOut,
  Map,
  Menu,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Logo } from "./logo";
import { clearSession } from "@/lib/session";
import { roleLabels } from "@/lib/demo-data";
import { useApp } from "./app-provider";

const menus = {
  super_admin: [
    { label: "Overview", to: "/super-admin", icon: BarChart3 },
    { label: "States", to: "/super-admin/states", icon: Map },
    { label: "Locations", to: "/super-admin/locations", icon: Map },
    { label: "Sites", to: "/super-admin/sites", icon: Building2 },
    { label: "Site admins", to: "/super-admin/admins", icon: ShieldCheck },
    { label: "Assign sites", to: "/super-admin/assign-sites", icon: ClipboardCheck },
    { label: "Site users", to: "/super-admin/users", icon: Users },
    { label: "Invoices", to: "/super-admin/invoices", icon: FileText },
  ],
  site_admin: [
    { label: "Overview", to: "/site-admin", icon: BarChart3 },
    { label: "My sites", to: "/site-admin/sites", icon: Building2 },
    { label: "Site users", to: "/site-admin/users", icon: Users },
    { label: "Invoices", to: "/site-admin/invoices", icon: FileText },
  ],
  site_user: [
    { label: "Overview", to: "/site-user", icon: BarChart3 },
    { label: "My sites", to: "/site-user/sites", icon: Building2 },
    { label: "My invoices", to: "/site-user/invoices", icon: FileText },
    { label: "Profile", to: "/site-user/profile", icon: HardHat },
  ],
};

export function DashboardShell({ role, title, children, action }) {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [account, setAccount] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const { session, setSession } = useApp();
  const nav = useNavigate();
  const location = useLocation();

  function logout() {
    clearSession();
    setSession(null);
    nav(`/login/${role.replaceAll("_", "-")}`);
  }

  const sidebar = (
    <aside
      className={`flex h-full flex-col bg-[#010736] text-sidebar-foreground transition-[width] duration-200 ${
        collapsed ? "w-[76px]" : "w-64"
      }`}
    >
      <div
        className={`border-b border-sidebar-border p-5 ${
          collapsed ? "flex justify-center px-3" : ""
        }`}
      >
        <Logo compact={collapsed} />
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {menus[role].map((i) => {
          const isRoot = i.to.split("/").length === 2;
          const p = location.pathname.replace(/\/$/, "");
          const active = p === i.to || (!isRoot && p.startsWith(i.to + "/"));
          return (
            <Link
              key={i.to}
              to={i.to}
              title={collapsed ? i.label : undefined}
              onClick={() => setOpen(false)}
              className={`flex items-center rounded-md text-md font-semibold transition-colors ${
                collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5"
              } ${
                active
                  ? "bg-[#4E1F6E] text-sidebar-primary-foreground"
                  : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground"
              }`}
            >
              <i.icon className="size-4 shrink-0" />
              {!collapsed && i.label}
            </Link>
          );
        })}
      </nav>
      <Button
        variant="sidebar"
        className={collapsed ? "m-2 justify-center px-0" : "m-3 justify-start"}
        onClick={() => {
          setAccount(false);
          setConfirmLogout(true);
        }}
        title={collapsed ? "Log out" : undefined}
      >
        <LogOut />
        {!collapsed && "Log out"}
      </Button>
    </aside>
  );

  return (
    <div
      className={`min-h-screen bg-background lg:grid lg:transition-[grid-template-columns] ${
        collapsed
          ? "lg:grid-cols-[76px_minmax(0,1fr)]"
          : "lg:grid-cols-[256px_minmax(0,1fr)]"
      }`}
    >
      {open && (
        <div
          className="fixed inset-0 z-40 bg-overlay lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 transition-transform lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebar}
        <Button
          variant="ghostInverse"
          size="icon"
          className="absolute right-2 top-2 lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        >
          <X />
        </Button>
      </div>
      <div className="min-w-0">
        <header className="sticky top-0 z-30 grid h-16 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-card/95 px-4 backdrop-blur sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:inline-flex"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Menu />
          </Button>
          <div className="min-w-0">
            {/* <p className="truncate text-xs font-bold uppercase text-accent-foreground">
              GAJA Engineering DSS
            </p> */}
            <h1 className="truncate text-lg font-black text-foreground">{title}</h1>
          </div>
          <div className="relative">
            <Button
              variant="ghost"
              onClick={() => setAccount(!account)}
              className="max-w-48"
            >
              <span className="hidden truncate sm:block">
                {session?.name ?? roleLabels[role]}
              </span>
              <ChevronDown />
            </Button>
            {account && (
              <div className="absolute right-0 mt-2 w-56 rounded-md border border-border bg-popover p-2 shadow-xl">
                <div className="border-b border-border px-3 py-2">
                  <p className="font-bold">{session?.name ?? "Demo user"}</p>
                  <p className="text-xs text-muted-foreground">{roleLabels[role]}</p>
                </div>
                <Button
                  variant="ghost"
                  className="mt-1 w-full justify-start"
                  onClick={() => {
                    setAccount(false);
                    setConfirmLogout(true);
                  }}
                >
                  <LogOut />
                  Log out
                </Button>
              </div>
            )}
          </div>
        </header>
        <main className="p-4 sm:p-6">
          <div className="mb-5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
            <div>
              <p className="text-xs font-black uppercase text-primary">Field operations</p>
              <h2 className="truncate text-2xl font-black text-foreground">{title}</h2>
            </div>
            {action}
          </div>
          {children}
        </main>
        <AlertDialog open={confirmLogout} onOpenChange={setConfirmLogout}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Log out?</AlertDialogTitle>
              <AlertDialogDescription>
                You will need to sign in again to access your workspace.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={logout}>Yes, log out</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <footer className="px-6 py-5 text-right text-xs text-muted-foreground">
          Copyright © GAJA. 2026
        </footer>
      </div>
    </div>
  );
}
