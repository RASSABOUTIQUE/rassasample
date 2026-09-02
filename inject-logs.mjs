
import fs from "fs";

// Inject logging into ProductService.ts
let ps = fs.readFileSync("src/services/ProductService.ts", "utf8");
if (!ps.includes("TRACE:")) {
  ps = ps.replace(
    "return (data || []).map(this.formatProduct);",
    `
    const rawData = data || [];
    console.log("[TRACE: 1. Raw Database Query] Products fetched:", rawData.length);
    if (rawData.length > 0) {
      console.log("[TRACE: Raw Sample]", { id: rawData[0].id, category_id: rawData[0].category_id, categories: rawData[0].categories });
    }
    const mapped = rawData.map(this.formatProduct);
    console.log("[TRACE: 2. Mapped Products] Count:", mapped.length);
    if (mapped.length > 0) {
      console.log("[TRACE: Mapped Sample]", { id: mapped[0].id, category: mapped[0].category, isHidden: mapped[0].isHidden });
    }
    return mapped;
    `
  );
  fs.writeFileSync("src/services/ProductService.ts", ps);
}

// Inject logging into shop.tsx
let shop = fs.readFileSync("src/routes/shop.tsx", "utf8");
if (!shop.includes("TRACE:")) {
  shop = shop.replace(
    "const filtered = useMemo(() => {",
    `const filtered = useMemo(() => {
    console.log("[TRACE: 3. Shop Input] products array length:", products.length);
    console.log("[TRACE: 3. Shop Input] selectedCategory:", selectedCategory);
    
    const visibleCount = products.filter(p => !p.isHidden).length;
    console.log("[TRACE: 3. Visible Products] (before shop filters):", visibleCount);
`
  );
  shop = shop.replace(
    "const matchCat = !selectedCategory || p.category === selectedCategory;",
    `const matchCat = !selectedCategory || p.category === selectedCategory;
      if (!matchCat && p.category === "KURTIS" && selectedCategory === "KURTIS") {
        console.error("[TRACE: WEIRD] p.category is", p.category, "but matchCat is false!");
      }`
  );
  shop = shop.replace(
    "return result;",
    `console.log("[TRACE: 4. Shop Output] Filtered result length:", result.length);
    if (result.length === 0 && products.length > 0) {
       console.log("[TRACE: Filter Breakdown]");
       let queryFail = 0, catFail = 0, occFail = 0, priceFail = 0, stockFail = 0;
       products.forEach(p => {
         const matchQuery = !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase());
         const matchCat = !selectedCategory || p.category === selectedCategory;
         const matchOcc = !selectedOccasion || (p.occasions || []).includes(selectedOccasion);
         const matchPrice = p.price <= maxPrice;
         const matchStock = !showInStockOnly || p.inStock;
         if (!matchQuery) queryFail++;
         if (!matchCat) catFail++;
         if (!matchOcc) occFail++;
         if (!matchPrice) priceFail++;
         if (!matchStock) stockFail++;
       });
       console.log({ total: products.length, queryFail, catFail, occFail, priceFail, stockFail });
    }
    return result;`
  );
  fs.writeFileSync("src/routes/shop.tsx", shop);
}
console.log("Logs injected successfully.");

