import { createClient } from '@supabase/supabase-js';

const url = "https://pjjiwghqfonoirxtpkgd.supabase.co";
const key = "sb_publishable_cfp0bMan8m7a113w3U6uQw_p1nZco9n";
const supabase = createClient(url, key);

async function checkLogin() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'admin@rassa.com',
    password: 'password'
  });
  
  if (error) {
    console.log("Login Error:", error);
    return;
  }
  
  console.log("Login Success! User:", data.user.id);
  
  const { data: profile, error: profError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
      
  console.log("Profile:", profile);
  console.log("Profile Error:", profError);
}

checkLogin();
