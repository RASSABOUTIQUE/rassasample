import { createClient } from '@supabase/supabase-js';
const url = "https://pjjiwghqfonoirxtpkgd.supabase.co";
const key = "sb_publishable_cfp0bMan8m7a113w3U6uQw_p1nZco9n";
const supabase = createClient(url, key);

async function run() {
  await supabase.auth.signInWithPassword({
    email: 'admin@rassa.com',
    password: 'rassa@admin2026'
  });
  
  const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', 'f3c21b63-d638-4427-bf66-80b13a05cc04')
      .single();
      
  console.log("With .single():", { data, error });
}
run();
