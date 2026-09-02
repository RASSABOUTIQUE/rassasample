import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://pjjiwghqfonoirxtpkgd.supabase.co";
const serviceRoleKey = "sb_secret_UZ7Eerf_NiqEa3KUiI3yZw_u03SAeU1";

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdmin() {
  console.log("Creating Admin User...");

  // 1. Create the user in auth.users
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: 'admin@rassa.com',
    password: 'rassa@admin2026',
    email_confirm: true,
    user_metadata: { first_name: 'Super', last_name: 'Admin' }
  });

  if (authError) {
    if (authError.message.includes('already exists')) {
      console.log("User already exists. Fetching user...");
    } else {
      console.error("Failed to create user:", authError.message);
      return;
    }
  }

  // Get the user ID (either newly created or existing)
  let userId;
  if (authData?.user) {
    userId = authData.user.id;
  } else {
    // If they already exist, we need to find their ID
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      console.error("Failed to list users:", listError.message);
      return;
    }
    const existing = users.users.find(u => u.email === 'admin@rassa.com');
    if (!existing) {
      console.error("Could not find existing user");
      return;
    }
    userId = existing.id;
  }

  console.log("User ID:", userId);

  // 2. Wait a second for the database trigger to create the profile row
  await new Promise(r => setTimeout(r, 1000));

  // 3. Update their role to ADMIN in the profiles table
  console.log("Upgrading profile to ADMIN role...");
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ role: 'ADMIN' })
    .eq('id', userId);

  if (profileError) {
    console.error("Failed to upgrade profile:", profileError.message);
    return;
  }

  console.log("✅ Admin user setup complete! You can now log in with admin@rassa.com / rassa@admin2026");
}

createAdmin();
