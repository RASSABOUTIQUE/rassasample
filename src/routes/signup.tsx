import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight } from "lucide-react";
import { authActions } from "@/lib/auth";
import logo from "@/assets/rassa-logo-custom.png";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create Account — Rassa Boutique" },
      { name: "description", content: "Create a Rassa Boutique account to track your orders, save wishlists, and enjoy a personalised shopping experience." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await authActions.signup({ name: form.name, email: form.email, phone: form.phone, password: form.password } as any);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16 pb-10">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.05)_0%,transparent_60%)] pointer-events-none" />
      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <Link to="/">
            <img src={logo} alt="Rassa Boutique" className="h-14 w-14 object-contain mx-auto mb-3" />
          </Link>
          <h1 className="font-display text-3xl text-ivory">Create Account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-gold hover:underline">Sign in</Link>
          </p>
        </div>

        {success ? (
          <div className="border border-border bg-card p-8 text-center space-y-4">
            <Mail className="w-12 h-12 text-gold mx-auto mb-4" />
            <h2 className="text-xl text-ivory font-display">Check Your Email</h2>
            <p className="text-sm text-muted-foreground">
              We've sent a verification link to <span className="text-ivory">{form.email}</span>.
              Please verify your email address to continue.
            </p>
            <Link to="/login" className="block w-full bg-gold text-background py-3 text-sm tracking-luxury uppercase hover:bg-gold/90 transition-colors mt-6">
              Go to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="border border-border bg-card p-8 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-[10px] tracking-luxury uppercase text-gold mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input name="name" autoComplete="name" required value={form.name} onChange={set("name")} placeholder="Your full name"
                className="w-full bg-background border border-border pl-11 pr-4 py-3 text-sm outline-none focus:border-gold transition-colors" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-[10px] tracking-luxury uppercase text-gold mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input name="email" autoComplete="email" type="email" required value={form.email} onChange={set("email")} placeholder="you@example.com"
                className="w-full bg-background border border-border pl-11 pr-4 py-3 text-sm outline-none focus:border-gold transition-colors" />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-[10px] tracking-luxury uppercase text-gold mb-2">Phone / WhatsApp</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input name="phone" autoComplete="tel" type="tel" value={form.phone} onChange={set("phone")} placeholder="+91 XXXXX XXXXX"
                className="w-full bg-background border border-border pl-11 pr-4 py-3 text-sm outline-none focus:border-gold transition-colors" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[10px] tracking-luxury uppercase text-gold mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input name="password" autoComplete="new-password" type={showPw ? "text" : "password"} required value={form.password} onChange={set("password")} placeholder="Min. 6 characters"
                className="w-full bg-background border border-border pl-11 pr-12 py-3 text-sm outline-none focus:border-gold transition-colors" />
              <button type="button" onClick={() => setShowPw(v => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gold">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm */}
          <div>
            <label className="block text-[10px] tracking-luxury uppercase text-gold mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input name="confirm-password" autoComplete="new-password" type={showPw ? "text" : "password"} required value={form.confirm} onChange={set("confirm")} placeholder="Repeat password"
                className="w-full bg-background border border-border pl-11 pr-12 py-3 text-sm outline-none focus:border-gold transition-colors" />
            </div>
          </div>

          {error && (
            <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-3">{error}</div>
          )}

          <button type="submit" disabled={loading}
            className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-60 mt-2">
            {loading ? (
              <span className="w-4 h-4 border-2 border-onyx/30 border-t-onyx rounded-full animate-spin" />
            ) : (
              <><ArrowRight className="w-4 h-4" /> Create Account</>
            )}
          </button>
        </form>
        )}

        <p className="mt-5 text-center text-xs text-muted-foreground">
          By creating an account, you agree to our{" "}
          <Link to="/" className="text-gold hover:underline">Terms of Service</Link> and{" "}
          <Link to="/" className="text-gold hover:underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
