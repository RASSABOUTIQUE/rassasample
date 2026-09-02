-- 1. Ensure pgcrypto is enabled (needed for password hashing)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Fix the trigger to be absolutely bulletproof
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    'CUSTOMER'
  )
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. Create the Admin user directly in auth.users (Bypassing Auth API to avoid 500 errors)
DO $$
DECLARE
  new_admin_id UUID := gen_random_uuid();
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@rassa.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, 
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data, 
      created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      new_admin_id,
      'authenticated',
      'authenticated',
      'admin@rassa.com',
      crypt('rassa@admin2026', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"first_name":"Super","last_name":"Admin"}',
      now(),
      now(),
      '', '', '', ''
    );
  END IF;
END $$;

-- 4. Ensure the profile has the ADMIN role
UPDATE public.profiles 
SET role = 'ADMIN' 
WHERE email = 'admin@rassa.com';
