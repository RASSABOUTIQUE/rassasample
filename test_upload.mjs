import { createClient } from '@supabase/supabase-js';
const url = "https://pjjiwghqfonoirxtpkgd.supabase.co";
const key = "sb_publishable_cfp0bMan8m7a113w3U6uQw_p1nZco9n";
const supabase = createClient(url, key);

async function run() {
  console.log("Logging in...");
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'admin@rassa.com',
    password: 'rassa@admin2026'
  });
  
  if (authErr) {
    console.log("Login Error:", authErr.message);
    return;
  }
  
  console.log("Logged in. Testing upload as authenticated admin...");
  const dummyFile = new Blob(["test"], { type: "text/plain" });
  const { data: upData, error: upError } = await supabase.storage
    .from("rassa-assets")
    .upload("products/test-upload-admin.txt", dummyFile, { upsert: false });
    
  if (upError) {
    console.log("UPLOAD ERROR:", upError.message);
  } else {
    console.log("UPLOAD OK:", upData);
  }
}
run();
