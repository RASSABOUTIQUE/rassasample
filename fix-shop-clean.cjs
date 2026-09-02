const fs = require('fs');
let content = fs.readFileSync('restored-shop.tsx', 'utf-8');
// Clean up any rogue text at the end of the file
content = content.replace('The above content shows the entire, complete file contents of the requested file.', '');

content = content.replace('import {\n  products,\n  categories,\n  occasions,\n  inr,\n  type Category,\n  type Occasion,\n} from "@/lib/products";', 'import {\n  products as staticProducts,\n  categories as staticCategories,\n  occasions,\n  inr,\n  type Category,\n  type Occasion,\n} from "@/lib/products";\nimport { useProducts } from "@/lib/productStore";\nimport { useCMS } from "@/lib/cms";');
content = content.replace('const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);', 'const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);\n  \n  const { products, loading: productsLoading } = useProducts();\n  const { cms, loading: cmsLoading } = useCMS();\n  const dynamicCategories = cms?.categories.filter((c) => c.isVisible) || [];\n  const loading = productsLoading || cmsLoading;');
content = content.replace('!query ||\n        p.name.toLowerCase().includes(query.toLowerCase()) ||\n        p.category.toLowerCase().includes(query.toLowerCase());', '!query ||\n        p.name.toLowerCase().includes(query.toLowerCase()) ||\n        p.category?.toLowerCase().includes(query.toLowerCase());');
content = content.replace('const matchOcc = !selectedOccasion || p.occasions.includes(selectedOccasion);', 'const matchOcc = !selectedOccasion || (p.occasions && p.occasions.includes(selectedOccasion));');
content = content.replace('}, [query, selectedCategory, selectedOccasion, sort, maxPrice, showInStockOnly]);', '}, [products, query, selectedCategory, selectedOccasion, sort, maxPrice, showInStockOnly]);');
content = content.replace('{categories.map((c) => (', '{dynamicCategories.map((c) => (');
content = content.replace('{/* Product grid */}\n        {filtered.length === 0 ? (', '{/* Product grid */}\n        {loading ? null : filtered.length === 0 ? (');
content = content.replace(/p\.images\[0\]/g, 'p.images?.[0] || ""');
content = content.replace(/p\.sizes\[0\]/g, 'p.sizes?.[0]');
content = content.replace(/p\.colors\[0\]/g, 'p.colors?.[0]');

fs.writeFileSync('src/routes/shop.tsx', content);
console.log("Fixed shop.tsx");
