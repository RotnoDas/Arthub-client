"use client";
import { apiFetch } from "@/lib/api";
import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { FaUsers, FaSearch, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

export default function ManageUsersPage() {
  const { data: sessionData } = authClient.useSession();
  const user = sessionData?.user;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/users`);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch { toast.error("Failed to load users."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/users/role/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) { toast.success(`Role updated to ${newRole}`); fetchUsers(); }
    } catch { toast.error("Failed to update role."); }
  };

  const handleDeleteClick = (userId, userName) => {
    setItemToDelete({ id: userId, name: userName });
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      const res = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/users/${itemToDelete.id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("User deleted successfully.");
        fetchUsers();
        setDeleteModalOpen(false);
      } else {
        toast.error("Failed to delete user.");
      }
    } catch {
      toast.error("Error deleting user.");
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
    }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const roleBadge = (role) => {
    const map = { admin: "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400", artist: "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400", user: "bg-surface-solid text-foreground" };
    return map[role] || map.user;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">Manage Users</h1>
          <p className="text-muted">View all users and change their roles.</p>
        </div>
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-xs" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="pl-8 pr-4 py-2.5 rounded-xl bg-background border border-border text-foreground placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500/60 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/60 dark:focus:ring-indigo-500/30 transition w-64 shadow-sm dark:shadow-none"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-background shadow-sm overflow-hidden transition-colors duration-500">
        {loading ? (
          <div className="p-12 text-center text-muted animate-pulse">Loading users...</div>
        ) : filtered.length === 0 ? (
          <div className="p-14 text-center">
            <FaUsers className="mx-auto text-5xl text-slate-300 dark:text-slate-700 mb-4" />
            <p className="text-muted font-medium">{search ? "No users match your search." : "No users found."}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-border bg-slate-50 dark:bg-slate-900/50">
                  {["User", "Email", "Role", "Change Role", "Delete"].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-muted uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u._id} className="border-b border-border hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || "U")}&background=e2e8f0&color=475569&bold=true`}
                          alt={u.name}
                          className="w-9 h-9 rounded-full object-cover border border-border"
                        />
                        <span className="font-semibold text-foreground">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-muted text-xs">{u.email}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${roleBadge(u.role)}`}>
                        {u.role || "user"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {u._id !== user?.id ? (
                        <select
                          defaultValue=""
                          onChange={(e) => {
                            if (e.target.value) {
                              handleRoleChange(u._id, e.target.value);
                              e.target.value = '';
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-surface-solid text-foreground text-xs font-semibold cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-border focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500/50"
                        >
                          <option value="" disabled className="bg-background">Change Role</option>
                          <option value="user" className="bg-background">👤 Make User</option>
                          <option value="artist" className="bg-background">🎨 Make Artist</option>
                          <option value="admin" className="bg-background">🛡️ Make Admin</option>
                        </select>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500 text-xs font-medium">You</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {u._id !== user?.id ? (
                        <button
                          onClick={() => handleDeleteClick(u._id, u.name)}
                          className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 flex items-center justify-center transition-colors cursor-pointer"
                          title="Delete user"
                        >
                          <FaTrash size={12} />
                        </button>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-600 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {!loading && <p className="text-muted text-sm px-1">{filtered.length} of {users.length} user{users.length !== 1 ? "s" : ""}</p>}

      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-background rounded-3xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200 border border-transparent dark:border-slate-800">
            <h3 className="text-xl font-bold text-red-600 dark:text-red-500 mb-2">Delete User</h3>
            <p className="text-muted font-medium mb-8">
              Are you sure you want to permanently delete "{itemToDelete?.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 rounded-xl font-bold text-muted hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                Cancel
              </button>
              <button onClick={confirmDelete} disabled={isDeleting} className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-md shadow-red-500/20 transition-colors disabled:opacity-50">
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
