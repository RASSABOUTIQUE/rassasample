
const fs = require("fs");
let content = fs.readFileSync("src/routes/shop.tsx", "utf8");

content = content.replace(
  "const { getVisible } = useProducts();",
  "const { getVisible, loading: productsLoading } = useProducts();"
);

content = content.replace(
  "const { cms } = useCMS();",
  "const { cms, loading: cmsLoading } = useCMS();\n  const isLoading = productsLoading || cmsLoading;"
);

const oldGrid = "{/* Product grid */}\n        {filtered.length === 0 ? (";
const newGrid = "{/* Product grid */}\n        {isLoading ? (\n          <div className=\"grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6\">\n            {Array.from({ length: 8 }).map((_, i) => (\n              <div key={i} className=\"animate-pulse\">\n                <div className=\"aspect-[3/4] bg-border/40 mb-3\" />\n                <div className=\"h-4 bg-border/40 w-3/4 mb-2\" />\n                <div className=\"h-4 bg-border/40 w-1/4\" />\n              </div>\n            ))}\n          </div>\n        ) : filtered.length === 0 ? (";

content = content.replace(oldGrid, newGrid);
fs.writeFileSync("src/routes/shop.tsx", content);
console.log("Patched successfully");

