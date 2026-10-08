import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import { demoCredentials, roleLabels } from "@/lib/demo-data";
import { saveSession } from "@/lib/session";
import { useApp } from "./app-provider";
import { Logo } from "./logo";
import siteHero from "@/assets/site-hero.jpg";
import engineer from "@/assets/engineer-hero.jpg";
import worker from "@/assets/worker-hero.jpg";

const configs = {
  super_admin: {
    image: siteHero,
    kicker: "Command every project",
    copy: "One clear view from foundation to final approval.",
  },
  site_admin: {
    image: engineer,
    kicker: "Lead from the blueprint",
    copy: "Your sites, crews, and approvals—aligned in one place.",
  },
  site_user: {
    image: worker,
    kicker: "Built for the field",
    copy: "Submit work, track invoices, and keep progress moving.",
  },
};

export function LoginPage({ role }) {
  const nav = useNavigate();
  const { setSession } = useApp();
  const [email, setEmail] = useState(demoCredentials[role].email);
  const [password, setPassword] = useState(demoCredentials[role].password);
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const c = configs[role];

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!email.includes("@") || password.length < 6) {
      setError("Enter a valid email and password.");
      return;
    }
    setLoading(true);
    try {
      const result = await supabase.auth.signInWithPassword({ email, password });
      if (!result.error) {
        const s = { role, name: roleLabels[role], email };
        saveSession(s, remember);
        setSession(s);
        nav(`/${role.replaceAll("_", "-")}`);
        setLoading(false);
        return;
      }
    } catch {
      // Fallback to demo credentials
    }

    if (
      email === demoCredentials[role].email &&
      password === demoCredentials[role].password
    ) {
      const s = { role, name: roleLabels[role], email };
      saveSession(s, remember);
      setSession(s);
      nav(`/${role.replaceAll("_", "-")}`);
      setLoading(false);
      return;
    }

    setError("Those details do not match this role. Try the demo credentials below.");
    setLoading(false);
  }

  async function forgot() {
    setError("");
    if (!email.includes("@")) {
      setError("Enter your email address first.");
      return;
    }
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (err) setError(err.message);
    else toast.success("Password reset link sent. Check your email.");
  }

  async function google() {
    sessionStorage.setItem("gaja-login-role", role);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) setError(result.error.message);
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-[0.9fr_.8fr]">
      <section className="relative hidden min-h-screen overflow-hidden lg:block shadow-2xl z-10">
        <img
          src={c.image}
          width={1600}
          height={1000}
          className="absolute inset-0 h-full w-full object-cover"
          alt={`${roleLabels[role]} construction site`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/30 to-black/30" />
        <div className="absolute inset-0 bg-overlay/40" />
        <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.6)] pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 p-12 text-primary-foreground drop-shadow-md">
          <p className="mb-3 text-sm font-black uppercase text-brand-cyan">{c.kicker}</p>
          <h1 className="max-w-xl text-5xl font-black leading-tight">
            Building tomorrow, one site at a time.
          </h1>
          <p className="mt-4 max-w-lg text-lg text-primary-foreground/80">{c.copy}</p>
        </div>
      </section>
      <section className="flex items-center justify-center bg-white px-5 py-10">
        <div className="w-full max-w-xl">
          <div className="mb-10 flex justify-between ">
            <Logo className="w-50 h-10 "/>
            <Link
              to="/"
              className="text-sm font-bold text-black hover:text-accent-foreground"
            >
              Change role
            </Link>
          </div>
          {/* <p className="text-xs font-black uppercase text-accent-foreground">
            Secure workspace
          </p> */}
          <h2 className="mt-2 text-3xl font-black">{roleLabels[role]} sign in</h2>
          <p className="mt-2 text-muted-foreground">
            Welcome back. Enter your credentials to continue.
          </p>
          <form onSubmit={submit} className="mt-8 space-y-5">
            <label className="grid gap-2">
              <span className="text-sm font-bold">Email address</span>
              <span className="relative">
                <Mail className="absolute left-3 top-3 size-4 text-muted-foreground" />
                <input
                  aria-label="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 w-full rounded-md border border-input bg-card pl-10 pr-3 outline-none focus:ring-2 focus:ring-ring"
                />
              </span>
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-bold">Password</span>
              <span className="relative">
                <LockKeyhole className="absolute left-3 top-3 size-4 text-muted-foreground" />
                <input
                  aria-label="Password"
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 w-full rounded-md border border-input bg-card pl-10 pr-11 outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="button"
                  aria-label={show ? "Hide password" : "Show password"}
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-2.5 rounded p-1 text-muted-foreground hover:text-foreground"
                >
                  {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </span>
            </label>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={remember}
                  onCheckedChange={(v) => setRemember(v === true)}
                />
                <label htmlFor="remember" className="text-sm">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                onClick={forgot}
                className="text-sm font-bold text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>
            {error && (
              <p
                role="alert"
                className="rounded-md bg-destructive/10 p-3 text-sm font-semibold text-destructive"
              >
                {error}
              </p>
            )}
            <Button className="h-11 w-full" type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
            <div className="flex items-center gap-3 text-xs uppercase text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              or
              <span className="h-px flex-1 bg-border" />
            </div>
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full"
              onClick={google}
            >
              Continue with Google
            </Button>
          </form>
          {/* <div className="mt-6 rounded-md border border-border bg-muted p-4 text-sm">
            <p className="font-bold">Demo access</p>
            <p className="mt-1 text-muted-foreground">
              {demoCredentials[role].email} / {demoCredentials[role].password}
            </p>
          </div> */}
        </div>
      </section>
    </main>
  );
}
