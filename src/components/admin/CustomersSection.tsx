import { useOrders } from "@/lib/orders";
import { inr } from "@/lib/products";
import { MessageCircle, Users } from "lucide-react";

export function AdminCustomers() {
  const { orders } = useOrders();

  // Aggregate customers from orders
  const customerMap = new Map<string, {
    name: string; phone: string; email: string;
    orderCount: number; totalSpent: number; lastOrderDate: string;
  }>();

  orders.forEach(o => {
    const existing = customerMap.get(o.customerPhone);
    if (existing) {
      existing.orderCount += 1;
      existing.totalSpent += o.status !== "cancelled" ? o.total : 0;
      if (o.createdAt > existing.lastOrderDate) existing.lastOrderDate = o.createdAt;
    } else {
      customerMap.set(o.customerPhone, {
        name: o.customerName,
        phone: o.customerPhone,
        email: o.customerEmail ?? "",
        orderCount: 1,
        totalSpent: o.status !== "cancelled" ? o.total : 0,
        lastOrderDate: o.createdAt,
      });
    }
  });

  const customers = Array.from(customerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl">Customers</h1>
        <p className="text-xs text-muted-foreground mt-0.5">{customers.length} unique customers from order history</p>
      </div>

      {customers.length === 0 ? (
        <div className="border border-border bg-card p-12 text-center">
          <Users className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
          <div className="text-sm text-muted-foreground">No customers yet. They'll appear here after their first order.</div>
        </div>
      ) : (
        <div className="border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background">
                <th className="text-left px-4 py-3 text-[10px] tracking-luxury uppercase text-gold font-normal">Customer</th>
                <th className="text-right px-4 py-3 text-[10px] tracking-luxury uppercase text-gold font-normal">Orders</th>
                <th className="text-right px-4 py-3 text-[10px] tracking-luxury uppercase text-gold font-normal hidden md:table-cell">Total Spent</th>
                <th className="text-left px-4 py-3 text-[10px] tracking-luxury uppercase text-gold font-normal hidden lg:table-cell">Last Order</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {customers.map(c => (
                <tr key={c.phone} className="hover:bg-gold/5 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-ivory">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.phone}</div>
                    {c.email && <div className="text-xs text-muted-foreground">{c.email}</div>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-medium text-ivory">{c.orderCount}</span>
                  </td>
                  <td className="px-4 py-3 text-right text-gold hidden md:table-cell">
                    {inr(c.totalSpent)}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground hidden lg:table-cell">
                    {new Date(c.lastOrderDate).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`https://wa.me/${c.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hello ${c.name}, thank you for shopping with Rassa Boutique!`)}`}
                      target="_blank" rel="noreferrer"
                      className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300 transition-colors">
                      <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="p-4 border border-border bg-card/50 text-xs text-muted-foreground">
        <strong className="text-gold">Phase 4:</strong> Customer loyalty points, birthday offers, VIP tags, saved addresses, wishlist history and blocked user management will be available after Supabase integration.
      </div>
    </div>
  );
}
