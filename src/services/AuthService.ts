import type { User } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export type Role = "ADMIN" | "MANAGER" | "STAFF" | "CUSTOMER";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  isActive: boolean;
}

export interface IAuthService {
  login(email: string, password: string): Promise<{ ok: boolean; user?: User; error?: string }>;
  signup(details: Omit<User, "id" | "createdAt"> & { password?: string }): Promise<{ ok: boolean; user?: User; error?: string }>;
  updateUser(id: string, updates: Partial<Omit<User, "id" | "createdAt">>): Promise<User>;
  logout(): Promise<void>;
  forgotPassword(email: string): Promise<{ ok: boolean; error?: string }>;
  resetPassword(password: string): Promise<{ ok: boolean; error?: string }>;
  loginAdmin(email: string, password: string): Promise<{ ok: boolean; admin?: AdminUser; error?: string }>;
  getAdminUsers(): Promise<AdminUser[]>;
  addAdminUser(admin: Omit<AdminUser, "id">): Promise<AdminUser>;
  updateAdminUser(id: string, updates: Partial<AdminUser>): Promise<void>;
  deleteAdminUser(id: string): Promise<void>;
}

export class SupabaseAuthService implements IAuthService {
  
  async login(email: string, password: string): Promise<{ ok: boolean; user?: User; error?: string }> {
    console.log("[AuthService] Starting login for:", email);
    
    // Helper to add timeout
    const withTimeout = <T>(promise: Promise<T>, ms: number, label: string): Promise<T> => {
      let timeoutId: any;
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
      });
      return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
    };

    try {
      console.log("[AuthService] Calling signInWithPassword...");
      const { data, error } = await withTimeout(
        supabase.auth.signInWithPassword({ email, password }),
        45000,
        "signInWithPassword"
      );
      console.log("[AuthService] signInWithPassword returned:", { data, error });

      if (error || !data.user) {
        return { ok: false, error: error?.message || "Login failed" };
      }

      console.log("[AuthService] Fetching profile...");
      const { data: profile, error: profileError } = await withTimeout(
        supabase.from('profiles').select('*').eq('id', data.user.id).single(),
        45000,
        "fetch profile"
      );
      console.log("[AuthService] Profile fetch returned:", { profile, profileError });

      return { 
        ok: true, 
        user: {
          id: data.user.id,
          email: data.user.email || email,
          name: profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : email.split("@")[0],
          phone: profile?.phone || "",
          createdAt: data.user.created_at,
        } 
      };
    } catch (err: any) {
      console.error("[AuthService] Exception in login:", err);
      return { ok: false, error: err.message || "Login request failed or timed out." };
    }
  }

  async signup(details: Omit<User, "id" | "createdAt"> & { password?: string }): Promise<{ ok: boolean; user?: User; error?: string }> {
    if (!details.password) return { ok: false, error: "Password is required" };

    const [firstName, ...lastNameParts] = (details.name || "").split(" ");
    const lastName = lastNameParts.join(" ");

    const { data, error } = await supabase.auth.signUp({
      email: details.email,
      password: details.password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        }
      }
    });

    if (error || !data.user) {
      return { ok: false, error: error?.message || "Signup failed" };
    }

    return { 
      ok: true, 
      user: {
        id: data.user.id,
        email: details.email,
        name: details.name,
        phone: details.phone,
        createdAt: data.user.created_at,
      }
    };
  }

  async updateUser(id: string, updates: Partial<Omit<User, "id" | "createdAt">>): Promise<User> {
    const [firstName, ...lastNameParts] = (updates.name || "").split(" ");
    const lastName = lastNameParts.join(" ");
    
    const payload: any = {};
    if (updates.name) {
      payload.first_name = firstName;
      payload.last_name = lastName;
    }
    if (updates.phone) payload.phone = updates.phone;

    const { data, error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) throw new Error(error?.message || "Failed to update profile");

    return {
      id: data.id,
      email: data.email,
      name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
      phone: data.phone || "",
      createdAt: data.created_at,
    };
  }

  async logout(): Promise<void> {
    await supabase.auth.signOut();
  }

  async forgotPassword(email: string): Promise<{ ok: boolean; error?: string }> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }

  async resetPassword(password: string): Promise<{ ok: boolean; error?: string }> {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }

  async loginAdmin(email: string, password: string): Promise<{ ok: boolean; admin?: AdminUser; error?: string }> {
    console.log("[ADMIN TRACE] before signInWithPassword");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log("[ADMIN TRACE] after signInWithPassword", data, error);

    if (error || !data.user) {
      return { ok: false, error: error?.message || "Login failed" };
    }

    // Verify role is admin or manager
    console.log("[ADMIN TRACE] before profile query");
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
    console.log("[ADMIN TRACE] after profile query", profile, profileError);

    if (!profile || !['ADMIN', 'MANAGER', 'STAFF'].includes(profile.role)) {
      await supabase.auth.signOut();
      return { ok: false, error: "Access denied. Insufficient privileges." };
    }

    return { 
      ok: true, 
      admin: {
        id: data.user.id,
        email: data.user.email || email,
        name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || email.split('@')[0],
        role: profile.role,
        isActive: true,
      }
    };
  }

  async getAdminUsers(): Promise<AdminUser[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .in('role', ['ADMIN', 'MANAGER', 'STAFF']);
      
    if (error || !data) return [];
    
    return data.map((p: any) => ({
      id: p.id,
      email: p.email,
      name: `${p.first_name || ''} ${p.last_name || ''}`.trim(),
      role: p.role,
      isActive: true,
    }));
  }

  async addAdminUser(admin: Omit<AdminUser, "id">): Promise<AdminUser> {
    // Adding admin users strictly requires inviting them via Supabase Admin API or giving them a signup link and changing their role.
    // For now we will mock this or throw an error.
    throw new Error("Admin user creation must be done via Supabase Dashboard");
  }

  async updateAdminUser(id: string, updates: Partial<AdminUser>): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ role: updates.role })
      .eq('id', id);
    if (error) throw new Error(error.message);
  }

  async deleteAdminUser(id: string): Promise<void> {
    throw new Error("Admin deletion must be done via Supabase Dashboard");
  }
}

// Fallback for local development if Supabase isn't configured yet
import { isSupabaseConfigured } from "@/lib/supabase";
import { LocalAuthService } from "./LocalAuthService"; // We will extract local logic there

export const authService = isSupabaseConfigured ? new SupabaseAuthService() : new LocalAuthService();
