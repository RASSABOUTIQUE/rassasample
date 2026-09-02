import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { authActions, useAuth } from "@/lib/auth";
import logo from "@/assets/rassa-logo-custom.png";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — Rassa Boutique" },
      { name: "description", content: "Sign in to your Rassa Boutique account to view orders and manage your profile." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { isLoggedIn, isInitializing, isAdmin, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [isResetMode, setIsResetMode] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    if (!isInitializing && isLoggedIn) {
      if (user?.email === "admin@rassa.com") {
        navigate({ to: "/admin" });
      } else {
        // Clear any lingering admin session for normal users
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("rassa_admin_session");
        }
        navigate({ to: "/account" });
      }
    }
  }, [isLoggedIn, isInitializing, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isResetMode) {
        const result = await authActions.forgotPassword(email);
        setLoading(false);
        if (result?.ok) {
          setResetSuccess(true);
        } else {
          setError(result?.error || "Failed to send reset email.");
        }
        return;
      }

      const result = await authActions.login(email, password);
      setLoading(false);
      if (result?.ok) {
        // Admin goes to admin panel
        if (email === "admin@rassa.com") {
          navigate({ to: "/admin" });
        } else {
          navigate({ to: "/account" });
        }
      } else {
        setError(result?.error ?? "Login failed. Please try again.");
      }
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || "An unexpected error occurred during login.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16 pb-10">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.05)_0%,transparent_60%)] pointer-events-none" />

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <img src={logo} alt="Rassa Boutique" className="h-14 w-14 object-contain mx-auto mb-3" />
          </Link>
          <h1 className="font-display text-3xl text-ivory">Sign In</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-gold hover:underline">
              Create one
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="border border-border bg-card p-8 space-y-5">
          {/* Dummy hidden fields to intercept aggressive browser autofill on page load */}
          <input type="email" name="fake_email" id="fake_email" style={{ position: 'absolute', top: '-9999px', left: '-9999px', opacity: 0 }} aria-hidden="true" tabIndex={-1} autoComplete="off" />
          <input type="password" name="fake_password" id="fake_password" style={{ position: 'absolute', top: '-9999px', left: '-9999px', opacity: 0 }} aria-hidden="true" tabIndex={-1} autoComplete="new-password" />

          {/* Email */}
          <div>
            <label className="block text-[10px] tracking-luxury uppercase text-gold mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                name="email"
                autoComplete="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-background border border-border pl-11 pr-4 py-3 text-sm outline-none focus:border-gold transition-colors"
              />
            </div>
          </div>

          {resetSuccess ? (
            <div className="text-center space-y-4 py-4">
              <Mail className="w-12 h-12 text-gold mx-auto mb-4" />
              <h2 className="text-xl text-ivory font-display">Check Your Email</h2>
              <p className="text-sm text-muted-foreground">
                We've sent a password reset link to <span className="text-ivory">{email}</span>.
              </p>
              <button type="button" onClick={() => { setIsResetMode(false); setResetSuccess(false); }} className="text-gold hover:underline text-sm mt-4 inline-block">
                Back to Login
              </button>
            </div>
          ) : (
            <>
              {/* Password */}
              {!isResetMode && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] tracking-luxury uppercase text-gold">Password</label>
                    <button type="button" onClick={() => setIsResetMode(true)} className="text-[10px] text-muted-foreground hover:text-gold transition-colors">
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      name="password"
                      autoComplete="current-password"
                      type={showPw ? "text" : "password"}
                      required={!isResetMode}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
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
              )}

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
                  <>
                    <ArrowRight className="w-4 h-4" /> {isResetMode ? "Send Reset Link" : "Sign In"}
                  </>
                )}
              </button>

              {isResetMode && (
                <div className="text-center mt-4">
                  <button type="button" onClick={() => setIsResetMode(false)} className="text-[10px] uppercase tracking-luxury text-muted-foreground hover:text-gold transition-colors">
                    Back to Login
                  </button>
                </div>
              )}
            </>
          )}

          <div className="relative flex items-center gap-3 py-2">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] uppercase tracking-luxury text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <a
            href="https://wa.me/919633419902?text=Hello%20Rassa%20Boutique%2C%20I'd%20like%20to%20place%20an%20order."
            target="_blank"
            rel="noreferrer"
            className="btn-ghost-gold w-full text-center text-sm"
          >
            Continue with WhatsApp
          </a>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By signing in, you agree to our{" "}
          <Link to="/faq" className="text-gold hover:underline">return policy</Link> and{" "}
          <Link to="/faq" className="text-gold hover:underline">privacy policy</Link>.
        </p>
      </div>
    </div>
  );
}
