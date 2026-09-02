import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://pjjiwghqfonoirxtpkgd.supabase.co";
const serviceRoleKey = "sb_secret_UZ7Eerf_NiqEa3KUiI3yZw_u03SAeU1";

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function run() {
  const keep = ['brown women red cotton', 'testin', 'BROWN WOMEN PURE COTTON SAREE 11'];
  
  console.log("Deleting mock products (bypassing RLS with service_role key)...");
  
  const { data, error } = await supabase.from('products').delete().not('name', 'in', '("brown women red cotton","testin","BROWN WOMEN PURE COTTON SAREE 11")');
  if (error) {
    console.error("Delete Error:", error);
  } else {
    console.log("Deletion successful.");
  }
  
  console.log("--- 1. Product Count ---");
  const pCount = await supabase.from('products').select('*', { count: 'exact', head: true });
  console.log("COUNT:", pCount.count);
  
  console.log("\n--- 2. Latest 30 Products ---");
  const pList = await supabase.from('products').select('id, name, created_at').order('created_at', { ascending: false }).limit(30);
  console.table(pList.data);
  
  console.log("\n--- 3. Category Count ---");
  const cCount = await supabase.from('categories').select('*', { count: 'exact', head: true });
  console.log("COUNT:", cCount.count);
}
run();
