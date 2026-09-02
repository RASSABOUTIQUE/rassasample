import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { authActions } from "@/lib/auth";
import logo from "@/assets/rassa-logo-custom.png";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset Password — Rassa Boutique" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Supabase automatically handles the hash in the URL and sets the session
  // If there's no active session (i.e., invalid link), we should probably redirect
  useEffect(() => {
    // In a real app we might check if they arrived with a valid token
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const result = await authActions.resetPassword?.(password) || { ok: false, error: "Not implemented" };
    setLoading(false);

    if (result.ok) {
      setSuccess(true);
      setTimeout(() => {
        navigate({ to: "/login" });
      }, 2000);
    } else {
      setError(result.error || "Failed to reset password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16 pb-10">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.05)_0%,transparent_60%)] pointer-events-none" />

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <img src={logo} alt="Rassa Boutique" className="h-14 w-14 object-contain mx-auto mb-3" />
          <h1 className="font-display text-3xl text-ivory">Reset Password</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your new password below.
          </p>
        </div>

        {success ? (
          <div className="border border-border bg-card p-8 text-center space-y-4">
            <h2 className="text-xl text-ivory font-display text-gold">Password Updated</h2>
            <p className="text-sm text-muted-foreground">
              Your password has been successfully reset. Redirecting to login...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="border border-border bg-card p-8 space-y-5">
            <div>
              <label className="block text-[10px] tracking-luxury uppercase text-gold mb-2">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPw ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full bg-background border border-border pl-11 pr-12 py-3 text-sm outline-none focus:border-gold transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gold"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] tracking-luxury uppercase text-gold mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPw ? "text" : "password"}
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full bg-background border border-border pl-11 pr-4 py-3 text-sm outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>

            {error && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-onyx/30 border-t-onyx rounded-full animate-spin" />
              ) : (
                <><ArrowRight className="w-4 h-4" /> Reset Password</>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
