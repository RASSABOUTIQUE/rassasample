import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import {
  LayoutDashboard, Package, FolderOpen, Monitor, Tag,
  ShoppingBag, Scissors, Users, Star, FileText, Settings,
  LogOut, Eye, EyeOff, Lock, Menu, X, Bell, ChevronRight,
} from "lucide-react";
import { authActions } from "@/lib/auth";
import { useOrders, orderActions } from "@/lib/orders";
import { productStoreActions } from "@/lib/productStore";
import { stitchingActions } from "@/lib/stitching";
import { cmsActions } from "@/lib/cms";
import logo from "@/assets/rassa-logo-custom.png";

// — Lazy-loaded sections (keep main file lean)
import { AdminDashboard } from "@/components/admin/Dashboard";
import { AdminProducts } from "@/components/admin/ProductManager";
import { AdminInventory } from "@/components/admin/InventoryManager";
import { AdminHomepageBuilder } from "@/components/admin/HomepageBuilder";
import { AdminOffers } from "@/components/admin/OfferManager";
import { AdminCategories } from "@/components/admin/CategoryManager";
import { AdminContent } from "@/components/admin/ContentEditor";
import { AdminSettings } from "@/components/admin/SettingsEditor";
import { AdminStitching } from "@/components/admin/StitchingManager";
import { AdminReviews } from "@/components/admin/ReviewsManager";
import { AdminOrdersSection } from "@/components/admin/OrdersSection";
import { AdminCustomers } from "@/components/admin/CustomersSection";
import { AdminMediaLibrary } from "@/components/admin/MediaLibrary";
import { AdminRoleManager } from "@/components/admin/RoleManager";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Rassa BMS" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

// ─── Toast ────────────────────────────────────────────────────────────────────

export type ToastFn = (msg: string, type?: "success" | "error" | "info") => void;

