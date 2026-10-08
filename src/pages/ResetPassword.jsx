import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { supabase } from "@/integrations/supabase/client";

export function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (password.length < 6)
      return setError("Password must be at least 6 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) return setError(err.message);
    toast.success("Password updated");
    setDone(true);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 shadow-sm">
        <Logo />
        <h1 className="mt-8 text-2xl font-black">Set a new password</h1>
        {done ? (
          <div className="mt-6 space-y-4">
            <p className="text-muted-foreground">
              Your password has been updated.
            </p>
            <Button asChild className="w-full">
              <Link to="/">Back to sign in</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <input
              type="password"
              aria-label="New password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 w-full rounded-md border border-input bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="password"
              aria-label="Confirm password"
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="h-11 w-full rounded-md border border-input bg-background px-3 outline-none focus:ring-2 focus:ring-ring"
            />
            {error && (
              <p
                role="alert"
                className="rounded-md bg-destructive/10 p-3 text-sm font-semibold text-destructive"
              >
                {error}
              </p>
            )}
            <Button type="submit" className="h-11 w-full" disabled={loading}>
              {loading ? "Saving…" : "Update password"}
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}

export default ResetPassword;
