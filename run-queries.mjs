import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf-8');
const lines = env.split('\n');
const url = lines.find(l => l.startsWith('VITE_SUPABASE_URL=')).split('=')[1].replace(/"/g, '').trim();
const key = lines.find(l => l.startsWith('VITE_SUPABASE_ANON_KEY=')).split('=')[1].replace(/"/g, '').trim();

const supabase = createClient(url, key);

async function run() {
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
