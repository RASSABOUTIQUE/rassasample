const fs = require("fs");
let content = fs.readFileSync("src/routes/shop.tsx", "utf-8");
const target = `import { useWishlist } from "@/lib/wishlist";`;
const replacement = `import { useWishlist } from "@/lib/wishlist";\r\nimport { useProducts } from "@/lib/productStore";\r\nimport { useCMS } from "@/lib/cms";`;
content = content.replace(target, replacement);
fs.writeFileSync("src/routes/shop.tsx", content);
console.log("Imports added.");
