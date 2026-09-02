import { createClient } from '@supabase/supabase-js';

const url = "https://pjjiwghqfonoirxtpkgd.supabase.co";
const key = "sb_publishable_cfp0bMan8m7a113w3U6uQw_p1nZco9n";
const supabase = createClient(url, key);

async function checkLogin() {
  const { data: { users }, error: uErr } = await supabase.auth.admin?.listUsers() || { data: {} };
  // I don't have service role, so I can't list users.
  
  // Let's just fetch the profile of admin@rassa.com if I can.
  // Actually, I can't without their UUID.
  // Wait, I HAVE their UUID! "f3c21b63-d638-4427-bf66-80b13a05cc04"
  
  const { data: profile, error: profError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', 'f3c21b63-d638-4427-bf66-80b13a05cc04')
      .single();
      
  console.log("Profile:", profile);
  console.log("Profile Error:", profError);
}

checkLogin();
