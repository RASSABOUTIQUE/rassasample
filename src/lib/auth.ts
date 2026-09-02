import { useState, useEffect } from "react";
import { authService } from "@/services/AuthService";
import type { AdminUser, Role } from "@/services/AuthService";
import { supabase } from "@/lib/supabase";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  defaultAddress?: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
}

const ADMIN_KEY = "rassa_admin_session";
const isClient = typeof window !== "undefined";

let _user: User | null = null;
let _admin: AdminUser | null = null;
const _listeners = new Set<() => void>();
let _authLoaded = false;
let _authPromise: Promise<void> | null = null;

function broadcast() {
  _listeners.forEach((fn) => fn());
}

async function loadProfile(supabaseUser: any) {
  try {
    const [profileRes, addressRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", supabaseUser.id).single(),
      supabase
        .from("addresses")
        .select("*")
        .eq("profile_id", supabaseUser.id)
        .eq("type", "SHIPPING")
        .order("created_at", { ascending: false })
        .limit(1)
        .single(),
    ]);

    const profile = profileRes.data;
    const address = addressRes.data;

    _user = {
      id: supabaseUser.id,
      email: supabaseUser.email || "",
      name: profile?.first_name
        ? `${profile.first_name} ${profile.last_name || ""}`.trim()
        : supabaseUser.email?.split("@")[0] || "",
      phone: profile?.phone || "",
      createdAt: supabaseUser.created_at,
      defaultAddress: address
        ? {
            address: address.address_line1 || "",
            city: address.city || "",
            state: address.state || "",
            pincode: address.postal_code || "",
          }
        : undefined,
    };
  } catch (error) {
    console.error("Failed to load user profile:", error);
  }
}

import { isSupabaseConfigured } from "@/lib/supabase";

if (isClient && !_authPromise) {
  _authPromise = (async () => {
    if (!isSupabaseConfigured) {
      try {
        const stored = localStorage.getItem("rassa_user_v2");
        if (stored) _user = JSON.parse(stored);
      } catch (e) { console.error("Local auth parse failed", e); }
      if (isClient) {
        if (sessionStorage.getItem(ADMIN_KEY) === "1" && _user?.email !== "admin@rassa.com") {
          sessionStorage.removeItem(ADMIN_KEY);
        }
        if (sessionStorage.getItem(ADMIN_KEY) === "1") {
          const raw = localStorage.getItem("rassa_admins_v1");
          if (raw) {
            const admins = JSON.parse(raw);
            _admin = admins[0];
          }
        }
        _authLoaded = true;
        setTimeout(() => broadcast(), 100);
      }
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        if (sessionStorage.getItem(ADMIN_KEY) === "1" && session.user.email !== "admin@rassa.com") {
          sessionStorage.removeItem(ADMIN_KEY);
        }
        await loadProfile(session.user);
      }
    } catch (e) {
      console.error("Session fetch failed", e);
    } finally {
      _authLoaded = true;
      broadcast();
    }
  })();

  if (isSupabaseConfigured) {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        _user = null;
        _admin = null;
        sessionStorage.removeItem(ADMIN_KEY);
        _authLoaded = true;
        broadcast();
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
        if (session?.user) {
          await loadProfile(session.user);
        }
        _authLoaded = true;
        broadcast();
      }
    });
  }
}

export const authActions = {
  getUser: () => _user,
  getAdmin: () => _admin,

  async signup(details: Omit<User, "id" | "createdAt">): Promise<User> {
    const res = await authService.signup(details);
    if (!res.ok || !res.user) throw new Error(res.error || "Signup failed");
    if (!isSupabaseConfigured) {
      _user = res.user;
      localStorage.setItem("rassa_user_v2", JSON.stringify(_user));
      broadcast();
    }
    return res.user;
  },

  async login(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
    // Admin check (bypass for local demo)
    if (email === "admin@rassa.com" && password === "rassa@admin2026") {
      if (isClient) sessionStorage.setItem(ADMIN_KEY, "1");
      const res = await authService.loginAdmin(email, password);
      if (res.admin) _admin = res.admin;
      broadcast();
      return { ok: true };
    }

    // Clear any lingering admin session for regular users
    if (isClient) sessionStorage.removeItem(ADMIN_KEY);

    const res = await authService.login(email, password);
    
    if (!isSupabaseConfigured && res.ok && res.user) {
      _user = res.user;
      localStorage.setItem("rassa_user_v2", JSON.stringify(_user));
      broadcast();
    }
    
    return { ok: res.ok, error: res.error };
  },

  async logout() {
    await authService.logout();
    _admin = null;
    if (!isSupabaseConfigured) {
      _user = null;
      localStorage.removeItem("rassa_user_v2");
    }
    if (isClient) sessionStorage.removeItem(ADMIN_KEY);
    broadcast();
  },

  async updateUser(updates: Partial<Omit<User, "id" | "createdAt">>) {
    if (!_user) return;
    await authService.updateUser(_user.id, updates);
    // Reload user after update
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', _user.id).single();
    if (profile) {
      _user = {
        ..._user,
        name: profile.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : _user.name,
        phone: profile.phone || _user.phone,
      };
      broadcast();
    }
  },

  isAdmin(): boolean {
    if (!isClient) return false;
    return sessionStorage.getItem(ADMIN_KEY) === "1";
  },

  async loginAdmin(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
    console.log("[ADMIN TRACE] authActions.loginAdmin started");
    const res = await authService.loginAdmin(email, password);
    console.log("[ADMIN TRACE] authActions.loginAdmin received res", res);
    if (res.ok) {
      if (isClient) sessionStorage.setItem(ADMIN_KEY, "1");
      if (res.admin) _admin = res.admin;
      broadcast();
      return { ok: true };
    }
    return { ok: false, error: res.error };
  },
  
  // Role Management
  async getAdminUsers(): Promise<AdminUser[]> {
    return await authService.getAdminUsers();
  },
  
  async addAdminUser(admin: Omit<AdminUser, "id">): Promise<AdminUser> {
    const added = await authService.addAdminUser(admin);
    return added;
  },
  
  async updateAdminUser(id: string, updates: Partial<AdminUser>): Promise<void> {
    await authService.updateAdminUser(id, updates);
  },
  
  async deleteAdminUser(id: string): Promise<void> {
    await authService.deleteAdminUser(id);
  }
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(_user ? { ..._user } : null);
  const [admin, setAdmin] = useState<AdminUser | null>(_admin ? { ..._admin } : null);
  const [isAdmin, setIsAdmin] = useState(authActions.isAdmin());
  const [isInitializing, setIsInitializing] = useState(!_authLoaded);

  useEffect(() => {
    // Top-level listener handles _user updates
    if (_authLoaded) {
      setIsInitializing(false);
    }
    
    // Auto-load admin if session exists
    if (isClient && sessionStorage.getItem(ADMIN_KEY) === "1" && !_admin) {
      authService.getAdminUsers().then(admins => {
        _admin = admins[0] || null;
        setAdmin(_admin);
      });
    }

    setUser(_user ? { ..._user } : null);
    setIsAdmin(authActions.isAdmin());

    const update = () => {
      setUser(_user ? { ..._user } : null);
      setAdmin(_admin ? { ..._admin } : null);
      setIsAdmin(authActions.isAdmin());
      setIsInitializing(!_authLoaded);
    };
    _listeners.add(update);
    return () => {
      _listeners.delete(update);
    };
  }, []);

  return {
    user,
    admin,
    isLoggedIn: !!user || isAdmin,
    isAdmin,
    isInitializing,
    ...authActions,
  };
}
