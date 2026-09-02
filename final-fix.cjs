
const fs = require("fs");

// 1. Restore
const log = fs.readFileSync(String.raw`C:\Users\abhishekh\.gemini\antigravity-ide\brain\cce8dcac-b3e9-475f-98b6-6958baac154f\.system_generated\logs\transcript_full.jsonl`, "utf8");
const lines = log.split("\n");
let lastShopContent = "";
for (const line of lines) {
  if (!line) continue;
  try {
    const obj = JSON.parse(line);
    if (obj.content && obj.content.includes("File Path: ") && obj.content.includes("shop.tsx")) {
       const match = obj.content.match(/Showing lines 1 to (\d+)/);
       if (match && parseInt(match[1]) > 300) {
          const code = obj.content.substring(obj.content.indexOf("1: "));
          lastShopContent = code.split("\n").map(l => l.replace(/^[0-9]+:\s/, "")).join("\n");
       }
    }
  } catch (e) {}
}

if (!lastShopContent) {
  console.log("Failed to extract");
  process.exit(1);
}

// 2. Strip the garbage at the end
lastShopContent = lastShopContent.replace(/The above content shows the entire, complete file contents of the requested file\./g, "");
lastShopContent = lastShopContent.replace(/The above content does NOT show the entire file contents.*$/g, "");
lastShopContent = lastShopContent.trim() + "\n"; // Ensure it ends cleanly

// 3. Apply the patch
let content = lastShopContent;

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
console.log("Final fix applied successfully");

