const fs = require("fs");
let content = fs.readFileSync("src/routes/shop.tsx", "utf-8");
content = `import { useProducts } from "@/lib/productStore";\nimport { useCMS } from "@/lib/cms";\n` + content;
fs.writeFileSync("src/routes/shop.tsx", content);
