"use client";
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

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/users");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch { toast.error("Failed to load users."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/role/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) { toast.success(`Role updated to ${newRole}`); fetchUsers(); }
    } catch { toast.error("Failed to update role."); }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!confirm(`Are you sure you want to permanently delete "${userName}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`http://localhost:5000/api/users/${userId}`, { method: "DELETE" });
      if (res.ok) { toast.success("User deleted successfully."); fetchUsers(); }
      else { toast.error("Failed to delete user."); }
    } catch { toast.error("Error deleting user."); }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const roleBadge = (role) => {
    const map = { admin: "bg-amber-100 text-amber-700", artist: "bg-indigo-100 text-indigo-700", user: "bg-slate-100 text-slate-700" };
    return map[role] || map.user;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Manage Users</h1>
          <p className="text-slate-500">View all users and change their roles.</p>
        </div>
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="pl-8 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/60 transition w-64 shadow-sm"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 animate-pulse">Loading users...</div>
        ) : filtered.length === 0 ? (
          <div className="p-14 text-center">
            <FaUsers className="mx-auto text-5xl text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">{search ? "No users match your search." : "No users found."}</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                {["User", "Email", "Role", "Change Role", "Delete"].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || "U")}&background=e2e8f0&color=475569&bold=true`}
                        alt={u.name}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                      <span className="font-semibold text-slate-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-600 text-xs">{u.email}</td>
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
                        className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer hover:bg-slate-200 transition-colors border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                      >
                        <option value="" disabled>Change Role</option>
                        <option value="user">👤 Make User</option>
                        <option value="artist">🎨 Make Artist</option>
                        <option value="admin">🛡️ Make Admin</option>
                      </select>
                    ) : (
                      <span className="text-slate-400 text-xs font-medium">You</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {u._id !== user?.id ? (
                      <button
                        onClick={() => handleDeleteUser(u._id, u.name)}
                        className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors cursor-pointer"
                        title="Delete user"
                      >
                        <FaTrash size={12} />
                      </button>
                    ) : (
                      <span className="text-slate-400 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {!loading && <p className="text-slate-500 text-sm px-1">{filtered.length} of {users.length} user{users.length !== 1 ? "s" : ""}</p>}
    </div>
  );
}
