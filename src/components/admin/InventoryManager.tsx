import { useState } from "react";
import { Package, Search, AlertTriangle, AlertCircle } from "lucide-react";
import { useProducts, type ManagedProduct, inr } from "@/lib/productStore";

export function AdminInventory({ showToast }: { showToast: (msg: string, type?: "success" | "error") => void }) {
  const { products, updateStock, loading } = useProducts();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "low" | "out">("all");

  const filtered = products.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.sku?.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === "low") return p.stockCount > 0 && p.stockCount <= (p.lowStockThreshold || 3);
    if (filter === "out") return p.stockCount === 0 || !p.inStock;
    return true;
  });

  const handleStockUpdate = (id: string, count: number) => {
    updateStock(id, count);
    showToast("Stock updated.");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display text-ivory">Inventory Management</h2>
          <p className="text-xs text-muted-foreground mt-1">Quick stock updates and alerts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border p-4 rounded flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold"><Package className="w-5 h-5" /></div>
          <div><div className="text-2xl font-display text-ivory">{products.length}</div><div className="text-[10px] uppercase text-muted-foreground">Total Products</div></div>
        </div>
        <div className="bg-card border border-border p-4 rounded flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500"><AlertTriangle className="w-5 h-5" /></div>
          <div><div className="text-2xl font-display text-ivory">{products.filter(p => p.stockCount > 0 && p.stockCount <= (p.lowStockThreshold || 3)).length}</div><div className="text-[10px] uppercase text-muted-foreground">Low Stock</div></div>
        </div>
        <div className="bg-card border border-border p-4 rounded flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500"><AlertCircle className="w-5 h-5" /></div>
          <div><div className="text-2xl font-display text-ivory">{products.filter(p => p.stockCount === 0 || !p.inStock).length}</div><div className="text-[10px] uppercase text-muted-foreground">Out of Stock</div></div>
        </div>
      </div>

      <div className="bg-card border border-border">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 w-full sm:w-auto">
            <button onClick={() => setFilter("all")} className={`px-4 py-2 text-xs transition-colors ${filter === "all" ? "bg-gold text-onyx" : "bg-background border border-border text-muted-foreground hover:border-gold"}`}>All Stock</button>
            <button onClick={() => setFilter("low")} className={`px-4 py-2 text-xs transition-colors ${filter === "low" ? "bg-yellow-500 text-onyx" : "bg-background border border-border text-muted-foreground hover:border-yellow-500"}`}>Low Stock</button>
            <button onClick={() => setFilter("out")} className={`px-4 py-2 text-xs transition-colors ${filter === "out" ? "bg-red-500 text-ivory" : "bg-background border border-border text-muted-foreground hover:border-red-500"}`}>Out of Stock</button>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Search product or SKU..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-background border border-border pl-9 pr-4 py-2 text-sm outline-none focus:border-gold" />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
             <div className="text-center py-10 text-muted-foreground text-sm">Loading inventory...</div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-background text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">SKU</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium w-40">Stock Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(p => {
                  const isLow = p.stockCount > 0 && p.stockCount <= (p.lowStockThreshold || 3);
                  const isOut = p.stockCount === 0 || !p.inStock;
                  return (
                    <tr key={p.id} className="hover:bg-gold/5 transition-colors">
                      <td className="px-4 py-3 flex items-center gap-3">
                        <img src={p.images[0]} alt="" className="w-10 h-10 object-cover border border-border" />
                        <div>
                          <div className="font-serif text-ivory truncate max-w-[200px]">{p.name}</div>
                          <div className="text-[10px] text-muted-foreground">{p.category}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{p.sku}</td>
                      <td className="px-4 py-3">{inr(p.price)}</td>
                      <td className="px-4 py-3">
                        {isOut ? (
                          <span className="text-[10px] px-2 py-0.5 bg-red-900/50 text-red-400 border border-red-500/30 rounded-full">Out of Stock</span>
                        ) : isLow ? (
                          <span className="text-[10px] px-2 py-0.5 bg-yellow-900/50 text-yellow-400 border border-yellow-500/30 rounded-full">Low Stock</span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 bg-green-900/50 text-green-400 border border-green-500/30 rounded-full">In Stock</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleStockUpdate(p.id, Math.max(0, p.stockCount - 1))} className="w-7 h-7 bg-background border border-border flex items-center justify-center hover:border-gold">-</button>
                          <input type="number" value={p.stockCount} onChange={e => handleStockUpdate(p.id, parseInt(e.target.value) || 0)} className="w-16 bg-background border border-border px-2 py-1 text-center outline-none focus:border-gold" />
                          <button onClick={() => handleStockUpdate(p.id, p.stockCount + 1)} className="w-7 h-7 bg-background border border-border flex items-center justify-center hover:border-gold">+</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">No products match your criteria.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
