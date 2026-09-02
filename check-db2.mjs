import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const env = fs.readFileSync(".env", "utf-8");
const urlMatch = env.match(/VITE_SUPABASE_URL=(.+)/);
const keyMatch = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/);

const url = urlMatch[1].replace(/"/g, "").trim();
const key = keyMatch[1].replace(/"/g, "").trim();

const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

async function check() {
  const { count } = await supabase.from("products").select("*", { count: "exact", head: true });
  console.log("COUNT =", count);
  
  const { data, error } = await supabase.from("products").select("id, name, created_at").order("created_at", { ascending: false });
  if (error) console.error("Error:", error);
  console.log("ROWS =");
  console.table(data);
}
check();
