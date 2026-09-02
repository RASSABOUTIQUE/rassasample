import { createClient } from '@supabase/supabase-js';
const url = "https://pjjiwghqfonoirxtpkgd.supabase.co";
const key = "sb_publishable_cfp0bMan8m7a113w3U6uQw_p1nZco9n";
const supabase = createClient(url, key);

async function run() {
  console.log("1. Calling signInWithPassword...");
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'admin@rassa.com',
    password: 'rassa@admin2026'
  });
  console.log("signIn result:", error ? error.message : "SUCCESS");
  
  console.log("2. Immediately calling getSession()...");
  const { data: sessionData } = await supabase.auth.getSession();
  console.log("Session present?", !!sessionData.session);
  
  console.log("3. Query profiles...");
  const { data: profile, error: profErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();
  console.log("Profile retrieved?", !!profile, profErr?.message);
  
  console.log("4. Check role...");
  const roleOk = profile && ['ADMIN', 'MANAGER', 'STAFF'].includes(profile.role);
  console.log("Role OK?", roleOk);
  
  if (!roleOk) {
     console.log("SIGN OUT TRIGGERED!");
     await supabase.auth.signOut();
  }
  
  console.log("5. Check session again...");
  const { data: session2 } = await supabase.auth.getSession();
  console.log("Session present?", !!session2.session);
  
  console.log("6. Simulating loadProfile...");
  const [profileRes, addressRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", data.user.id).single(),
    supabase
      .from("addresses")
      .select("*")
      .eq("profile_id", data.user.id)
      .eq("type", "SHIPPING")
      .order("created_at", { ascending: false })
      .limit(1)
      .single(),
  ]);
  console.log("Address query error?", addressRes.error?.message);
  
  console.log("7. Check session one more time...");
  const { data: session3 } = await supabase.auth.getSession();
  console.log("Session present?", !!session3.session);
}
run();
