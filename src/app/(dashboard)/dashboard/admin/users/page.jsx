"use client";
import React, { useState, useEffect } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { FaUsers, FaUserEdit, FaSearch } from "react-icons/fa";
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

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const roleBadge = (role) => {
    const map = { admin: "bg-yellow-500/10 text-yellow-400", artist: "bg-indigo-500/10 text-indigo-400", user: "bg-slate-500/10 text-slate-400" };
    return map[role] || map.user;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Manage Users</h1>
          <p className="text-slate-400">View all users and change their roles.</p>
        </div>
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="pl-8 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-yellow-500/60 transition w-64"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 animate-pulse">Loading users...</div>
        ) : filtered.length === 0 ? (
          <div className="p-14 text-center">
            <FaUsers className="mx-auto text-5xl text-slate-700 mb-4" />
            <p className="text-slate-400 font-medium">{search ? "No users match your search." : "No users found."}</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                {["User", "Email", "Role", "Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || "U")}&background=374151&color=9ca3af&bold=true`}
                        alt={u.name}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                      <span className="font-semibold text-white">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-300 text-xs">{u.email}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${roleBadge(u.role)}`}>
                      {u.role || "user"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {u._id !== user?.id ? (
                      <Dropdown>
                        <DropdownTrigger>
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 text-slate-300 text-xs font-semibold cursor-pointer hover:bg-white/15 transition-colors select-none">
                            <FaUserEdit size={11} /> Change Role
                          </div>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Change Role" onAction={key => handleRoleChange(u._id, key)}>
                          <DropdownItem key="user">👤 Make User</DropdownItem>
                          <DropdownItem key="artist">🎨 Make Artist</DropdownItem>
                          <DropdownItem key="admin" className="text-danger" color="danger">🛡️ Make Admin</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    ) : (
                      <span className="text-slate-600 text-xs">You</span>
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
