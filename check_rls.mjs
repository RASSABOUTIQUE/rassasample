import { createClient } from '@supabase/supabase-js';
const url = "https://pjjiwghqfonoirxtpkgd.supabase.co";
const key = "sb_publishable_cfp0bMan8m7a113w3U6uQw_p1nZco9n";
const supabase = createClient(url, key);

async function run() {
  // Check pg_policies
  const { data, error } = await supabase.from('pg_policies').select('*');
  if (error) {
    console.log("pg_policies ERROR:", error.message);
  } else {
    console.log("pg_policies DATA:", JSON.stringify(data, null, 2));
  }
}
run();
