
const fs = require("fs");
let content = fs.readFileSync("src/routes/shop.tsx", "utf8");

content = content.replace(
  `import { products, categories, inr, type Category, type Product } from "@/lib/products";`,
  `import { inr, type Category } from "@/lib/products";\nimport { useProducts, type ManagedProduct as Product } from "@/lib/productStore";\nimport { useCMS } from "@/lib/cms";\nimport { Filter } from "lucide-react";`
);

content = content.replace(
  `function ShopPage() {\n  const [query, setQuery] = useState("");`,
  `function ShopPage() {\n  const { getVisible, loading: productsLoading } = useProducts();\n  const { cms, loading: cmsLoading } = useCMS();\n  const products = getVisible();\n  const categories = cms?.categories.filter(c => c.isVisible) || [];\n  const isLoading = productsLoading || cmsLoading;\n\n  const [query, setQuery] = useState("");`
);

const oldGrid = `{/* Products */}`;
const newGrid = `{/* Products */}\n        {isLoading ? (\n          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">\n            {Array.from({ length: 8 }).map((_, i) => (\n              <div key={i} className="animate-pulse">\n                <div className="aspect-[3/4] bg-border/40 mb-3" />\n                <div className="h-4 bg-border/40 w-3/4 mb-2" />\n                <div className="h-4 bg-border/40 w-1/4" />\n              </div>\n            ))}\n          </div>\n        ) : list.length === 0 ? (\n          <div className="text-center py-24">\n            <Filter className="w-12 h-12 text-gold/30 mx-auto mb-4" />\n            <h3 className="font-display text-2xl">No products found</h3>\n            <p className="mt-2 text-muted-foreground text-sm">Try adjusting your filters or search term.</p>\n            <button onClick={() => { setQuery(""); setCat("All"); }} className="btn-gold mt-6">Clear Filters</button>\n          </div>\n        ) : (`;

content = content.replace(oldGrid, newGrid);
content = content.replace(
  /categories\.map\(\(c\)/g,
  `categories.map((c) => c.name).map((c)`
);

// We also need to add a closing curly brace for the new ternary block around the product grid:
content = content.replace(
  `              </article>\n            ))}\n          </div>`,
  `              </article>\n            ))}\n          </div>\n        )}`
);


fs.writeFileSync("src/routes/shop.tsx", content);
console.log("Integration done");

