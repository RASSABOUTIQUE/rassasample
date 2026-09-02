import { createClient } from '@supabase/supabase-js';
const url = "https://pjjiwghqfonoirxtpkgd.supabase.co";
const key = "sb_publishable_cfp0bMan8m7a113w3U6uQw_p1nZco9n";
const supabase = createClient(url, key);

async function run() {
  console.log("Starting loginAdmin simulation...");
  
  const email = 'admin@rassa.com';
  const password = 'rassa@admin2026';
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    console.log("Login failed");
    return;
  }
  
  console.log("Auth session after signIn:", !!(await supabase.auth.getSession()).data.session);

  const { data: profile, error: profErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  console.log("Profile retrieved:", JSON.stringify(profile));
  console.log("Profile error:", profErr);
  
  if (!profile || !['ADMIN', 'MANAGER', 'STAFF'].includes(profile.role)) {
    console.log("Condition met! Calling signOut()...");
    console.log("!profile =", !profile);
    console.log("includes =", profile ? ['ADMIN', 'MANAGER', 'STAFF'].includes(profile.role) : false);
    await supabase.auth.signOut();
  } else {
    console.log("Condition NOT met. signOut() is NOT called.");
  }
  
  console.log("Auth session after profile check:", !!(await supabase.auth.getSession()).data.session);
}
run();
