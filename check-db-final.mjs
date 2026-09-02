import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const env = fs.readFileSync(".env", "utf-8");
const urlMatch = env.match(/VITE_SUPABASE_URL="?([^"\r\n]+)"?/);
const keyMatch = env.match(/VITE_SUPABASE_ANON_KEY="?([^"\r\n]+)"?/);

const url = urlMatch[1];
const key = keyMatch[1];

const supabase = createClient(url, key);

async function check() {
  const { data: products } = await supabase.from("products").select("name").order("created_at", { ascending: false });
  console.log("=== DB PRODUCTS ===");
  console.table(products);
  
  const { data: categories } = await supabase.from("categories").select("name, visible");
  console.log("=== DB CATEGORIES ===");
  console.table(categories);
}
check();
