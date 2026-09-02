const fs = require('fs');
let content = fs.readFileSync('restored-shop.tsx', 'utf-8');
// Clean up any rogue text at the end of the file
content = content.replace('The above content shows the entire, complete file contents of the requested file.', '');

// Use regex with \s* for newlines/spaces to make it robust
content = content.replace(/import\s*\{\s*products,\s*categories,\s*occasions,\s*inr,\s*type\s*Category,\s*type\s*Occasion,\s*\}\s*from\s*"@\/lib\/products";/, 'import {\n  products as staticProducts,\n  categories as staticCategories,\n  occasions,\n  inr,\n  type Category,\n  type Occasion,\n} from "@/lib/products";\nimport { useProducts } from "@/lib/productStore";\nimport { useCMS } from "@/lib/cms";');
content = content.replace(/const\s*\[recentlyViewed,\s*setRecentlyViewed\]\s*=\s*useState<string\[\]>\(\[\]\);/, 'const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);\n  \n  const { products, loading: productsLoading } = useProducts();\n  const { cms, loading: cmsLoading } = useCMS();\n  const dynamicCategories = cms?.categories.filter((c) => c.isVisible) || [];\n  const loading = productsLoading || cmsLoading;');
content = content.replace(/!query\s*\|\|\s*p\.name\.toLowerCase\(\)\.includes\(query\.toLowerCase\(\)\)\s*\|\|\s*p\.category\.toLowerCase\(\)\.includes\(query\.toLowerCase\(\)\);/, '!query ||\n        p.name.toLowerCase().includes(query.toLowerCase()) ||\n        p.category?.toLowerCase().includes(query.toLowerCase());');
content = content.replace(/const\s*matchOcc\s*=\s*!selectedOccasion\s*\|\|\s*p\.occasions\.includes\(selectedOccasion\);/, 'const matchOcc = !selectedOccasion || (p.occasions && p.occasions.includes(selectedOccasion));');
content = content.replace(/},\s*\[query,\s*selectedCategory,\s*selectedOccasion,\s*sort,\s*maxPrice,\s*showInStockOnly\]\);/, '}, [products, query, selectedCategory, selectedOccasion, sort, maxPrice, showInStockOnly]);');
content = content.replace(/\{categories\.map\(\(c\)\s*=>\s*\(/g, '{dynamicCategories.map((c) => (');
content = content.replace(/\{\/\*\s*Product\s*grid\s*\*\/\}\s*\{filtered\.length\s*===\s*0\s*\?\s*\(/, '{/* Product grid */}\n        {loading ? null : filtered.length === 0 ? (');
content = content.replace(/p\.images\[0\]/g, 'p.images?.[0] || ""');
content = content.replace(/p\.sizes\[0\]/g, 'p.sizes?.[0]');
content = content.replace(/p\.colors\[0\]/g, 'p.colors?.[0]');

fs.writeFileSync('src/routes/shop.tsx', content);
console.log("Fixed shop.tsx with regex");
