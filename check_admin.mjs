import { createClient } from '@supabase/supabase-js';
const url = "https://pjjiwghqfonoirxtpkgd.supabase.co";
const key = "sb_publishable_cfp0bMan8m7a113w3U6uQw_p1nZco9n";
const supabase = createClient(url, key);

async function run() {
  console.log("Checking if admin@rassa.com exists via signInWithPassword...");
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'admin@rassa.com',
    password: 'rassa@admin2026'
  });
  
  if (error) {
    console.log("LOGIN ERROR:", error.message, error.status);
    // If it's "Invalid login credentials", it might exist but with a different password, 
    // or it might not exist at all. Let's check reset password.
  } else {
    console.log("LOGIN OK, USER ID:", data.user.id);
  }
}
run();
