import fs from "fs";
let content = fs.readFileSync("src/routes/shop.tsx", "utf-8");

// 1. Replace imports
content = content.replace(
`import {
  products,
  categories,
  occasions,
  inr,
  type Category,
  type Occasion,
} from "@/lib/products";`,
`import {
  products as staticProducts,
  categories as staticCategories,
  occasions,
  inr,
  type Category,
  type Occasion,
} from "@/lib/products";
import { useProducts } from "@/lib/productStore";
import { useCMS } from "@/lib/cms";`
);

// 2. Inject hooks
content = content.replace(
`  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);`,
`  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  
  const { products, loading: productsLoading } = useProducts();
  const { cms, loading: cmsLoading } = useCMS();
  const dynamicCategories = cms?.categories.filter((c) => c.isVisible) || [];
  const loading = productsLoading || cmsLoading;`
);

// 3. Fix filtered useMemo
content = content.replace(
`    let result = products.filter((p) => {
      const matchQuery =
        !query ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase());`,
`    let result = products.filter((p) => {
      const matchQuery =
        !query ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category?.toLowerCase().includes(query.toLowerCase());`
);

content = content.replace(
`      const matchOcc = !selectedOccasion || p.occasions.includes(selectedOccasion);`,
`      const matchOcc = !selectedOccasion || (p.occasions && p.occasions.includes(selectedOccasion));`
);

content = content.replace(
`  }, [query, selectedCategory, selectedOccasion, sort, maxPrice, showInStockOnly]);`,
`  }, [products, query, selectedCategory, selectedOccasion, sort, maxPrice, showInStockOnly]);`
);

// 4. Update categories array reference
content = content.replace(
`{categories.map((c) => (`,
`{dynamicCategories.map((c) => (`
);

// 5. Add loading state to grid
content = content.replace(
`        {/* Product grid */}
        {filtered.length === 0 ? (`,
`        {/* Product grid */}
        {loading ? null : filtered.length === 0 ? (`
);

// 6. Fix image mapping (there are multiple p.images[0])
content = content.replace(/p\.images\[0\]/g, `p.images?.[0] || ""`);

// 7. Fix sizes and colors mapping in addToCart
content = content.replace(/p\.sizes\[0\]/g, `p.sizes?.[0]`);
content = content.replace(/p\.colors\[0\]/g, `p.colors?.[0]`);

fs.writeFileSync("src/routes/shop.tsx", content);
console.log("shop.tsx patched successfully.");
