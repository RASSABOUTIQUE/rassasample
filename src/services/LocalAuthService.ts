import type { User } from "@/lib/auth";
import type { IAuthService, AdminUser } from "./AuthService";

export class LocalAuthService implements IAuthService {
  private readonly USERS_KEY = "rassa_user_v2";
  private readonly ADMINS_KEY = "rassa_admins_v1";

  // Mock initial admins
  private getAdmins(): AdminUser[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(this.ADMINS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      /* noop */
    }
    const defaultAdmins: AdminUser[] = [
      { id: "admin-1", email: "owner@rassa.com", name: "Rassa Owner", role: "ADMIN", isActive: true },
    ];
    localStorage.setItem(this.ADMINS_KEY, JSON.stringify(defaultAdmins));
    return defaultAdmins;
  }

  private setAdmins(admins: AdminUser[]) {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.ADMINS_KEY, JSON.stringify(admins));
    }
  }

  async login(email: string, password: string): Promise<{ ok: boolean; user?: User; error?: string }> {
    if (!password || password.length < 6) {
      return { ok: false, error: "Invalid email or password." };
    }
    
    // Check if it's a known user
    try {
      const raw = localStorage.getItem(this.USERS_KEY);
      if (raw) {
        const stored = JSON.parse(raw) as User;
        if (stored.email === email) {
          return { ok: true, user: stored };
        }
      }
    } catch {
      /* noop */
    }
    
    // Guest auto-creation for demo
    const user: User = {
      id: `u_${Date.now()}`,
      name: email.split("@")[0],
      email,
      phone: "",
      createdAt: new Date().toISOString(),
    };
    return { ok: true, user };
  }

  async signup(details: Omit<User, "id" | "createdAt"> & { password?: string }): Promise<{ ok: boolean; user?: User; error?: string }> {
    return {
      ok: true,
      user: {
        ...details,
        id: `u_${Date.now()}`,
        createdAt: new Date().toISOString(),
      }
    };
  }

  async updateUser(id: string, updates: Partial<Omit<User, "id" | "createdAt">>): Promise<User> {
    try {
      const raw = localStorage.getItem(this.USERS_KEY);
      if (raw) {
        const stored = JSON.parse(raw) as User;
        if (stored.id === id) {
          return { ...stored, ...updates };
        }
      }
    } catch {
      /* noop */
    }
    throw new Error("User not found");
  }

  async logout(): Promise<void> {
    // Local logout does nothing async, handled by auth.ts
  }

  async forgotPassword(email: string): Promise<{ ok: boolean; error?: string }> {
    return { ok: true };
  }

  async resetPassword(password: string): Promise<{ ok: boolean; error?: string }> {
    return { ok: true };
  }

  async loginAdmin(email: string, password: string): Promise<{ ok: boolean; admin?: AdminUser; error?: string }> {
    if (password === "rassa@admin2026") {
      const admins = this.getAdmins();
      // For demo, just return the first owner
      const owner = admins.find(a => a.role === "ADMIN") || admins[0];
      return { ok: true, admin: owner };
    }
    return { ok: false, error: "Incorrect email or password." };
  }

  async getAdminUsers(): Promise<AdminUser[]> {
    return this.getAdmins();
  }

  async addAdminUser(admin: Omit<AdminUser, "id">): Promise<AdminUser> {
    const admins = this.getAdmins();
    const newAdmin = { ...admin, id: `admin-${Date.now()}` };
    this.setAdmins([...admins, newAdmin]);
    return newAdmin;
  }

  async updateAdminUser(id: string, updates: Partial<AdminUser>): Promise<void> {
    const admins = this.getAdmins();
    const index = admins.findIndex(a => a.id === id);
    if (index !== -1) {
      admins[index] = { ...admins[index], ...updates };
      this.setAdmins(admins);
    }
  }

  async deleteAdminUser(id: string): Promise<void> {
    const admins = this.getAdmins();
    this.setAdmins(admins.filter(a => a.id !== id));
  }
}