// ─── Admin Login ──────────────────────────────────────────────────────────────

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginAdmin } = authActions;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[ADMIN TRACE] handleSubmit started");
    try {
      setError("");
      setLoading(true);
      await new Promise((r) => setTimeout(r, 600));
      
      console.log("[ADMIN TRACE] before loginAdmin");
      const loginPromise = loginAdmin(email, pw);
      const timeoutPromise = new Promise<{ok: boolean, error: string}>((_, reject) => 
        setTimeout(() => reject(new Error("Timeout: loginAdmin took longer than 10 seconds")), 10000)
      );
      
      const res = await Promise.race([loginPromise, timeoutPromise]) as {ok: boolean, error?: string};
      console.log("[ADMIN TRACE] after loginAdmin", res);

      if (res.ok) {
        console.log("[ADMIN TRACE] executing onLogin()");
        onLogin();
      } else {
        console.log("[ADMIN TRACE] login failed", res.error);
        setError(res.error || "Incorrect email or password.");
      }
    } catch (error: any) {
      console.error("[ADMIN TRACE] Admin login failed with exception:", error);
      setError(error?.message || "An unexpected error occurred.");
    } finally {
      console.log("[ADMIN TRACE] handleSubmit finally block executed (setLoading false)");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.06)_0%,transparent_60%)] pointer-events-none" />
      <div className="w-full max-w-sm relative">
        <div className="text-center mb-8">
          <img src={logo} alt="Rassa" className="h-12 w-12 object-contain mx-auto mb-4" />
          <h1 className="font-display text-3xl text-ivory">Boutique Admin</h1>
          <p className="mt-1 text-xs text-muted-foreground">Rassa Boutique Management System</p>
        </div>
        <form onSubmit={handleSubmit} className="border border-border bg-card p-8 space-y-5">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] tracking-luxury uppercase text-gold mb-2">Admin Email</label>
              <div className="relative">
                <input
                  type="email" required autoFocus value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@rassa.com"
                  className="w-full bg-background border border-border px-4 py-3 text-sm outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] tracking-luxury uppercase text-gold mb-2">Admin Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"} required value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-background border border-border pl-12 pr-12 py-3 text-sm outline-none focus:border-gold transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gold transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
          {error && <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-3">{error}</div>}
          <button type="submit" disabled={loading} className="btn-gold w-full flex items-center justify-center gap-2">
            {loading ? <span className="w-4 h-4 border-2 border-onyx/30 border-t-onyx rounded-full animate-spin" /> : "Enter Admin Panel →"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Navigation config ────────────────────────────────────────────────────────

type Section =
  | "dashboard" | "products" | "inventory" | "categories" | "media" | "homepage"
  | "offers" | "orders" | "stitching" | "customers"
  | "reviews" | "content" | "settings" | "roles";

const NAV: {
  id: Section; label: string; icon: React.ElementType;
  group: string; badgeKey?: "pending" | "lowStock" | "stitching" | "reviews"
}[] = [
  { id: "dashboard",   label: "Dashboard",        icon: LayoutDashboard, group: "main" },
  { id: "products",    label: "Products",         icon: Package,         group: "catalog" },
  { id: "inventory",   label: "Inventory",        icon: Package,         group: "catalog", badgeKey: "lowStock" },
  { id: "categories",  label: "Categories",       icon: FolderOpen,      group: "catalog" },
  { id: "media",       label: "Media Library",    icon: Monitor,         group: "design" },
  { id: "homepage",    label: "Homepage Builder", icon: Monitor,         group: "design" },
  { id: "offers",      label: "Offers & Coupons", icon: Tag,             group: "marketing" },
  { id: "orders",      label: "Orders",           icon: ShoppingBag,     group: "commerce", badgeKey: "pending" },
  { id: "stitching",   label: "Custom Stitching", icon: Scissors,        group: "commerce", badgeKey: "stitching" },
  { id: "customers",   label: "Customers",        icon: Users,           group: "commerce" },
  { id: "reviews",     label: "Reviews",          icon: Star,            group: "content",  badgeKey: "reviews" },
  { id: "content",     label: "Pages & Content",  icon: FileText,        group: "content" },
  { id: "settings",    label: "Settings",         icon: Settings,        group: "system" },
  { id: "roles",       label: "Roles & Staff",    icon: Users,           group: "system" },
];

const GROUP_LABELS: Record<string, string> = {
  main: "", catalog: "CATALOG", design: "DESIGN",
  marketing: "MARKETING", commerce: "COMMERCE", content: "CONTENT", system: "SYSTEM",
};

// ─── Admin Panel (main UI) ────────────────────────────────────────────────────

function AdminPanel() {
  const [section, setSection] = useState<Section>("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "info" } | null>(null);
  const { orders } = useOrders();
  const { logout, admin } = authActions;

  const pendingOrders = orders.filter(
    (o) => o.status === "placed" || o.status === "confirmed" || o.status === "processing",
  ).length;
  const pendingStitching = stitchingActions.getPending().length;
  const lowStock = productStoreActions.getLowStock().length;
  const outOfStock = productStoreActions.getOutOfStock().length;
  const store = cmsActions.get().store;

  const showToast: ToastFn = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const badges: Record<string, number> = {
    pending: pendingOrders,
    stitching: pendingStitching,
    lowStock: lowStock,
    reviews: 0,
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
        <img src={logo} alt="Rassa" className="w-8 h-8 object-contain shrink-0" />
        <div className="min-w-0">
          <div className="font-display text-base text-gold leading-none">RASSA</div>
          <div className="text-[9px] text-muted-foreground mt-0.5 truncate">Boutique Admin</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {Object.keys(GROUP_LABELS).map((group) => {
          const items = NAV.filter((n) => n.group === group);
          return (
            <div key={group} className="mb-2">
              {GROUP_LABELS[group] && (
                <div className="px-5 pt-3 pb-1 text-[9px] tracking-luxury uppercase text-muted-foreground/50">
                  {GROUP_LABELS[group]}
                </div>
              )}
              {items.map((item) => {
                const badge = item.badgeKey ? badges[item.badgeKey] : 0;
                const active = section === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setSection(item.id); setMobileSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm transition-colors text-left ${
                      active ? "bg-gold/10 text-gold border-r-2 border-gold" : "text-muted-foreground hover:bg-gold/5 hover:text-ivory"
                    }`}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {badge > 0 && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${active ? "bg-gold text-onyx" : "bg-gold/20 text-gold"}`}>
                        {badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border py-3 px-3 space-y-1">
        {lowStock > 0 && (
          <button onClick={() => setSection("products")} className="w-full flex items-center gap-2 px-3 py-2 text-[10px] text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20 transition-colors">
            <Package className="w-3.5 h-3.5" />
            {lowStock} low stock · {outOfStock} out of stock
          </button>
        )}
        <a href="/" target="_blank" rel="noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-gold transition-colors rounded-sm">
          <Eye className="w-4 h-4" />
          <span>View Store ↗</span>
        </a>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-red-400 transition-colors text-left rounded-sm">
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  const sectionTitle = NAV.find((n) => n.id === section)?.label ?? "Admin";

  return (
    <div className="min-h-screen bg-background flex relative">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 border-r border-border bg-card fixed top-0 left-0 h-full z-30">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileSidebarOpen(false)} />
          <aside className="relative z-50 w-64 bg-card border-r border-border h-full flex flex-col">
            <button onClick={() => setMobileSidebarOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-gold">
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-56 min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="h-14 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-20 gap-4">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-muted-foreground hover:text-gold" onClick={() => setMobileSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <div className="text-[9px] tracking-luxury uppercase text-gold/70">Rassa BMS</div>
              <div className="text-sm font-medium text-ivory">{sectionTitle}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-xs text-muted-foreground">{store.name}</div>
            {pendingOrders > 0 && (
              <button onClick={() => setSection("orders")} className="relative text-muted-foreground hover:text-gold transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold text-onyx text-[8px] rounded-full flex items-center justify-center font-bold">{pendingOrders}</span>
              </button>
            )}
            <div className="w-7 h-7 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-gold text-xs font-bold" title={admin?.role}>
              {admin ? admin.name.charAt(0).toUpperCase() : "A"}
            </div>
          </div>
        </header>

        {/* Section content */}
        <main className="flex-1 p-5 md:p-6 overflow-auto">
          {section === "dashboard"  && <AdminDashboard onNavigate={setSection} showToast={showToast} />}
          {section === "products"   && <AdminProducts showToast={showToast} />}
          {section === "inventory"  && <AdminInventory showToast={showToast} />}
          {section === "categories" && <AdminCategories showToast={showToast} />}
          {section === "media"      && <AdminMediaLibrary showToast={showToast} />}
          {section === "homepage"   && <AdminHomepageBuilder showToast={showToast} />}
          {section === "offers"     && <AdminOffers showToast={showToast} />}
          {section === "orders"     && <AdminOrdersSection showToast={showToast} />}
          {section === "stitching"  && <AdminStitching showToast={showToast} />}
          {section === "customers"  && <AdminCustomers />}
          {section === "reviews"    && <AdminReviews showToast={showToast} />}
          {section === "content"    && <AdminContent showToast={showToast} />}
          {section === "settings"   && <AdminSettings showToast={showToast} />}
          {section === "roles"      && <AdminRoleManager showToast={showToast} />}
        </main>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 border text-sm shadow-2xl transition-all
          ${toast.type === "success" ? "bg-green-900/90 border-green-500/50 text-green-300"
            : toast.type === "error" ? "bg-red-900/90 border-red-500/50 text-red-300"
            : "bg-card border-border text-ivory"}`}
        >
          <span>{toast.type === "success" ? "✓" : toast.type === "error" ? "✗" : "ℹ"}</span>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

// ─── Gate by login ─────────────────────────────────────────────────────────────

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setAuthed(sessionStorage.getItem("rassa_admin_session") === "1");
    }
  }, []);
  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />;
  return <AdminPanel />;
}
