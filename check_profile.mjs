import { createClient } from '@supabase/supabase-js';
const url = "https://pjjiwghqfonoirxtpkgd.supabase.co";
const key = "sb_publishable_cfp0bMan8m7a113w3U6uQw_p1nZco9n";
const supabase = createClient(url, key);

async function run() {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', 'f3c21b63-d638-4427-bf66-80b13a05cc04').single();
  console.log("Profile check:");
  if (error) {
    console.log("ERROR:", error.message);
  } else {
    console.log("PROFILE:", data);
  }
}
run();
