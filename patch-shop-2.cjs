
const fs = require("fs");
let content = fs.readFileSync("src/routes/shop.tsx", "utf8");

content = content.replace(
  /const \{ getVisible \} = useProducts\(\);/,
  "const { getVisible, loading: productsLoading } = useProducts();"
);

content = content.replace(
  /const \{ cms \} = useCMS\(\);/,
  "const { cms, loading: cmsLoading } = useCMS();\n  const isLoading = productsLoading || cmsLoading;"
);

const newGrid = `{/* Product grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-border/40 mb-3" />
                <div className="h-4 bg-border/40 w-3/4 mb-2" />
                <div className="h-4 bg-border/40 w-1/4" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (`;

content = content.replace(/\{\/\* Product grid \*\/\}\s*\{filtered\.length === 0 \? \(/, newGrid);

fs.writeFileSync("src/routes/shop.tsx", content);
console.log("Patched successfully with regex");

