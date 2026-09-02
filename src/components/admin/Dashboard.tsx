import { useState } from "react";
import {
  ShoppingBag, Package, Clock, CheckCircle2, TrendingUp,
  AlertTriangle, Users, ArrowUpRight, Scissors,
} from "lucide-react";
import { useOrders, orderActions } from "@/lib/orders";
import { productStoreActions } from "@/lib/productStore";
import { stitchingActions } from "@/lib/stitching";
import { inr } from "@/lib/products";
import type { ToastFn } from "@/routes/admin";

type Section = "dashboard" | "products" | "categories" | "homepage" | "offers" | "orders" | "stitching" | "customers" | "reviews" | "content" | "settings";

interface Props {
  onNavigate: (s: Section) => void;
  showToast: ToastFn;
}

function StatCard({
  icon: Icon, label, value, sub, trend, color = "gold",
}: {
  icon: React.ElementType; label: string; value: string | number;
  sub?: string; trend?: number; color?: "gold" | "green" | "blue" | "orange" | "red";
}) {
  const colors = {
    gold: "border-gold/30 text-gold bg-gold/5",
    green: "border-green-400/30 text-green-400 bg-green-400/5",
    blue: "border-blue-400/30 text-blue-400 bg-blue-400/5",
    orange: "border-orange-400/30 text-orange-400 bg-orange-400/5",
    red: "border-red-400/30 text-red-400 bg-red-400/5",
  };
  return (
    <div className={`border rounded-sm p-5 ${colors[color]}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-full border flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
        {trend !== undefined && (
          <span className={`text-[10px] flex items-center gap-0.5 ${trend >= 0 ? "text-green-400" : "text-red-400"}`}>
            <ArrowUpRight className={`w-3 h-3 ${trend < 0 ? "rotate-180" : ""}`} />
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="font-display text-3xl text-ivory">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
      {sub && <div className={`text-[10px] mt-1 ${colors[color].split(" ").find(c => c.startsWith("text-"))}`}>{sub}</div>}
    </div>
  );
}

export function AdminDashboard({ onNavigate, showToast }: Props) {
  const { orders } = useOrders();
  const stats = orderActions.getStats();
  const prodStats = productStoreActions.getStats();
  const stitchStats = stitchingActions.getStats();

  // 7-day revenue chart
  const revenueByDay = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayStr = d.toDateString();
    const dayOrders = orders.filter(
      (o) => new Date(o.createdAt).toDateString() === dayStr && o.status !== "cancelled",
    );
    return {
      day: d.toLocaleDateString("en-IN", { weekday: "short" }),
      revenue: dayOrders.reduce((s, o) => s + o.total, 0),
      count: dayOrders.length,
    };
  });
  const maxRev = Math.max(...revenueByDay.map((d) => d.revenue), 1);

  // Today stats
  const today = new Date().toDateString();
  const todayOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === today);
  const todayRevenue = todayOrders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);

  // Average order value
  const aov = orders.length > 0
    ? Math.round(orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total, 0) / Math.max(stats.delivered, 1))
    : 0;

  const lowStock = productStoreActions.getLowStock();
  const outOfStock = productStoreActions.getOutOfStock();
  const recentOrders = orders.slice(0, 6);

  // Customer count (unique phones)
  const uniqueCustomers = new Set(orders.map((o) => o.customerPhone)).size;

  return (
    <div className="space-y-6">
      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard icon={TrendingUp} label="Today's Revenue" value={inr(todayRevenue)} sub={`${todayOrders.length} orders today`} color="gold" />
        <StatCard icon={ShoppingBag} label="Total Orders" value={stats.total} sub={`${stats.pending} pending`} color="blue" />
        <StatCard icon={TrendingUp} label="Total Revenue" value={inr(stats.revenue)} color="green" trend={8} />
        <StatCard icon={CheckCircle2} label="Delivered" value={stats.delivered} color="green" />
        <StatCard icon={Package} label="Products" value={prodStats.total} sub={`${prodStats.outOfStock} out of stock`} color={prodStats.outOfStock > 0 ? "orange" : "gold"} />
        <StatCard icon={Users} label="Customers" value={uniqueCustomers} color="blue" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Revenue chart */}
        <div className="lg:col-span-2 border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg">Revenue — Last 7 Days</h2>
            <div className="text-xs text-muted-foreground">Total: {inr(revenueByDay.reduce((s, d) => s + d.revenue, 0))}</div>
          </div>
          {orders.length === 0 ? (
            <div className="h-40 flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <ShoppingBag className="w-8 h-8 opacity-30" />
              <span className="text-sm">No orders yet. Revenue chart appears after first sale.</span>
            </div>
          ) : (
            <div className="flex items-end gap-2 h-40 px-2">
              {revenueByDay.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  {d.revenue > 0 && (
                    <div className="text-[8px] text-muted-foreground">{inr(d.revenue).replace("₹", "")}</div>
                  )}
                  <div className="relative group w-full">
                    <div
                      className="w-full bg-gold/20 border-t-2 border-gold/60 transition-all duration-700 min-h-[4px] rounded-sm"
                      style={{ height: `${Math.max((d.revenue / maxRev) * 120, 4)}px` }}
                    />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-card border border-border text-[9px] px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                      {d.count} order{d.count !== 1 ? "s" : ""} · {inr(d.revenue)}
                    </div>
                  </div>
                  <div className="text-[9px] text-muted-foreground">{d.day}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick stats */}
        <div className="space-y-4">
          {[
            { label: "Avg. Order Value", value: inr(aov), icon: TrendingUp },
            { label: "Stitching Orders", value: `${stitchStats.pending} pending`, icon: Scissors },
            { label: "New Arrivals", value: prodStats.newArrivals, icon: Package },
            { label: "Total Revenue", value: inr(stats.revenue), icon: TrendingUp },
          ].map((item) => (
            <div key={item.label} className="border border-border bg-card p-4 flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                <item.icon className="w-3.5 h-3.5 text-gold" />
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground">{item.label}</div>
                <div className="font-display text-lg text-ivory">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts + recent */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Low stock alert */}
        <div className="border border-border bg-card">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="font-display text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              Inventory Alerts
            </h3>
            <button onClick={() => onNavigate("products")} className="text-[10px] text-gold">View →</button>
          </div>
          <div className="p-3 space-y-2 max-h-48 overflow-y-auto">
            {outOfStock.map((p) => (
              <div key={p.id} className="flex items-center gap-2 p-2 bg-red-500/10 border border-red-500/20 text-xs">
                <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                <span className="flex-1 truncate text-red-300">{p.name}</span>
                <span className="text-red-400 font-medium shrink-0">Out of Stock</span>
              </div>
            ))}
            {lowStock.filter(p => p.stockCount > 0).map((p) => (
              <div key={p.id} className="flex items-center gap-2 p-2 bg-yellow-500/10 border border-yellow-500/20 text-xs">
                <span className="w-2 h-2 rounded-full bg-yellow-400 shrink-0" />
                <span className="flex-1 truncate text-yellow-300">{p.name}</span>
                <span className="text-yellow-400 font-medium shrink-0">{p.stockCount} left</span>
              </div>
            ))}
            {outOfStock.length === 0 && lowStock.length === 0 && (
              <div className="text-xs text-muted-foreground p-3 text-center">✓ All products well-stocked</div>
            )}
          </div>
        </div>

        {/* Recent orders */}
        <div className="lg:col-span-2 border border-border bg-card">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="font-display text-base">Recent Orders</h3>
            <button onClick={() => onNavigate("orders")} className="text-[10px] text-gold">View All →</button>
          </div>
          {recentOrders.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">No orders yet.</div>
          ) : (
            <div className="divide-y divide-border">
              {recentOrders.map((o) => (
                <div key={o.orderNo} className="flex items-center gap-3 px-4 py-3 hover:bg-gold/5 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-mono text-gold truncate">{o.orderNo}</div>
                    <div className="text-xs text-muted-foreground truncate">{o.customerName} · {o.items.length} item{o.items.length > 1 ? "s" : ""}</div>
                  </div>
                  <div className="text-sm font-medium text-ivory shrink-0">{inr(o.total)}</div>
                  <div className={`text-[9px] tracking-luxury uppercase shrink-0 ${
                    o.status === "delivered" ? "text-green-400" : o.status === "cancelled" ? "text-red-400" : "text-yellow-400"
                  }`}>{o.status}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="font-display text-base mb-3 text-muted-foreground">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Add Product", section: "products", icon: Package },
            { label: "Homepage Builder", section: "homepage", icon: TrendingUp },
            { label: "Create Offer", section: "offers", icon: TrendingUp },
            { label: "View Orders", section: "orders", icon: ShoppingBag },
          ].map((a) => (
            <button
              key={a.label}
              onClick={() => onNavigate(a.section as Section)}
              className="flex items-center gap-2 p-4 border border-border bg-card hover:border-gold/40 hover:text-gold transition-colors text-sm text-muted-foreground"
            >
              <a.icon className="w-4 h-4 text-gold shrink-0" />
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
