import { createClient } from '@supabase/supabase-js';
const url = "https://pjjiwghqfonoirxtpkgd.supabase.co";
const key = "sb_publishable_cfp0bMan8m7a113w3U6uQw_p1nZco9n";
const supabase = createClient(url, key);

async function run() {
  console.log("--- TASK 1: RETRIEVE UUID ---");
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'admin@rassa.com',
    password: 'rassa@admin2026'
  });
  
  if (authErr) {
    console.log("Login Error:", authErr.message);
    return;
  }
  
  const uuid = authData.user.id;
  console.log("Admin UUID:", uuid);
  
  const { data: profileCheck } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', uuid);
    
  console.log("Profile check for admin UUID:", profileCheck);

  console.log("--- TASK 2: INSPECT SCHEMA ---");
  const { data: anyProfile, error: anyProfErr } = await supabase
    .from('profiles')
    .select('*')
    .limit(1);
    
  if (anyProfErr) {
    console.log("Error reading any profile:", anyProfErr.message);
  } else {
    console.log("Sample Profile (to infer schema):", anyProfile && anyProfile[0] ? Object.keys(anyProfile[0]) : "No profiles found");
    if (anyProfile && anyProfile[0]) {
      console.log("Sample Profile Data:", JSON.stringify(anyProfile[0], null, 2));
    }
  }
  
  console.log("--- TASK 3 & 4: CREATE AND VERIFY PROFILE ---");
  // Expected role from AuthService.ts: 'ADMIN', 'MANAGER', 'STAFF'
  const newProfile = {
    id: uuid,
    first_name: 'Admin',
    last_name: 'User',
    email: 'admin@rassa.com',
    role: 'ADMIN' // based on AuthService.ts expectations
  };
  
  console.log("Attempting to insert:", newProfile);
  const { data: insertData, error: insertErr } = await supabase
    .from('profiles')
    .insert([newProfile])
    .select();
    
  if (insertErr) {
    console.log("Insert Error:", insertErr.message, insertErr.details);
  } else {
    console.log("Insert OK:", insertData);
    
    // Verify
    const { data: verifyData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', uuid)
      .single();
      
    console.log("Verification check:", verifyData);
  }
}
run();
