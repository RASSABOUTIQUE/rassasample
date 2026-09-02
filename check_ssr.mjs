async function fetchSSR() {
  try {
    const res = await fetch("http://localhost:8080/shop");
    const text = await res.text();
    if (text.includes("No products found")) {
      console.log("SSR: No products found");
    }
    if (text.includes("Loading Collection...")) {
      console.log("SSR: Loading Collection...");
    }
    const match = text.match(/<div class="grid[^>]*>.*?<\/div>/s);
    if (match) {
      console.log("SSR grid found!");
    }
    
    // Check for products
    const productCount = (text.match(/class="group reveal"/g) || []).length;
    console.log("SSR products count:", productCount);
  } catch(e) {
    console.error("fetch failed", e.message);
  }
}
fetchSSR();
