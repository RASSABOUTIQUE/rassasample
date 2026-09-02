import { useState, useEffect } from "react";
import { Users, Shield, Plus, Trash2, Edit2, CheckCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";
import type { AdminUser, Role } from "@/services/AuthService";

export function AdminRoleManager({ showToast }: { showToast: (msg: string, type?: "success" | "error") => void }) {
  const { admin, getAdminUsers, addAdminUser, updateAdminUser, deleteAdminUser } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({ name: "", email: "", role: "staff" as Role });

  const loadUsers = async () => {
    setLoading(true);
    const data = await getAdminUsers();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateAdminUser(editingId, formData);
      showToast("User updated successfully.");
      setEditingId(null);
    } else {
      await addAdminUser({ ...formData, isActive: true });
      showToast("User added successfully.");
      setShowAdd(false);
    }
    setFormData({ name: "", email: "", role: "staff" });
    loadUsers();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to remove this admin user?")) {
      await deleteAdminUser(id);
      showToast("User removed.");
      loadUsers();
    }
  };

  const handleToggleActive = async (user: AdminUser) => {
    if (user.role === "owner" && admin?.role !== "owner") {
      showToast("Only owners can modify owner accounts.", "error");
      return;
    }
    await updateAdminUser(user.id, { isActive: !user.isActive });
    showToast(`User ${!user.isActive ? "activated" : "deactivated"}.`);
    loadUsers();
  };

  const startEdit = (user: AdminUser) => {
    setFormData({ name: user.name, email: user.email, role: user.role });
    setEditingId(user.id);
    setShowAdd(true);
  };

  const ROLES: { id: Role; label: string; desc: string }[] = [
    { id: "owner", label: "Owner", desc: "Full access to all settings and roles." },
    { id: "manager", label: "Manager", desc: "Can manage products, orders, and CMS." },
    { id: "staff", label: "Staff", desc: "Can view and process orders only." },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display text-ivory">Role Management</h2>
          <p className="text-xs text-muted-foreground mt-1">Manage admin access and permissions.</p>
        </div>
        {admin?.role === "owner" && (
          <button onClick={() => { setShowAdd(true); setEditingId(null); setFormData({ name: "", email: "", role: "staff" }); }} className="btn-gold flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add User
          </button>
        )}
      </div>

      {showAdd && admin?.role === "owner" && (
        <form onSubmit={handleSave} className="bg-card border border-border p-5 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-ivory">{editingId ? "Edit User" : "Add New User"}</h3>
            <button type="button" onClick={() => setShowAdd(false)} className="text-muted-foreground hover:text-red-400 text-xs">Cancel</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase text-muted-foreground mb-1">Name</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-background border border-border px-3 py-2 text-sm outline-none focus:border-gold" />
            </div>
            <div>
              <label className="block text-[10px] uppercase text-muted-foreground mb-1">Email</label>
              <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-background border border-border px-3 py-2 text-sm outline-none focus:border-gold" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] uppercase text-muted-foreground mb-2">Role</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {ROLES.map(r => (
                  <label key={r.id} className={`flex items-start gap-3 p-3 border cursor-pointer transition-colors ${formData.role === r.id ? "border-gold bg-gold/5" : "border-border bg-background hover:border-gold/50"}`}>
                    <input type="radio" name="role" value={r.id} checked={formData.role === r.id} onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })} className="mt-1" />
                    <div>
                      <div className="text-sm font-medium text-ivory">{r.label}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{r.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <button type="submit" className="btn-gold text-xs px-4 py-2">{editingId ? "Save Changes" : "Add User"}</button>
        </form>
      )}

      {loading ? (
        <div className="text-center py-10 text-muted-foreground text-sm">Loading users...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map(u => (
            <div key={u.id} className={`bg-card border ${u.isActive ? "border-border" : "border-red-900/50 bg-red-950/10"} p-5 relative group`}>
              {!u.isActive && <div className="absolute top-3 right-3 text-[9px] uppercase text-red-400 bg-red-900/30 px-2 py-0.5 border border-red-500/30 rounded-full">Inactive</div>}
              {u.isActive && u.role === "owner" && <div className="absolute top-3 right-3 text-gold"><Shield className="w-4 h-4" /></div>}
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-display text-lg">
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-ivory">{u.name}</div>
                  <div className="text-xs text-muted-foreground">{u.email}</div>
                </div>
              </div>
              
              <div className="text-[10px] uppercase text-muted-foreground mb-4 bg-background border border-border inline-block px-2 py-1 rounded">
                Role: <span className={u.role === "owner" ? "text-gold" : "text-ivory"}>{u.role}</span>
              </div>

              {admin?.role === "owner" && u.id !== admin.id && (
                <div className="flex items-center gap-2 pt-3 border-t border-border mt-auto">
                  <button onClick={() => startEdit(u)} className="text-xs text-muted-foreground hover:text-gold flex items-center gap-1"><Edit2 className="w-3 h-3"/> Edit</button>
                  <button onClick={() => handleToggleActive(u)} className={`text-xs flex items-center gap-1 ${u.isActive ? "text-muted-foreground hover:text-red-400" : "text-green-400 hover:text-green-300"}`}>
                    <CheckCircle className="w-3 h-3"/> {u.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button onClick={() => handleDelete(u.id)} className="text-xs text-muted-foreground hover:text-red-400 ml-auto flex items-center gap-1"><Trash2 className="w-3 h-3"/> Remove</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
