import fs from "fs";
let content = fs.readFileSync("src/routes/shop.tsx", "utf-8");
content = content.replace('import { useProducts } from "@/lib/productStore";\nimport { useCMS } from "@/lib/cms";\n', "");
fs.writeFileSync("src/routes/shop.tsx", content);
