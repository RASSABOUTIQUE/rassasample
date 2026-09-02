import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  LogOut,
  Edit3,
  Package,
  ChevronRight,
  Phone,
  Mail,
  Calendar,
  XCircle,
  MessageCircle,
  Truck,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useOrders, STATUS_LABELS, STATUS_COLORS, type Order } from "@/lib/orders";
import { useWishlist } from "@/lib/wishlist";
import { useProducts } from "@/lib/productStore";
import { inr } from "@/lib/products";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account — Rassa Boutique" },
      { name: "description", content: "Manage your Rassa Boutique profile, view orders, and saved addresses." },
    ],
  }),
  component: AccountPage,
});

type Tab = "overview" | "orders" | "wishlist" | "addresses" | "profile";

function OrderStatusBadge({ status }: { status: Order["status"] }) {
  return (
    <span className={`text-[10px] tracking-luxury uppercase font-medium ${STATUS_COLORS[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

function AccountPage() {
  const { user, isLoggedIn, isInitializing, logout } = useAuth();
  const { orders, cancelOrder, getUserOrders } = useOrders();
  const { wishlistedIds } = useWishlist();
  const { getById } = useProducts();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");
  const [editMode, setEditMode] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", phone: "", email: "" });

  useEffect(() => {
    if (!isInitializing && !isLoggedIn) {
      navigate({ to: "/login" });
    }
  }, [isLoggedIn, isInitializing, navigate]);

  useEffect(() => {
    if (user) {
      setProfileForm({ name: user.name, email: user.email, phone: user.phone });
    }
  }, [user]);

  if (isInitializing) {
    return (
      <div className="pt-28 pb-24 min-h-screen flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const myOrders = getUserOrders(user.id);
  const wishlistProducts = wishlistedIds
    .map((id) => getById(id))
    .filter(Boolean) as ReturnType<typeof getById>[];

  const tabs: { id: Tab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: "overview", label: "Overview", icon: User },
    { id: "orders", label: "My Orders", icon: Package, count: myOrders.length },
    { id: "wishlist", label: "Wishlist", icon: Heart, count: wishlistProducts.length },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "profile", label: "Profile", icon: Edit3 },
  ];

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-[10px] tracking-luxury uppercase text-gold">Welcome back</span>
            <h1 className="mt-1 font-display text-4xl">{user.name}</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            {/* Avatar */}
            <div className="p-5 border border-border bg-card mb-4 text-center">
              <div className="w-16 h-16 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center mx-auto mb-3">
                <span className="font-display text-2xl text-gold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="font-medium text-ivory">{user.name}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{user.email}</div>
              <div className="mt-3 flex justify-center gap-3 text-xs text-muted-foreground">
                <div className="text-center">
                  <div className="font-display text-lg text-gold">{myOrders.length}</div>
                  <div>Orders</div>
                </div>
                <div className="w-px bg-border" />
                <div className="text-center">
                  <div className="font-display text-lg text-gold">{wishlistProducts.length}</div>
                  <div>Saved</div>
                </div>
              </div>
            </div>

            {/* Tab nav */}
            <nav className="border border-border bg-card overflow-hidden">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`w-full flex items-center justify-between px-5 py-3.5 text-sm text-left border-b border-border last:border-0 transition-colors ${
                    tab === t.id
                      ? "bg-gold/10 text-gold"
                      : "text-muted-foreground hover:bg-gold/5 hover:text-ivory"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <t.icon className="w-4 h-4" />
                    <span>{t.label}</span>
                  </div>
                  {t.count !== undefined && t.count > 0 && (
                    <span className="text-[10px] bg-gold/20 text-gold px-2 py-0.5 rounded-full">
                      {t.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            <Link to="/shop" className="mt-4 btn-gold w-full text-center flex items-center justify-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>

          {/* Main content */}
          <div className="lg:col-span-9">
            {/* ── OVERVIEW ── */}
            {tab === "overview" && (
              <div className="space-y-5">
                {/* Quick stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { label: "Total Orders", value: myOrders.length, icon: Package },
                    { label: "Items Saved", value: wishlistProducts.length, icon: Heart },
                    { label: "Member Since", value: new Date(user.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" }), icon: Calendar },
                  ].map((stat) => (
                    <div key={stat.label} className="p-5 border border-border bg-card text-center">
                      <stat.icon className="w-5 h-5 text-gold mx-auto mb-2" />
                      <div className="font-display text-2xl text-gold">{stat.value}</div>
                      <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Recent orders */}
                {myOrders.length > 0 ? (
                  <div className="border border-border bg-card p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-display text-xl">Recent Orders</h2>
                      <button onClick={() => setTab("orders")} className="text-[10px] tracking-luxury uppercase text-gold">View All →</button>
                    </div>
                    <div className="space-y-3">
                      {myOrders.slice(0, 3).map((order) => (
                        <div key={order.orderNo} className="flex items-center justify-between py-3 border-b border-border last:border-0 gap-4 flex-wrap">
                          <div>
                            <div className="font-medium text-sm text-ivory">{order.orderNo}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {new Date(order.createdAt).toLocaleDateString("en-IN")} · {order.items.length} item{order.items.length > 1 ? "s" : ""}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-display text-gold">{inr(order.total)}</span>
                            <OrderStatusBadge status={order.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="border border-border bg-card p-10 text-center">
                    <Package className="w-10 h-10 text-gold/30 mx-auto mb-3" />
                    <h3 className="font-display text-xl text-ivory">No orders yet</h3>
                    <p className="text-sm text-muted-foreground mt-2">Your order history will appear here after your first purchase.</p>
                    <Link to="/shop" className="btn-gold mt-5 inline-block">Start Shopping</Link>
                  </div>
                )}

                {/* Quick actions */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <Link to="/track-order" className="flex items-center gap-3 p-4 border border-border bg-card hover:border-gold/40 transition-colors group">
                    <Truck className="w-5 h-5 text-gold" />
                    <div>
                      <div className="text-sm font-medium group-hover:text-gold transition-colors">Track an Order</div>
                      <div className="text-xs text-muted-foreground">Check your delivery status</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
                  </Link>
                  <a
                    href="https://wa.me/919633419902?text=Hello%20Rassa%20Boutique%2C%20I%20need%20help%20with%20my%20account."
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-4 border border-border bg-card hover:border-gold/40 transition-colors group"
                  >
                    <MessageCircle className="w-5 h-5 text-gold" />
                    <div>
                      <div className="text-sm font-medium group-hover:text-gold transition-colors">Get Support</div>
                      <div className="text-xs text-muted-foreground">WhatsApp us for quick help</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
                  </a>
                </div>
              </div>
            )}

            {/* ── ORDERS ── */}
            {tab === "orders" && (
              <div>
                <h2 className="font-display text-2xl mb-5">My Orders</h2>
                {myOrders.length === 0 ? (
                  <div className="border border-border bg-card p-12 text-center">
                    <ShoppingBag className="w-10 h-10 text-gold/30 mx-auto mb-3" />
                    <h3 className="font-display text-xl">No orders yet</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Your orders will appear here once you've made a purchase.</p>
                    <Link to="/shop" className="btn-gold mt-5 inline-block">Shop Now</Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myOrders.map((order) => (
                      <OrderCard key={order.orderNo} order={order} onCancel={() => cancelOrder(order.orderNo)} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── WISHLIST ── */}
            {tab === "wishlist" && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-display text-2xl">Saved Items</h2>
                  <Link to="/wishlist" className="text-[10px] tracking-luxury uppercase text-gold">Full Wishlist →</Link>
                </div>
                {wishlistProducts.length === 0 ? (
                  <div className="border border-border bg-card p-12 text-center">
                    <Heart className="w-10 h-10 text-gold/30 mx-auto mb-3" />
                    <h3 className="font-display text-xl">No saved items</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Tap the ❤️ on any product to save it here.</p>
                    <Link to="/shop" className="btn-gold mt-5 inline-block">Browse Shop</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {wishlistProducts.map((p) => (
                      <Link key={p.id} to="/product/$id" params={{ id: p.id }} className="group block border border-border bg-card p-3 hover:border-gold/40 transition-colors">
                        <div className="aspect-[3/4] overflow-hidden mb-3">
                          <img src={p.images[0]} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="text-[10px] tracking-luxury uppercase text-muted-foreground">{p.category}</div>
                        <div className="font-serif text-sm leading-snug mt-0.5 group-hover:text-gold transition-colors line-clamp-2">{p.name}</div>
                        <div className="text-sm text-gold mt-1">{inr(p.price)}</div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── ADDRESSES ── */}
            {tab === "addresses" && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-display text-2xl">Saved Addresses</h2>
                </div>
                {user.defaultAddress ? (
                  <div className="border border-gold/30 bg-card p-5 relative">
                    <div className="absolute top-3 right-3 text-[10px] tracking-luxury uppercase text-gold bg-gold/10 px-2 py-0.5">Default</div>
                    <MapPin className="w-4 h-4 text-gold mb-2" />
                    <div className="text-sm text-ivory">{user.defaultAddress.address}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {user.defaultAddress.city}, {user.defaultAddress.state} — {user.defaultAddress.pincode}
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed border-border bg-card p-10 text-center">
                    <MapPin className="w-8 h-8 text-gold/30 mx-auto mb-3" />
                    <h3 className="font-display text-xl">No saved address</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Your delivery address will be saved after your first order.</p>
                  </div>
                )}
              </div>
            )}

            {/* ── PROFILE ── */}
            {tab === "profile" && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-display text-2xl">My Profile</h2>
                  <button onClick={() => setEditMode(v => !v)} className="text-[10px] tracking-luxury uppercase text-gold border border-gold/50 px-4 py-2 hover:bg-gold hover:text-onyx transition-all">
                    {editMode ? "Cancel" : "Edit Profile"}
                  </button>
                </div>
                <div className="border border-border bg-card p-6 space-y-5">
                  {[
                    { icon: User, label: "Full Name", key: "name" as const, value: user.name, readonly: false },
                    { icon: Mail, label: "Email Address", key: "email" as const, value: user.email, readonly: true },
                    { icon: Phone, label: "Phone / WhatsApp", key: "phone" as const, value: user.phone || "—", readonly: false },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-[10px] tracking-luxury uppercase text-gold mb-2">{field.label}</label>
                      {editMode && !field.readonly ? (
                        <input
                          value={profileForm[field.key]}
                          onChange={(e) => setProfileForm(f => ({ ...f, [field.key]: e.target.value }))}
                          className="w-full bg-background border border-border px-4 py-3 text-sm outline-none focus:border-gold transition-colors"
                        />
                      ) : editMode && field.readonly ? (
                         <div className="flex items-center gap-3 text-sm text-ivory/50 py-3 px-4 border border-border bg-background/50 cursor-not-allowed">
                          <field.icon className="w-4 h-4 text-gold/50" />
                          {field.value}
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 text-sm text-ivory py-3 px-4 border border-border bg-background">
                          <field.icon className="w-4 h-4 text-gold" />
                          {field.value}
                        </div>
                      )}
                    </div>
                  ))}

                  {editMode && (
                    <button className="btn-gold w-full" onClick={async () => {
                      try {
                        await authActions.updateUser({ name: profileForm.name, phone: profileForm.phone });
                        setEditMode(false);
                      } catch (err) {
                        alert("Failed to update profile");
                      }
                    }}>Save Changes</button>
                  )}
                </div>

                <div className="mt-6 p-5 border border-red-500/20 bg-red-500/5">
                  <h3 className="font-medium text-sm text-red-400 mb-2">Sign Out</h3>
                  <p className="text-xs text-muted-foreground mb-3">You'll need to sign in again to access your orders and wishlist.</p>
                  <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-red-400 border border-red-400/50 px-4 py-2 hover:bg-red-500 hover:text-white transition-all">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order, onCancel }: { order: Order; onCancel: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const canCancel = order.status === "placed" || order.status === "confirmed";

  const timeline: Order["status"][] = ["placed", "confirmed", "processing", "shipped", "out_for_delivery", "delivered"];
  const currentIdx = timeline.indexOf(order.status);

  return (
    <div className="border border-border bg-card">
      {/* Order header */}
      <div className="p-5 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-[10px] tracking-luxury uppercase text-gold">Order</div>
          <div className="font-display text-xl text-ivory mt-0.5">{order.orderNo}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            {" · "}
            {order.items.length} item{order.items.length > 1 ? "s" : ""}
          </div>
        </div>
        <div className="text-right">
          <OrderStatusBadge status={order.status} />
          <div className="font-display text-xl text-gold mt-1">{inr(order.total)}</div>
        </div>
      </div>

      {/* Progress bar */}
      {order.status !== "cancelled" && order.status !== "returned" && (
        <div className="px-5 pb-4">
          <div className="flex items-center gap-1">
            {timeline.map((s, i) => (
              <div key={s} className={`h-1 flex-1 rounded-full ${i <= currentIdx ? "bg-gold" : "bg-border"}`} />
            ))}
          </div>
          <div className="flex justify-between mt-1.5 text-[9px] text-muted-foreground">
            <span>Placed</span>
            <span>Delivered</span>
          </div>
        </div>
      )}

      {/* Items preview */}
      <div className="px-5 pb-4 flex gap-2">
        {order.items.slice(0, 4).map((item, i) => (
          <div key={i} className="w-14 aspect-[3/4] overflow-hidden border border-border shrink-0">
            <img src={item.image} alt={item.name} loading="lazy" className="w-full h-full object-cover" />
          </div>
        ))}
        {order.items.length > 4 && (
          <div className="w-14 aspect-[3/4] border border-border flex items-center justify-center text-xs text-muted-foreground">
            +{order.items.length - 4}
          </div>
        )}
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-border px-5 py-5 space-y-4">
          {order.items.map((item, i) => (
            <div key={i} className="flex gap-3 text-sm">
              <div className="w-16 aspect-[3/4] overflow-hidden shrink-0">
                <img src={item.image} alt={item.name} loading="lazy" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="font-serif leading-snug">{item.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">Size: {item.size} · Colour: {item.color} · Qty: {item.quantity}</div>
                <div className="text-gold text-sm mt-1">{inr(item.price * item.quantity)}</div>
              </div>
            </div>
          ))}
          <div className="pt-3 border-t border-border text-sm space-y-1.5">
            <div className="flex justify-between text-muted-foreground"><span>Delivery</span><span>{order.address}, {order.city}, {order.state} — {order.pincode}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Payment</span><span>{order.paymentMethod}</span></div>
            {order.estimatedDelivery && <div className="flex justify-between text-muted-foreground"><span>Estimated</span><span className="text-gold">{order.estimatedDelivery}</span></div>}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="px-5 py-3 border-t border-border flex items-center gap-3 flex-wrap">
        <button onClick={() => setExpanded(v => !v)} className="text-xs text-gold border border-gold/50 px-3 py-1.5 hover:bg-gold hover:text-onyx transition-all">
          {expanded ? "Hide Details" : "View Details"}
        </button>
        <Link to="/track-order" className="text-xs text-muted-foreground border border-border px-3 py-1.5 flex items-center gap-1.5 hover:border-gold hover:text-gold transition-all">
          <Truck className="w-3.5 h-3.5" />
          Track Order
        </Link>
        <a
          href={`https://wa.me/919633419902?text=Hello%20Rassa%20Boutique%2C%20I%20need%20help%20with%20order%20${encodeURIComponent(order.orderNo)}.`}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-muted-foreground border border-border px-3 py-1.5 flex items-center gap-1.5 hover:border-gold hover:text-gold transition-all"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          Get Help
        </a>
        {canCancel && (
          <button onClick={onCancel} className="text-xs text-red-400 border border-red-400/50 px-3 py-1.5 flex items-center gap-1.5 hover:bg-red-500 hover:text-white transition-all ml-auto">
            <XCircle className="w-3.5 h-3.5" />
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
}
