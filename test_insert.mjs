import { createClient } from '@supabase/supabase-js';
const url = "https://pjjiwghqfonoirxtpkgd.supabase.co";
const key = "sb_publishable_cfp0bMan8m7a113w3U6uQw_p1nZco9n";
const supabase = createClient(url, key);

async function run() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'admin@rassa.com',
    password: 'rassa@admin2026'
  });
  console.log("Login:", error ? error.message : "SUCCESS");
  
  const { error: insertErr } = await supabase.from("products").insert({
    name: "Test Admin Insert",
    slug: "test-admin-insert",
    is_active: true
  });
  console.log("Product Insert Error:", insertErr);
}
run();
