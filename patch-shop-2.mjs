
import fs from "fs";
let content = fs.readFileSync("src/routes/shop.tsx", "utf8");
content = content.replace(/\r\n/g, "\n");

const oldGrid = `{/* Products */}`;
const newGrid = `{/* Products */}\n        {isLoading ? (\n          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">\n            {Array.from({ length: 8 }).map((_, i) => (\n              <div key={i} className="animate-pulse">\n                <div className="aspect-[3/4] bg-border/40 mb-3" />\n                <div className="h-4 bg-border/40 w-3/4 mb-2" />\n                <div className="h-4 bg-border/40 w-1/4" />\n              </div>\n            ))}\n          </div>\n        ) : list.length === 0 ? (\n          <div className="text-center py-24">\n            <Filter className="w-12 h-12 text-gold/30 mx-auto mb-4" />\n            <h3 className="font-display text-2xl">No products found</h3>\n            <p className="mt-2 text-muted-foreground text-sm">Try adjusting your filters or search term.</p>\n            <button onClick={() => { setQuery(""); setCat("All"); }} className="px-6 py-2.5 bg-gradient-gold text-onyx tracking-luxury uppercase text-xs font-medium transition-transform hover:scale-105 active:scale-95 mt-6">Clear Filters</button>\n          </div>\n        ) : (`;

content = content.replace(oldGrid, newGrid);

// Close the ternary block at the end of the products mapping
content = content.replace(
  `              </article>\n            ))}\n          </div>`,
  `              </article>\n            ))}\n          </div>\n        )}`
);

fs.writeFileSync("src/routes/shop.tsx", content);
console.log("Done");

